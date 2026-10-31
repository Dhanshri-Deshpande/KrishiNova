# 🚀 Krishinova Vercel Deployment Guide

This guide walks you through deploying Krishinova to **Vercel** with full serverless functionality, real-time Gmail OTP authentication, multilingual AI chatbot, and crop & water prediction.

---

## 🛠️ Step 1: Push Code to GitHub

1. Open your terminal in this project directory:
   ```bash
   git branch -M main
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. `krishinova-app`).

3. Link your local repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/krishinova-app.git
   git push -u origin main
   ```

---

## ⚡ Step 2: Import into Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New…** → **Project**.
3. Under **Import Git Repository**, find your `krishinova-app` repository and click **Import**.
4. Framework Preset: **Next.js** (Vercel automatically detects `vercel.json`).

---

## 🔑 Step 3: Add Environment Variables in Vercel

Before clicking **Deploy**, expand the **Environment Variables** section and add the following keys:

| Variable Name | Description | Example / Value |
|---|---|---|
| `VACHANA_API_KEY` | Vachana AI key for STT & TTS across 10 Indian languages | `vach_1ytE2CY5X2OtlnsfUU7svHoNhJtO0JQi3mRqA4m2DF87aee3esafAlOzHiBbCak6A9yuP4bSsjjbgJc3VA9MzmUZFe6dcSW0_f3425cc0e14a9cc99e2ccfb719b89cfa` |
| `GEMINI_API_KEY` | *(Recommended)* Google Gemini API Key for chatbot on cloud | `AIzaSy...` (Get free at [aistudio.google.com](https://aistudio.google.com/app/apikey)) |
| `GMAIL_USER` | Your Gmail address for real-time OTP delivery | `yourname@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-character Google App Password (not your normal password) | `abcd efgh ijkl mnop` (Get at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)) |
| `AUTH_SECRET` | Secret key for stateless OTP signature verification | `krishinova-secure-serverless-secret-2026` |
| `PYTHON_BACKEND_URL` | *(Optional)* External FastAPI backend URL if hosted on Render/Railway | `https://your-backend.onrender.com` |

---

## 🚢 Step 4: Click Deploy

1. Click **Deploy**.
2. Vercel will install dependencies and run `next build`.
3. In under 60 seconds, your application will be live at:
   `https://krishinova-app.vercel.app` (or custom domain).

---

## 🌾 Serverless Features Configured

* ✅ **Self-Contained Crop & Water Prediction**: Runs inside Vercel Serverless Functions (`/api/predict/crop` and `/api/predict/water`) with zero mixed-content (HTTP vs HTTPS) or CORS issues.
* ✅ **Real-Time Gmail OTP**: Uses Nodemailer + stateless HMAC token validation so OTPs verify reliably across any serverless instance.
* ✅ **Vercel-Optimized Chatbot**: Detects Vercel deployment, avoids local Ollama hangs, prioritizes Gemini or fast multilingual agronomy engine.
* ✅ **Leaflet Map**: Dynamically loaded with SSR disabled to prevent server-side window errors.
