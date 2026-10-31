import { NextResponse } from "next/server"

interface WaterRequest {
  forecast_temperature: number
  forecast_humidity: number
  forecast_rainfall_mm: number
  crop_stage: string
  area_acres: number
  current_tank_volume_liters: number
}

function calculateWaterRequirement(
  temperature: number,
  humidity: number,
  forecast_rainfall_mm: number,
  crop_stage: string,
  area_acres: number,
  tank_volume_liters: number
) {
  // 1. Base Evapotranspiration approximation (Simplified Penman-Monteith formula)
  const base_et = Math.max(1.0, temperature * 0.4 - humidity * 0.05)

  // 2. Crop Coefficient (Kc)
  const kc_values: Record<string, number> = {
    initial: 0.3,
    development: 0.8,
    mid_season: 1.15,
    late_season: 0.7,
  }
  const kc = kc_values[crop_stage.toLowerCase()] ?? 0.8

  // 3. Crop Evapotranspiration (ETc) in mm/day
  const etc_mm_per_day = base_et * kc

  // 4. Area in square meters (1 Acre = 4046.86 sqm)
  const area_sqm = area_acres * 4046.86

  // 5. Total volume required in Liters per day
  const total_water_required_liters = etc_mm_per_day * area_sqm

  // 6. Expected rainfall in Liters
  const expected_rainfall_liters = forecast_rainfall_mm * area_sqm

  // 7. Net requirement after rain
  const water_after_rain = Math.max(0, total_water_required_liters - expected_rainfall_liters)

  // 8. Net requirement considering tank storage
  const net_water_needed = Math.max(0, water_after_rain - tank_volume_liters)

  return {
    total_required_liters: Number(total_water_required_liters.toFixed(2)),
    expected_rainfall_liters: Number(expected_rainfall_liters.toFixed(2)),
    water_after_rain_liters: Number(water_after_rain.toFixed(2)),
    tank_volume_liters: Number(tank_volume_liters.toFixed(2)),
    net_water_needed_liters: Number(net_water_needed.toFixed(2)),
    pump_required: net_water_needed > 0,
  }
}

export async function POST(req: Request) {
  try {
    const data: WaterRequest = await req.json()

    // 1. If an external Python backend is hosted, try forwarding
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL
    if (pythonBackendUrl) {
      try {
        const response = await fetch(`${pythonBackendUrl.replace(/\/$/, "")}/predict/water`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(5000),
        })
        if (response.ok) {
          const result = await response.json()
          return NextResponse.json(result)
        }
      } catch (e: any) {
        console.warn("External Python backend not reachable, using built-in model:", e.message)
      }
    }

    // 2. Built-in Serverless Hydrology Calculation (100% reliable on Vercel)
    const result = calculateWaterRequirement(
      Number(data.forecast_temperature) || 28.0,
      Number(data.forecast_humidity) || 60.0,
      Number(data.forecast_rainfall_mm) || 0.0,
      data.crop_stage || "development",
      Number(data.area_acres) || 1.0,
      Number(data.current_tank_volume_liters) || 0.0
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in /api/predict/water:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to calculate water requirement." },
      { status: 500 }
    )
  }
}
