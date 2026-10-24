# 🚀 Production Deployment & Firebase Database Guide
## Arya AI Tutor: Class 8 Mathematics Personalized Learning Assistant

This guide covers how to deploy the **Arya AI Tutor** application to **Vercel** as a live, production-grade cloud application and connect it to your live **Firebase Cloud Firestore Database**.

---

## 📁 1. Architecture Overview for Cloud Hosting

| Layer | Technology | File Location | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vanilla ES6 Modules + Glassmorphism CSS | `index.html`, `css/`, `js/` | Responsive SPA with 9 learning views, KaTeX math typesetting, and balance scale simulation. |
| **Vercel Serverless** | Express.js / Node.js Engine | `api/index.js`, `vercel.json` | Handles REST API endpoints serverlessly on Vercel with zero cold-start delay. |
| **Backend API** | Express.js REST API | `api/server.js` | 12 endpoints: health, AI proxy, student sync, quiz sync, doubts log, admin analytics. |
| **Cloud Database** | Firebase Cloud Firestore | `js/modules/firebase-service.js` | Real-time storage of learner profiles, problem attempts, quiz results, and teacher cohorts. |
| **Database Security**| Firestore Security Rules | `firestore.rules` | Production-grade role-based access control (Student vs Teacher/Admin). |
| **CLI Deployment** | Firebase CLI Config | `firebase.json`, `firestore.indexes.json`| Deploys security rules and composite indexes directly with `firebase deploy`. |

---

## ⚡ 2. Deploying to Vercel (2-Minute Setup)

The repository is already structured for zero-configuration Vercel deployment:
- `vercel.json` maps `/api/*` to the serverless entrypoint in `api/index.js`.
- All static assets (`index.html`, `css/`, `js/`, `project-report.html`, `AI_Tutor_Project_Report.pdf`) are served automatically by Vercel's global CDN.

### Method A: Deploy via GitHub (Recommended)
1. Initialize git and push the project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Arya AI Tutor platform"
   git remote add origin https://github.com/<your-username>/ai-tutor-project.git
   git push -u origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import your GitHub repository.
4. Keep the Framework Preset as **Other** (Root directory `./`).
5. (Optional) Add your Environment Variables under **Environment Variables** (see Section 4).
6. Click **Deploy**. Your app will be live at `https://your-project.vercel.app`!

### Method B: Deploy via Vercel CLI
1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run deployment from the project folder:
   ```bash
   cd "d:/AI Tutor Project"
   vercel
   ```
3. Follow the CLI prompts. For production, run:
   ```bash
   vercel --prod
   ```

---

## 🔥 3. Setting Up Your Live Firebase Database

### Step 1: Create a Firebase Project
1. Visit the **[Firebase Console](https://console.firebase.google.com/)**.
2. Click **Add project** and name it (e.g., `arya-ai-tutor`).
3. Under **Build ➔ Authentication**:
   - Enable **Google** sign-in provider.
   - Enable **Email/Password** sign-in provider.
4. Under **Build ➔ Firestore Database**:
   - Click **Create database**.
   - Choose your nearest cloud region (e.g., `asia-south1` or `us-central1`).
   - Start in **Production mode**.

### Step 2: Deploy Firestore Security Rules
Your project already contains production-ready `firestore.rules`. Deploy them in one command:
```bash
# 1. Login to Firebase CLI
npx firebase login

# 2. Select your Firebase project
npx firebase use --add

# 3. Deploy the rules and indexes
npx firebase deploy --only firestore:rules,firestore:indexes
```
*(Alternatively, copy the exact contents of `firestore.rules` and paste them into the **Rules** tab in the Firebase Console).*

### Step 3: Get Your Web App Configuration
1. In Firebase Console, go to **Project Settings** (⚙️ icon) ➔ **General**.
2. Scroll to **Your apps** and click the **Web (`</>`)** icon.
3. Register the app (e.g., `Arya-Web-Client`).
4. Copy the `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "arya-ai-tutor.firebaseapp.com",
     projectId: "arya-ai-tutor",
     storageBucket: "arya-ai-tutor.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

---

## 🔐 4. Environment Variables on Vercel

In your **Vercel Project Dashboard ➔ Settings ➔ Environment Variables**, add the following keys:

| Environment Variable | Example Value | Description |
| :--- | :--- | :--- |
| `FIREBASE_API_KEY` | `AIzaSyD-xxxxxxxxxxxx` | Web API Key from Firebase Console |
| `FIREBASE_AUTH_DOMAIN`| `your-project.firebaseapp.com` | Firebase Auth Domain |
| `FIREBASE_PROJECT_ID` | `your-project-id` | Firebase Project ID |
| `FIREBASE_STORAGE_BUCKET`| `your-project-id.appspot.com` | Cloud Storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID`| `1029384756` | Sender ID |
| `FIREBASE_APP_ID` | `1:1029384756:web:...` | Web Application ID |
| `GEMINI_API_KEY` | `AIzaSyB-xxxxxxxxxxxx` | (Optional) Google Gemini API Key |

> **Auto-Hydration:** The Express backend automatically serves these credentials to the client via `/api/config/firebase` so your live Vercel app automatically connects to your Firestore database without requiring students or teachers to enter keys manually!

---

## 🧪 5. Testing the Live Cloud Database from UI

1. Open your live application URL (or `http://localhost:8080/`).
2. Click **⚙️ Settings** or the **🟢 Cloud DB** badge in the top navigation bar.
3. Scroll to **🔥 Firebase Cloud Database & Vercel Sync**.
4. Click **🧪 Test Connection**.
5. The system performs a live write/read handshake to Firestore and displays:
   `✅ Connected! Successfully connected to Live Firestore project 'your-project-id'!`

---

## 📊 6. Firestore Database Schema Reference

The platform automatically creates and manages the following collections:

### 1. `users/{uid}`
```json
{
  "uid": "usr_aarav_sharma",
  "name": "Aarav Sharma",
  "email": "aarav.sharma@dps.edu",
  "role": "student",
  "avatar": "🚀",
  "difficulty": "Beginner",
  "xp": 240,
  "level": 2,
  "streak": 4,
  "lastActive": "2026-10-24T00:00:00Z"
}
```

### 2. `student_attempts/{attemptId}`
```json
{
  "studentId": "usr_aarav_sharma",
  "studentName": "Aarav Sharma",
  "problemId": "lin_step2_491",
  "topic": "Linear Equations",
  "subtopic": "Two-Step Equations",
  "question": "Solve for x: 3x + 4 = 19",
  "studentAnswer": "5",
  "targetAnswer": "5",
  "isCorrect": true,
  "hintsUsed": 1,
  "timestamp": "2026-10-24T00:05:00Z"
}
```

### 3. `quiz_sessions/{sessionId}`
```json
{
  "studentId": "usr_aarav_sharma",
  "score": 5,
  "totalQuestions": 5,
  "accuracy": 100,
  "xpEarned": 175,
  "durationSeconds": 142,
  "timestamp": "2026-10-24T00:10:00Z"
}
```

### 4. `doubts_chat/{doubtId}`
```json
{
  "studentId": "usr_aarav_sharma",
  "studentQuery": "Why does +4 become -4 when transposing?",
  "aiResponse": "Think of the equation like a balanced scale...",
  "source": "gemini-server",
  "timestamp": "2026-10-24T00:15:00Z"
}
```
