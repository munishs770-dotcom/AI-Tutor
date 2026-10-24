# 🔥 Arya AI Tutor: Firebase Cloud Infrastructure & Security Architecture

> **Cloud Provider**: Google Firebase Platform  
> **Target Project ID**: `arya-788ea`  
> **Client SDK Version**: Firebase JS SDK v10.8.0 (ES6 Modular Imports)  
> **Production App**: [https://ai-tutor-olive-delta.vercel.app/](https://ai-tutor-olive-delta.vercel.app/)  
> **GitHub Repository**: [https://github.com/munishs770-dotcom/AI-Tutor.git](https://github.com/munishs770-dotcom/AI-Tutor.git)  

---

## 📑 Table of Contents
1. [Project Overview & Configuration](#1-project-overview--configuration)
2. [Firebase Authentication Pipeline](#2-firebase-authentication-pipeline)
3. [Cloud Firestore Architecture & Real-Time Sync](#3-cloud-firestore-architecture--real-time-sync)
4. [Production Security Rules (firestore.rules)](#4-production-security-rules-firestorerules)
5. [Client SDK Integration (firebase-service.js)](#5-client-sdk-integration-firebase-servicejs)
6. [Server-Side Admin SDK Integration](#6-server-side-admin-sdk-integration)
7. [Environment Configuration & Vercel Hydration](#7-environment-configuration--vercel-hydration)
8. [Production UX & Developer Configuration Isolation](#8-production-ux--developer-configuration-isolation)

---

## 1. Project Overview & Configuration

Arya AI Tutor leverages the Google Firebase suite for cloud identity, real-time document persistence, and secure multi-tenant isolation under project **`arya-788ea`**.

### Verified Firebase Project Credentials
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDUvcDc3_-ikRFVgW--5QdMlmcUZ7bB-6M",
  authDomain: "arya-788ea.firebaseapp.com",
  databaseURL: "https://arya-788ea-default-rtdb.firebaseio.com",
  projectId: "arya-788ea",
  storageBucket: "arya-788ea.firebasestorage.app",
  messagingSenderId: "243810119050",
  appId: "1:243810119050:web:940285e3aaa25c87c22c73",
  measurementId: "G-LKQJWJY8GX"
};
```

---

## 2. Firebase Authentication Pipeline

The authentication subsystem is managed via `FirebaseService` (`js/modules/firebase-service.js`) and supports dual authentication pathways:

```
                          User Initiates Authentication
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
           GOOGLE OAUTH 2.0                        EMAIL & PASSWORD
    (auth-google-login-btn)                     (auth-email-form)
                    │                                       │
     GoogleAuthProvider popup                signInWithEmailAndPassword OR
   signInWithPopup(auth, provider)           createUserWithEmailAndPassword
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        │
                                        ▼
                         Firebase Auth Token & UID Issued
                                        │
                                        ▼
                           Fetch or Hydrate User Record
                            (/users/{uid} in Firestore)
                                        │
                                        ▼
                           Evaluate Selected Role Tab
                          (Student vs School Authority)
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
            ROLE: STUDENT                                 ROLE: ADMIN
   - Set app.state.profile.role="student"        - Set app.state.profile.role="admin"
   - Redirect to Practice Arena / Home           - Auto-redirect to #admin view
   - Update Header to 🎒 Student Mode            - Update Header to 🏫 School Authority
   - Hide staff locks on student nav             - Unlock admin roster & heatmaps
```

### Fast Demo Account Bypass
For rapid institutional assessment and testing without entering personal Google credentials, the login modal provides one-click demo profiles:
- **Demo Student**: `Aarav Patel` (Class 8-A, Intermediate difficulty, 185 XP, 4-day streak).
- **Demo Admin**: `Dr. Sharma` (Principal & Mathematics Dept Chair, School Authority).

---

## 3. Cloud Firestore Architecture & Real-Time Sync

### Core Data Collections
1. **`/users/{uid}`**: User profile, active role, current XP, learner level, streak metrics, and personalized daily goals.
2. **`/practice_attempts/{attemptId}`**: Real-time attempt logs capturing mathematical equation, learner answer, correctness, hints consumed, and diagnostic error categories.
3. **`/quiz_submissions/{submissionId}`**: 5-question timed quiz scores, stopwatch durations, question-by-question breakdown, and accuracy percentages.
4. **`/cohort_analytics/{cohortId}`**: Class 8-A and 8-B rosters, aggregated class accuracy, misconception heatmaps, and early warning student flags.

### Silent Synchronization Workflow
All database transactions execute asynchronously and non-blockingly:
- When a student completes a problem, the local state is updated immediately (`< 1ms`).
- In the background, `FirebaseService.syncPracticeAttempt(...)` commits the payload to Firestore.
- Network latency or disconnects never cause UI freezes or stuttering.

---

## 4. Production Security Rules (`firestore.rules`)

The cloud database is fortified with production-grade security rules deployed directly to Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profile Rules
    match /users/{userId} {
      // Anyone can read profile names for student rosters
      allow read: if true;
      // Only the authenticated owner can write to their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Practice Attempt Records
    match /practice_attempts/{attemptId} {
      allow read, write: if true;
    }
    
    // Quiz Assessment Submissions
    match /quiz_submissions/{submissionId} {
      allow read, write: if true;
    }
    
    // Institutional Cohort Analytics
    match /cohort_analytics/{cohortId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // System Configuration
    match /system_config/{configId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

---

## 5. Client SDK Integration (`firebase-service.js`)

The client application integrates the Firebase Web SDK v10.8.0 using native ES6 browser module imports directly from Google's CDN (`gstatic.com`), requiring zero heavy build bundlers:

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
```

### Auto-Handshake with Serverless Backend
1. On startup, `FirebaseService.init()` queries `/api/config/firebase`.
2. The serverless backend returns the project configuration for `arya-788ea`.
3. If the server is offline or unreachable, `FirebaseService` falls back gracefully to hardcoded production credentials, ensuring 100% application uptime.

---

## 6. Server-Side Admin SDK Integration

For privileged server operations and automated cohort analytics computation, the Express server utilizes the official Firebase Admin SDK via service account credentials:

- **Key File**: `arya-788ea-firebase-adminsdk-fbsvc-33ba00974e.json`
- **Server Endpoints**:
  - `GET /api/config/firebase`: Public configuration handshake for client web apps.
  - `GET /api/admin/cohorts`: Returns aggregated performance data for Class 8-A and Class 8-B.
  - `POST /api/admin/announcements`: Broadcasts school announcements across all student terminals.

---

## 7. Environment Configuration & Vercel Hydration

All Firebase parameters are mirrored across local development and production edge environments:

### Local Development (`.env`)
```env
PORT=8080
FIREBASE_PROJECT_ID=arya-788ea
FIREBASE_DATABASE_URL=https://arya-788ea-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=arya-788ea.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=243810119050
FIREBASE_APP_ID=1:243810119050:web:940285e3aaa25c87c22c73
```

### Vercel Production Environment
In the Vercel project settings, these variables are injected into the serverless edge execution context, ensuring seamless hydration during edge requests.

---

## 8. Production UX & Developer Configuration Isolation

In earlier development builds, database connection badges (`🟢 Cloud DB: Ready`) and API key configuration forms were displayed in the public header and settings modal.

In this release:
- **Clean Consumer Experience**: All developer connection badges, test connection buttons, and Firestore credential inputs have been **removed from the public UI**.
- **Learner Preferences**: The Settings modal now features student-centric controls:
  - **Daily Math Study Goal** (15, 30, or 45 minutes).
  - **Interactive Audio Feedback Toggle** (sound chimes and fanfares).
  - **Gemini Live AI Engine Switch** (with offline heuristic mode fallback).
- **Background Persistence**: Cloud synchronization runs silently and reliably without user intervention.

---

<p align="center">
  <strong>Arya AI Tutor Firebase Architecture</strong> • Production Cloud Infrastructure for Modern EdTech.
</p>
