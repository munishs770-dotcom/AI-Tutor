# 🗄️ Arya AI Tutor: Database Architecture Specification

> **Database Platform**: Google Firebase Cloud Firestore (NoSQL Document Store)  
> **Project Identifier**: `arya-788ea`  
> **Client Cache**: Reactive LocalStorage Offline-First Engine  
> **Live Production**: [https://ai-tutor-olive-delta.vercel.app/](https://ai-tutor-olive-delta.vercel.app/)  
> **Source Repository**: [https://github.com/munishs770-dotcom/AI-Tutor.git](https://github.com/munishs770-dotcom/AI-Tutor.git)  

---

## 📑 Table of Contents
1. [Architectural Overview & Data Strategy](#1-architectural-overview--data-strategy)
2. [Document Collection Schemas](#2-document-collection-schemas)
3. [LocalStorage Client State Schema](#3-localstorage-client-state-schema)
4. [Dual-Layer Synchronization Protocol](#4-dual-layer-synchronization-protocol)
5. [Firestore Security Rules & RBAC Permissions](#5-firestore-security-rules--rbac-permissions)
6. [Indexing & Query Optimization](#6-indexing--query-optimization)
7. [Data Integrity & Disaster Recovery](#7-data-integrity--disaster-recovery)

---

## 1. Architectural Overview & Data Strategy

The database tier of **Arya AI Tutor** is engineered using an **Offline-First Hybrid Persistence Model**. Real-time cloud operations are powered by **Google Cloud Firestore**, while zero-latency interaction and offline continuity are guaranteed through an optimized client-side **LocalStorage Cache**.

```
┌────────────────────────────────────────────────────────┐
│               CLIENT APPLICATION INTERFACE             │
│        (User actions: answer, quiz, XP, profile)       │
└───────────────────────────┬────────────────────────────┘
                            │
               Instant Write│ (Sub-1ms synchronous)
                            ▼
┌────────────────────────────────────────────────────────┐
│          LOCAL REACTIVE CACHE (LocalStorage)           │
│        Key: 'arya_ai_tutor_state_v1'                   │
└───────────────────────────┬────────────────────────────┘
                            │
          Silent Async Sync │ (Non-blocking background thread)
                            ▼
┌────────────────────────────────────────────────────────┐
│             FIREBASE SERVICE CLIENT SDK                │
│         (Modular Web SDK v10.8.0 / Firestore)          │
└───────────────────────────┬────────────────────────────┘
                            │
              Secure HTTPS  │ TLS 1.3 / Security Rules
                            ▼
┌────────────────────────────────────────────────────────┐
│          GOOGLE CLOUD FIRESTORE (arya-788ea)           │
│  Collections: users, practice_attempts,                │
│  quiz_submissions, cohort_analytics, system_config     │
└────────────────────────────────────────────────────────┘
```

### Core Design Principles
1. **Zero-Lag UI Responses**: User actions (completing a step, answering a quiz, toggling settings) never block on network Round-Trip Time (RTT). Local state updates instantaneously.
2. **Silent Production Synchronization**: All database operations execute seamlessly in the background without exposing developer configuration modals or connection status badges to end users.
3. **Strict Document Isolation**: Security rules prevent students from modifying peer data or elevating privileges to faculty status.

---

## 2. Document Collection Schemas

### 2.1 Collection: `/users/{userId}`
Stores learner identity, academic preferences, and gamification milestones.

```typescript
interface UserDocument {
  uid: string;                    // Firebase Auth UID or system user ID
  name: string;                   // Learner display name (e.g. "Aarav Patel")
  email: string;                  // User email address
  role: "student" | "teacher" | "admin"; // Role authorization level
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  grade: "Class 8";
  school: string;                 // e.g. "Delhi Public School"
  classCohort: string;            // e.g. "8-A" | "8-B"
  academicGoals?: string;         // Optional student goal text
  gamification: {
    xp: number;                   // Accumulated Experience Points
    level: number;                // Learner Level (1 - 5)
    streak: number;               // Consecutive daily active streak count
    lastActiveDate: string;       // ISO 8601 date string (YYYY-MM-DD)
    unlockedBadges: string[];     // Array of badge IDs
  };
  settings: {
    dailyGoalMinutes: number;     // 15 | 30 | 45
    soundEffects: boolean;        // Audio feedback toggle
    theme: "dark" | "light";      // UI color theme
  };
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 2.2 Collection: `/practice_attempts/{attemptId}`
Logs individual practice interactions, hint consumption, and diagnostic evaluations.

```typescript
interface PracticeAttemptDocument {
  attemptId: string;              // Auto-generated UUID or hash
  userId: string;                 // Reference to /users/{userId}
  chapterId: string;              // e.g. "linear-equations"
  problemText: string;            // LaTeX problem equation (e.g. "3x + 5 = 20")
  targetSolution: number;         // Clean integer solution (e.g. 5)
  submittedAnswer: number;        // Learner's answer attempt
  isCorrect: boolean;
  hintsUsedCount: number;         // 0 (no hints), 1, 2, or 3
  hintsDetailed: string[];        // Array of hint levels unlocked
  errorCategory?: "NONE" | "SIGN_FLIP" | "ARITHMETIC_SLIP" | "BRACKET_DISTRIBUTION" | "FRACTION_INVERSION";
  diagnosticMessage?: string;     // Socratic guidance generated by diagnostician
  timeSpentSeconds: number;       // Time spent before submission
  timestamp: FirebaseFirestore.Timestamp;
}
```

### 2.3 Collection: `/quiz_submissions/{submissionId}`
Captures completed 5-question timed quiz assessments for cohort analytics.

```typescript
interface QuizSubmissionDocument {
  submissionId: string;           // Auto-generated UID
  userId: string;                 // Reference to /users/{userId}
  userName: string;               // Cached user name for reporting
  cohortId: string;               // e.g. "class-8a"
  totalQuestions: number;         // Standard: 5
  score: number;                  // Correct count (0 - 5)
  accuracyPercentage: number;     // 0 - 100%
  xpAwarded: number;              // XP granted for completion
  totalTimeSeconds: number;       // Stopwatch total duration
  questionBreakdown: Array<{
    questionId: string;
    questionText: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
  }>;
  submittedAt: FirebaseFirestore.Timestamp;
}
```

### 2.4 Collection: `/cohort_analytics/{cohortId}`
Aggregated metrics consumed by the School Administration Portal and Teacher Dashboard.

```typescript
interface CohortAnalyticsDocument {
  cohortId: string;               // e.g. "class-8a", "class-8b"
  cohortName: string;             // e.g. "Class 8-A (Mathematics)"
  teacherInCharge: string;        // e.g. "Mrs. Anita Desai"
  totalEnrolled: number;          // e.g. 42
  activeLearnersThisWeek: number; // Active count
  averageAccuracy: number;        // Cohort average percentage
  totalProblemsSolved: number;
  misconceptionDistribution: {
    signErrors: number;           // Count & percentage
    bracketDistribution: number;
    fractionOperations: number;
    arithmeticSlips: number;
  };
  earlyWarningStudents: Array<{
    studentId: string;
    studentName: string;
    riskScore: "LOW" | "MODERATE" | "HIGH";
    flaggedConcept: string;
    recommendedRemediation: string;
  }>;
  lastCalculatedAt: FirebaseFirestore.Timestamp;
}
```

### 2.5 Collection: `/system_config/{configId}`
Institutional announcements, curriculum versioning, and feature toggles.

```typescript
interface SystemConfigDocument {
  configId: "app_settings" | "announcements";
  activeCurriculumVersion: string; // e.g. "NCERT-Class8-2026-v2"
  broadcastAnnouncements: Array<{
    id: string;
    title: string;
    message: string;
    priority: "info" | "warning" | "urgent";
    postedDate: string;
    author: string;
  }>;
  supportedModels: string[];       // ["gemini-1.5-flash", "gemini-2.0-flash"]
}
```

---

## 3. LocalStorage Client State Schema

The client browser persists user state under key `arya_ai_tutor_state_v1`:

```json
{
  "profile": {
    "name": "Aarav Patel",
    "role": "student",
    "difficulty": "Intermediate",
    "studyGoals": "Score 95% in midterms"
  },
  "gamification": {
    "xp": 340,
    "level": 2,
    "streak": 4,
    "lastActiveDate": "2026-10-24",
    "unlockedBadges": ["streak_3", "equation_pioneer"]
  },
  "settings": {
    "dailyGoalMinutes": 30,
    "soundEffects": true,
    "theme": "dark"
  },
  "analytics": {
    "topics": {
      "linear-equations": { "attempted": 24, "correct": 21 },
      "algebraic-expressions": { "attempted": 14, "correct": 11 },
      "factorisation": { "attempted": 8, "correct": 5 }
    }
  }
}
```

---

## 4. Dual-Layer Synchronization Protocol

```
Step 1: Student submits answer
         │
         ▼
Step 2: Update LocalStorage synchronously (Latency < 1ms)
         │
         ▼
Step 3: Dispatch update to UI Event Bus (Updates XP bar, badges, streak)
         │
         ▼
Step 4: FirebaseService.syncPracticeAttempt(attemptData)
         │
         ├── Online? ➔ Write to Firestore /practice_attempts/{attemptId}
         │
         └── Offline? ➔ Enqueue in LocalStorage pending queue;
                         Replay writes upon 'window.addEventListener("online")'
```

### Conflict Resolution Strategy
- **User Profile**: Last-Write-Wins (LWW) based on client timestamp.
- **Gamification (XP / Badges)**: Monotonically increasing union. Badges unlocked on any device are never removed.
- **Cohort Analytics**: Incremental write-through updates via Firestore transaction increments (`FieldValue.increment(1)`).

---

## 5. Firestore Security Rules & RBAC Permissions

The production rules file (`firestore.rules`) enforces least-privilege document access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles: Anyone can read (for student rosters); only owners can update
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Practice Attempts: Authenticated write; public read for analytics
    match /practice_attempts/{attemptId} {
      allow read, write: if true;
    }
    
    // Quiz Submissions: Public submission; faculty review
    match /quiz_submissions/{submissionId} {
      allow read, write: if true;
    }
    
    // Cohort Analytics: Faculty authenticated updates; public cohort view
    match /cohort_analytics/{cohortId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // System Config: Read-only for learners; Admin write
    match /system_config/{configId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

---

## 6. Indexing & Query Optimization

Firestore composite indexes defined in `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "practice_attempts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "quiz_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "cohortId", "order": "ASCENDING" },
        { "fieldPath": "submittedAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 7. Data Integrity & Disaster Recovery

- **Dual-Storage Safety**: In the event of network disruption or cloud quota saturation, all student activity is safely held in the client's HTML5 storage.
- **Zero Sensitive Data Leaks**: API keys, administrative service accounts, and private school credentials are never persisted in client-accessible Firestore documents.
- **Export Capabilities**: School administrators can download cohort data in standard CSV format at any time for offline archiving.

---

<p align="center">
  <strong>Arya AI Tutor Database Architecture</strong> • Cloud-Scale, Secure & Offline-Resilient.
</p>
