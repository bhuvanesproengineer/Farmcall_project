# 🌾 FarmCall – AI Voice-Based Agricultural Advisory Platform

> AI-powered voice communication platform delivering weather advisories, emergency alerts, and farming guidance to farmers through automated phone calls in their preferred language.

[![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg?logo=mongodb)](https://www.mongodb.com/)
[![Twilio](https://img.shields.io/badge/Twilio-Voice%20API-red.svg?logo=twilio)](https://www.twilio.com/)

---

## 🌾 Overview

**FarmCall** is an AI-powered agricultural communication platform designed to bridge the information gap for rural farmers. By combining real-time weather analytics, generative AI advisory scripts, text-to-speech voice synthesis, and automated telephony, FarmCall delivers personalized farming guidance and emergency notifications straight to farmers' mobile phones.

FarmCall operates seamlessly on both **feature phones** and **smartphones**, requiring **zero internet connectivity** or app installation on the farmer's end.

---

## ✨ Implemented Features

- 📊 **Interactive Dashboard**: Real-time analytics monitor displaying total farmers, lifetime & today's call statistics, answered calls with **Success Rate %**, unanswered calls with **Failure Rate %**, SMS sent, average call duration, recent logs preview, and one-click data clear.
- 👨‍🌾 **Farmer Directory & Management**: User-scoped CRUD operations (Register, Edit, Delete, Search) for farmer profiles with 10-digit mobile number validation.
- 📞 **Voice Call Execution**: Instant test call trigger for individual farmers and bulk calling for registered farmers.
- 📢 **Emergency Broadcast Alerts**: Voice broadcast alert system to instantly broadcast critical announcements to farmers.
- ⏰ **Automated Call Scheduling**: Background cron service (`node-cron`) matching daily IST scheduled times to execute daily weather & farming advisory calls automatically.
- 📜 **Call Logs & Tracking**: Comprehensive log monitor showing call status (`initiated`, `in-progress`, `completed`, `failed`), durations, SMS delivery status, 30-second auto-refresh, and clear logs functionality.
- 💬 **SMS Fallback**: Automatic backup SMS notification sent via Twilio when a voice call is unanswered or fails.
- 🎙️ **AI Voice Advisory**: Generates natural, conversational spoken scripts using Google Gemini (via OpenRouter API) and converts them into natural human voices using Murf AI.
- 🌐 **Multi-Language Support**: Complete voice & SMS advisory support for **English, Hindi, Malayalam, Tamil, Telugu, and Kannada**.
- 🏛️ **Multi-State Support**: Selection support for **Kerala, Andhra Pradesh, Telangana, Tamil Nadu, Karnataka, Maharashtra, Gujarat, Madhya Pradesh, Uttar Pradesh, Rajasthan, Punjab, Haryana, Bihar, West Bengal, and Odisha**.
- ☁️ **Weather-Based Farming Guidance**: Real-time weather data integration (Tomorrow.io & OpenWeather API) providing action-oriented advice on spraying, irrigation, harvesting, seed sowing, and crop protection.
- 📬 **Contact Form Integration**: Full-stack contact message handling saved to MongoDB with Nodemailer admin notification support.

---

## 🎯 Use Cases

- 🌦️ **Weather Alerts & Rainfall Guidance**
- 🚨 **Emergency Voice Broadcasts**
- 🐘 **Wildlife / Elephant Movement Warnings**
- 🌱 **Daily Farming & Pest Control Advisories**
- 🌾 **Seed Distribution & Fertilizer Guidance**
- 📢 **Government Agricultural Scheme Announcements**

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router DOM, JavaScript, Vanilla CSS |
| **Backend** | Node.js, Express.js (ES Modules), Node-Cron, Nodemailer |
| **Database** | MongoDB Atlas (Mongoose ORM) |
| **Authentication** | JWT (JSON Web Tokens) & Passwords Hashing |
| **Voice Call API** | Twilio Voice API |
| **Text-to-Speech (TTS)** | Murf AI Speech API |
| **Weather APIs** | Tomorrow.io API, OpenWeather API |
| **Generative AI** | OpenRouter API (Google Gemini 2.5 Flash Lite) |

---

## 🏗️ System Architecture

```text
                     React Frontend
                           │
                           ▼
                  Express.js Backend
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
 MongoDB Atlas       Weather APIs        OpenRouter AI
(User/Farmer/Logs) (Tomorrow/OpenWeather) (Gemini Advisory)
                           │
                           ▼
                Murf AI (Text-to-Speech)
                           │
                           ▼
                   Twilio Voice API
                           │
                           ▼
                  Farmers (Phone Call)
                           │
                           ▼
                 SMS Fallback (If Missed)
```

---

## 🔄 System Workflow

```text
User / Farmer Registration
           │
           ▼
     MongoDB Atlas
           │
           ▼
 Real-Time Weather Fetch
           │
           ▼
AI Advisory Generation (Gemini LLM)
           │
           ▼
Voice Synthesis (Murf AI TTS)
           │
           ▼
Twilio Automated Voice Call
           │
           ▼
     Call Log Record
           │
           ▼
SMS Fallback Trigger (If Unanswered/Failed)
```

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/bhuvanesproengineer/Farmcall_project.git
cd Farmcall_project
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
OPENROUTER_API_KEY=your_openrouter_api_key
MURF_API_KEY=your_murf_ai_api_key
TOMORROW_API_KEY=your_tomorrow_io_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
BASE_URL=https://your-backend-domain.com
EMAIL_USER=your_gmail_user@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **⚠️ Security Note:** Never commit `.env` files or private API keys to GitHub.

---

## 🌐 Live Demo

| Resource | Link |
|:---|:---|
| **GitHub Repository** | [github.com/bhuvanesproengineer/Farmcall_project](https://github.com/bhuvanesproengineer/Farmcall_project) |
| **Frontend Application** | [farmcall-project.vercel.app](https://farmcall-project.vercel.app/) |
| **Backend API** | [farmcall-project-1.onrender.com](https://farmcall-project-1.onrender.com) |

---

## 📁 Project Structure

```text
Farmcall_project/
│
├── backend/
│   ├── database/
│   │   └── db.js
│   ├── middleware/
│   │   └── authenticate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Farmer.js
│   │   ├── CallLog.js
│   │   ├── Automation.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── farmerRoutes.js
│   │   ├── callRoutes.js
│   │   ├── automationRoutes.js
│   │   ├── broadcastRoutes.js
│   │   ├── aiRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   ├── makeCall.js
│   │   ├── farmcall.js
│   │   ├── callAllFarmers.js
│   │   ├── farmerSummary.js
│   │   ├── getWeather.js
│   │   ├── text_to_speech.js
│   │   ├── backupMsg.js
│   │   ├── broad_cast.js
│   │   └── getShortMsg.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Farmers.jsx
│   │   │   ├── TestCall.jsx
│   │   │   ├── CallLogs.jsx
│   │   │   ├── Automation.jsx
│   │   │   ├── Broadcast.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Future Enhancements

- 📍 **Granular Geo-Targeting**: Call farmers filtered by Village, Mandal, District, or State.
- 📊 **Advanced Predictive Analytics**: Deep call conversion insights & weather trend forecasting.
- 🐛 **AI Crop Disease Diagnosis**: Audio & image-based pest/disease identification.
- 💰 **Real-Time Mandi Market Prices**: Automated voice updates on daily crop commodity rates.
- 🏦 **Direct Government Subsidy Alerts**: Instant notifications for agricultural scheme applications.
- 🤖 **Interactive Voice AI Assistant**: Two-way conversational IVR for farmer Q&A.

---

## 👨‍💻 Author

**Bhuvaneswaran**
- GitHub: [@bhuvanesproengineer](https://github.com/bhuvanesproengineer)

---

### ⭐ Support

If you find this project helpful, please consider giving it a **⭐ Star** on GitHub!
