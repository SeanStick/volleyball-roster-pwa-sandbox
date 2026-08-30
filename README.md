# Go Stand Over There — Volleyball Roster PWA

A Progressive Web App (PWA) built with **Node.js** and **React** for collecting, managing, and visualizing volleyball player names, numbers, positions, and 6-player court rotations. Ready for 1-click deployment to **Google Cloud Firebase Hosting**.

![Go Stand Over There Preview](/icon.svg)

---

## 🏐 Key Features

- **Player Roster Management**: Collect player names, jersey numbers (0–99), primary/secondary positions, captain badges, starter status, height, and coach notes.
- **Dynamic Jersey Visualizer**: Interactive athletic SVG volleyball jersey updating in real-time as you enter player details.
- **Interactive 6-Zone Court & Rotations**: Standard FIVB/USAV volleyball 6-position court (Zones 1–6) with a rotation stepper simulating clockwise rotation cycles and server highlights.
- **Progressive Web App (PWA)**:
  - Works 100% offline via Service Worker (`sw.js`).
  - Home screen installable on iOS, Android, macOS, and Windows with custom PWA install prompt.
  - Offline-first persistence via LocalStorage / IndexedDB.
- **Google Cloud Firebase Integration**:
  - Pre-configured `firebase.json` for Firebase Hosting (SPA routing, clean URLs, and service worker cache headers).
  - Optional real-time cloud sync with Firebase Firestore.
- **Import & Export**: Backup and restore rosters using standard CSV (Excel) or JSON formats.

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
Ensure **Node.js** (v18+) and **npm** are installed on your machine.

### 2. Start the Development Server
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## ☁️ Deploying to Google Cloud Firebase Hosting

### 🌐 Live Deployment Environment:
- **Primary Live URL**: [https://volleyball-sandbox-app.web.app](https://volleyball-sandbox-app.web.app)
- **Alternate Domain**: [https://volleyball-sandbox-app.firebaseapp.com](https://volleyball-sandbox-app.firebaseapp.com)
- **Google Cloud / Firebase Project Instance**: `volleyball-roster-sandbox`
- **Firebase Console**: [https://console.firebase.google.com/project/volleyball-roster-sandbox/overview](https://console.firebase.google.com/project/volleyball-roster-sandbox/overview)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
# or use via npx without global install
```

### Step 2: Login to Firebase
```bash
npx firebase-tools login
```

### Step 3: Deploy to Firebase Hosting
```bash
npm run deploy
```
This builds the production bundle into `dist/` and deploys it immediately to the `volleyball-roster-sandbox` Firebase Project.

---

## 🛠️ Project Structure

```
volleyball-roster-pwa/
├── public/
│   ├── favicon.svg            # Volleyball Vector Favicon
│   ├── icon.svg               # High-res PWA App Icon
│   ├── manifest.webmanifest   # Web App Manifest for PWA installation
│   └── sw.js                  # Service Worker for offline caching
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Header with online/offline badge & modal triggers
│   │   ├── PlayerCard.jsx     # Athletic player card with jersey badge & quick actions
│   │   ├── PlayerModal.jsx    # Add/Edit modal with live SVG jersey preview
│   │   ├── JerseyVisualizer.jsx # Dynamic volleyball jersey graphic component
│   │   ├── CourtView.jsx      # 6-zone court rotation visualizer
│   │   ├── FirebaseSettingsModal.jsx # Cloud sync & Firebase Hosting controls
│   │   ├── ImportExportModal.jsx # CSV & JSON backup manager
│   │   └── InstallPrompt.jsx  # PWA installation banner
│   ├── services/
│   │   ├── storageService.js  # Offline persistence and CSV/JSON handlers
│   │   └── firebaseService.js # Google Cloud Firestore integration
│   ├── styles/
│   │   ├── index.css          # Main athletic dark theme & design system
│   │   └── court.css          # Volleyball court graphic & rotation styling
│   ├── App.jsx                # Main application state & tabs
│   └── main.jsx               # React DOM root & Service Worker registration
├── firebase.json              # Google Cloud Firebase Hosting config
├── .firebaserc.example        # Firebase project ID template
├── index.html                 # PWA HTML shell with athletic typography
├── package.json               # Node.js dependencies and scripts
└── vite.config.js             # Vite build configuration
```

---

## 📱 Installing on Mobile / Desktop

1. Open the deployed Firebase URL or local server in Chrome, Edge, or Safari.
2. Click the in-app **"Install"** button, or tap **Share > Add to Home Screen** on iOS Safari.
3. Go Stand Over There can now be launched directly like a native app and works seamlessly on the volleyball court sideline without Wi-Fi or cellular service!
