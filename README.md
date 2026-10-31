# 🌱 Krishinova - AI-Powered Decision Support System for Precision Agriculture

Krishinova is a full-stack smart agriculture platform featuring AI crop recommendations, intercropping guidance, irrigation water requirement calculation, hyper-local weather forecasting, and an AI voice chatbot with Text-to-Speech (TTS) and Speech-to-Text (STT) powered by Vachana AI.

---

## ⚡ Quick Start (Windows)

Double-click or run:
```bat
run.bat
```
This automatically launches both the **FastAPI ML Backend** (`http://localhost:8000`) and the **Next.js Frontend** (`http://localhost:3000`), and opens your browser.

---

## 🛠 Manual Startup (2 Terminals)

### Terminal 1: Python FastAPI ML Backend
```bash
py backend/main.py
```
* Runs on: `http://localhost:8000`
* Swagger API docs: `http://localhost:8000/docs`
* Provides real-time XGBoost ML crop predictions, companion intercropping, and water requirement calculations.

### Terminal 2: Next.js Frontend
```bash
npm run dev
```
* Runs on: `http://localhost:3000`
* Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 Features & Components

1. **AI Crop Prediction**:
   - Machine learning (XGBoost) model trained on soil nutrients ($N, P, K, pH$) and 4-year historical weather patterns.
2. **Water Requirement & Tank Management**:
   - Calculates daily Evapotranspiration ($ET_c$) against local rainfall and reservoir storage.
3. **Voice-Enabled KrishiBot**:
   - Multi-lingual voice chatbot in English, Hindi, Marathi, and Urdu.
   - Text-to-Speech and Speech-to-Text powered by **Vachana AI (Gnani.ai)**.
   - Works immediately with intelligent agricultural knowledge fallback even when local LLMs are offline.
