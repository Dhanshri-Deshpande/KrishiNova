"use client"

function downsampleBuffer(buffer: Float32Array, inputSampleRate: number, outputSampleRate: number): Float32Array {
  if (inputSampleRate === outputSampleRate) {
    return buffer
  }
  const sampleRateRatio = inputSampleRate / outputSampleRate
  const newLength = Math.round(buffer.length / sampleRateRatio)
  const result = new Float32Array(newLength)
  let offsetResult = 0
  let offsetBuffer = 0
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
    let accum = 0
    let count = 0
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i]
      count++
    }
    result[offsetResult] = count > 0 ? accum / count : buffer[offsetBuffer]
    offsetResult++
    offsetBuffer = nextOffsetBuffer
  }
  return result
}

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  writeString(0, "RIFF")
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM format
  view.setUint16(22, 1, true) // 1 channel (mono)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true) // byte rate (sampleRate * 1 channel * 2 bytes)
  view.setUint16(32, 2, true) // block align
  view.setUint16(34, 16, true) // 16 bits per sample
  writeString(36, "data")
  view.setUint32(40, samples.length * 2, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }

  return new Blob([buffer], { type: "audio/wav" })
}

export class AudioRecorder {
  private mediaStream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private processor: ScriptProcessorNode | null = null
  private source: MediaStreamAudioSourceNode | null = null
  private audioChunks: Float32Array[] = []
  private targetSampleRate = 16000

  async start(): Promise<void> {
    this.audioChunks = []

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    this.audioContext = new AudioContextClass()

    this.source = this.audioContext.createMediaStreamSource(this.mediaStream)
    // Buffer size 4096 gives balanced latency and audio block processing
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1)

    this.processor.onaudioprocess = (e) => {
      const channelData = e.inputBuffer.getChannelData(0)
      this.audioChunks.push(new Float32Array(channelData))
    }

    this.source.connect(this.processor)
    this.processor.connect(this.audioContext.destination)
  }

  async stop(): Promise<Blob | null> {
    if (!this.audioContext) return null

    // Disconnect audio nodes
    if (this.source) {
      try {
        this.source.disconnect()
      } catch (_) {}
      this.source = null
    }

    if (this.processor) {
      try {
        this.processor.disconnect()
      } catch (_) {}
      this.processor = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    const inputSampleRate = this.audioContext.sampleRate
    if (this.audioContext.state !== "closed") {
      try {
        await this.audioContext.close()
      } catch (_) {}
      this.audioContext = null
    }

    if (this.audioChunks.length === 0) return null

    // Merge audio chunks
    const totalLength = this.audioChunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const merged = new Float32Array(totalLength)
    let offset = 0
    for (const chunk of this.audioChunks) {
      merged.set(chunk, offset)
      offset += chunk.length
    }
    this.audioChunks = []

    // Downsample to 16kHz for optimal STT accuracy & speed
    const downsampled = downsampleBuffer(merged, inputSampleRate, this.targetSampleRate)

    return encodeWAV(downsampled, this.targetSampleRate)
  }

  cancel(): void {
    if (this.source) {
      try {
        this.source.disconnect()
      } catch (_) {}
      this.source = null
    }
    if (this.processor) {
      try {
        this.processor.disconnect()
      } catch (_) {}
      this.processor = null
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      try {
        this.audioContext.close()
      } catch (_) {}
      this.audioContext = null
    }
    this.audioChunks = []
  }
}
