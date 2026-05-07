# Deepfake Audio Detection - Frontend 🎙️🛡️

> A sleek, high-performance React frontend for analyzing, predicting, and managing deepfake audio detections in real-time.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

## ✨ Features

- **Dynamic Audio Analysis:** Drag and drop audio files (.wav, .mp3, .flac) and visualize predictions with high-confidence metrics.
- **Integrated Audio Player:** Play back your audio files directly in the browser before and after analysis.
- **Advanced Dashboard:** Monitor usage quotas, remaining predictions, and system health in a modern glassmorphic interface.
- **Comprehensive Auditing (Admin):** Administrators can view paginated histories, search by filename, filter by date ranges, and download robust CSV audit reports.
- **Per-Model Breakdown:** Advanced users get detailed metrics from 8 separate AI models (ResNet18 / LFCC / Mel-Spectrogram) combined into an ensemble prediction.
- **Robust Security:** JWT-based authentication via context and HTTP-only API interceptors.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Danish326/Deepfake-Audio-Detection-Frontend.git
   cd Deepfake-Audio-Detection-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```text
src/
├── api/          # API client configuration and interceptors
├── assets/       # Static media and global CSS
├── components/   # Reusable UI components (QuotaCard, PredictionResult)
├── context/      # React context providers (AuthContext)
├── pages/        # Main application views (Dashboard, History, Admin)
└── main.jsx      # Application entry point and routing
```

## 🔌 Backend Integration

This frontend is designed to work seamlessly with the [Deepfake Audio Detection Backend](https://github.com/Danish326/Deepfake-Audio-Detection).

By default, the Vite development server proxies `/api` requests to `http://localhost:80` (where the backend Nginx container runs). Ensure the backend Docker environment is running before attempting to log in or upload audio files.

## 📄 License

This project is part of a Final Year Project (FYP) and is licensed under the MIT License.
