# ⚖️ Arya AI Tutor: Class 8 Mathematics Personalized Learning Assistant

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-tutor-olive-delta.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/munishs770-dotcom/AI-Tutor.git)
[![Firebase Cloud Firestore](https://img.shields.io/badge/Firebase-Cloud%20Firestore-FFA611?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![NCERT Curriculum](https://img.shields.io/badge/Curriculum-NCERT%20Class%208-10B981?style=for-the-badge)](https://ncert.nic.in/)

> **Capstone Project**: AI-Powered Personalized Learning Assistant  
> **Academic Cohort**: IIT Patna Advanced AI Engineering Capstone  
> **Target Subject**: Class 8 Mathematics — Linear Equations in One Variable, Algebra & Factorisation  
> **Target Audience**: Students aged 12–15 (NCERT / CBSE / ICSE) & School Faculty  
> **🌐 Live Production Web App**: [https://ai-tutor-olive-delta.vercel.app/](https://ai-tutor-olive-delta.vercel.app/)  
> **💻 GitHub Source Code**: [https://github.com/munishs770-dotcom/AI-Tutor.git](https://github.com/munishs770-dotcom/AI-Tutor.git)  
> **🏠 Local Development URL**: `http://localhost:8080/`

---

## 📑 Table of Contents
1. [Project Overview & Core Mission](#-1-project-overview--core-mission)
2. [What's New in This Release](#-2-whats-new-in-this-release)
3. [Live Deployments & Quick Links](#-3-live-deployments--quick-links)
4. [Target Audience & Pedagogical Innovations](#-4-target-audience--pedagogical-innovations)
5. [Tutor Persona & Socratic Engine](#-5-tutor-persona--socratic-engine)
6. [Core Learning & Administration Portals](#-6-core-learning--administration-portals)
7. [System & Technology Architecture](#-7-system--technology-architecture)
8. [Firebase Cloud Database & Security Architecture](#-8-firebase-cloud-database--security-architecture)
9. [Role-Based Access Control (RBAC)](#-9-role-based-access-control-rbac)
10. [Local Development & Deployment Guide](#-10-local-development--deployment-guide)
11. [Project Documentation Directory](#-11-project-documentation-directory)

---

## 🌟 1. Project Overview & Core Mission

**Arya AI Tutor** is a state-of-the-art, production-grade educational platform engineered specifically for **Class 8 Mathematics**. It bridges the critical cognitive gap when students transition from concrete arithmetic calculations to abstract symbolic algebra.

Unlike generic conversational chatbots (such as raw ChatGPT or Claude) that trivially regurgitate answers and foster dependency, Arya implements a strictly constrained **Socratic pedagogical model**:
- **Explains via Concrete Visual Metaphors**: Interactive SVG Balance Scale simulations where equations are balanced pans and variables are mystery weights.
- **Scaffolds with Progressive Hints**: 3-tier hint ladders (Conceptual Nudge ➔ Strategy Guide ➔ Step-by-Step Derivation).
- **Diagnoses Adolescent Misconceptions**: Automatic detection of sign-flipping errors during transposition ($x = 10 + 4$ instead of $10 - 4$), arithmetic slips, and distribution oversights.
- **Procedural Infinite Problem Generator**: Generates clean integer-solution algebra problems dynamically.
- **Dual Brain Architecture**: Google Gemini AI (`gemini-1.5-flash` / `gemini-2.0-flash`) combined with a 100% offline heuristic fallback.
- **Institutional Governance**: Real-time school administrator & faculty dashboards tracking cohort performance, misconception heatmaps, and early academic interventions.

---

## 🚀 2. What's New in This Release

### 1. 🏠 Dedicated Homepage & Landing Hub (`#view-home`)
- **Brand Presentation**: Modern glassmorphic hero banner with mathematical visualizers and syllabus highlights.
- **Dual Entry Paths**: Distinct entry points for **Student Learning Arena** and **School Authority & Faculty Portal**.
- **Interactive Overview**: Real-time curriculum taxonomy cards and feature showcases for students, parents, and educators.

### 2. 🛡️ Strict Role-Based Access Control (RBAC) & Route Guards
- **Dedicated Student vs Admin Experience**: The sidebar dynamically reflects the active role. Students cannot see or access privileged administrative tools.
- **Route Guards**: Unauthorized attempts to access `/admin` or `/teacher` automatically trigger a secure login modal with informative warning toasts.
- **Staff Lock Indicators**: Visual `🔒 Staff` indicators clarify privileged faculty zones.
- **Visual Role Tab Selector**: Login modal supports immediate switching between Student and School Authority authentication.

### 3. 🔥 Production Firebase Cloud Infrastructure (`arya-788ea`)
- **Real-Time Cloud Persistence**: Profiles, practice problem history, quiz attempts, and daily streaks automatically sync to Google Firebase Firestore.
- **Firebase Authentication**: Integrated Google Account OAuth sign-in and Email/Password authentication.
- **Firestore Security Rules**: Production-grade rules (`firestore.rules`) enforcing document isolation and role authorization.
- **Production Clean UI**: Developer connection badges and test buttons are stripped from public views; database operations execute invisibly and reliably in the background.

---

## 🔗 3. Live Deployments & Quick Links

- **Production URL (Vercel CDN)**: [https://ai-tutor-olive-delta.vercel.app/](https://ai-tutor-olive-delta.vercel.app/)
- **Source Code Repository (GitHub)**: [https://github.com/munishs770-dotcom/AI-Tutor.git](https://github.com/munishs770-dotcom/AI-Tutor.git)
- **Local Application URL**: `http://localhost:8080/`
- **Comprehensive Project Report (HTML)**: `http://localhost:8080/project-report.html`
- **Final Project Report (PDF)**: [`AI_Tutor_Report_FINAL.pdf`](./AI_Tutor_Report_FINAL.pdf)
- **API Health Endpoint**: `https://ai-tutor-olive-delta.vercel.app/api/health`

---

## 🎯 4. Target Audience & Pedagogical Innovations

| Dimension | Specification & Innovation |
| :--- | :--- |
| **Target Learners** | Students aged **12–15 years** in Class 8 (NCERT, CBSE, ICSE, Common Core). |
| **Target Educators** | Mathematics teachers, school principals, and academic coordinators. |
| **Common Student Hurdles** | 1. **Formula Memorization vs. Intuition**: Reciting $(a+b)^2$ without geometric or mental arithmetic comprehension.<br>2. **Transposition Sign Trap**: Forgetting to flip positive/negative signs when transposing across the `=` border.<br>3. **Word Problem Intimidation**: Struggles converting real-world scenarios into balanced algebraic relations. |
| **Arya's Pedagogical Solutions** | 1. **Balance Scale Visualization**: Proves that adding or subtracting weights from both pans preserves balance.<br>2. **Socratic Hint Ladder**: Leads with conceptual questions rather than spoiling answers.<br>3. **Cognitive Error Diagnostician**: Differentiates careless arithmetic slips from structural algebraic misconceptions. |

---

## 🧠 5. Tutor Persona & Socratic Engine

Arya's core personality is anchored in growth-mindset cognitive psychology:

```markdown
You are "Arya", an empathetic, expert AI Mathematics Tutor specializing in Class 8 Mathematics (ages 12-15), 
focusing on Linear Equations in One Variable, Algebraic Expressions, and Factorisation.

TEACHING PHILOSOPHY & BEHAVIORAL PROTOCOL:
1. Socratic Questioning: Never spoon-feed final numeric solutions. Provide gentle conceptual nudges,
   followed by strategic guidance, and only derive steps if the learner remains stuck after multiple attempts.
2. Concrete Analogies: Use physical metaphors (e.g. grocery balance scale, mystery gift boxes for variables,
   border checkpoints for the equals sign).
3. Validate & Diagnose: Celebrate effort. When an error occurs, identify the exact cognitive gap
   (e.g., "Look closely at what happened to the +5 when it moved to the other pan!").
4. Mathematical Precision: Format all expressions cleanly with LaTeX syntax ($ax + b = c$).
5. Interactive Check: Always conclude guidance with a quick check-for-understanding question.
```

---

## 🚀 6. Core Learning & Administration Portals

### 🎒 Student Learning Arena
1. **🏠 Home Hub (`#view-home`)**: Comprehensive curriculum launchpad, streak dashboard, and feature guide.
2. **🎓 Learn Concepts (`#view-learn`)**: NCERT Class 8 curriculum with interactive SVG balance scale simulations, worked examples, and interactive checkpoints.
3. **✍️ Practice Arena (`#view-practice`)**: Procedural algebra generator producing unlimited clean integer-solution problems across 3 difficulty tiers, paired with a 3-tier Hint Ladder and built-in Canvas Scratchpad.
4. **🏆 Quiz Arena (`#view-quiz`)**: 5-question timed challenge with realistic distractors, live timer, XP rewards, celebratory confetti, and detailed review.
5. **❓ Ask Arya (`#view-chat`)**: Hybrid AI chat interface with speech recognition input, text-to-speech audio playback, and quick doubt chips.
6. **📊 Progress & Insights (`#view-analytics`)**: Dynamic HTML5 Canvas topic mastery charts, classification of strong vs. weak concepts, and next-lesson recommendations.
7. **🗺️ 7-Day Study Plan (`#view-study-plan`)**: Adaptive study roadmaps tailored to the student's mastery gaps.
8. **📄 Notes & PDF AI (`#view-notes`)**: Automated algebraic formula extraction and custom practice problem generation from uploaded notes.

### 🏫 School Administration & Faculty Portal
1. **🏫 School Admin Portal (`#view-admin`)**:
   - Institutional overview (Total students, average accuracy, active learners, questions solved).
   - Class 8-A and Class 8-B comprehensive student roster tracking.
   - Real-time **Concept Misconception Heatmap** flagging high-risk topics.
   - **Early Warning System** detecting struggling students before exams.
   - School-wide broadcast bulletin system.
   - One-click CSV roster export.
2. **👨‍🏫 Teacher Dashboard (`#view-teacher`)**:
   - Teacher diagnostic remarks and individualized feedback.
   - Performance trends across linear equations, expressions, and factorisation.
   - Printable parent-teacher meeting evaluation summary.

---

## 🛠️ 7. System & Technology Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT SINGLE PAGE APP                          │
│         (HTML5 • CSS3 Glassmorphism • KaTeX • Web Audio API)           │
├──────────────────────────────────┬─────────────────────────────────────┤
│      STUDENT LEARNING ARENA      │      SCHOOL AUTHORITY PORTAL        │
│   • Learn Concepts & Scale SVG   │   • Student Roster & Analytics      │
│   • Procedural Practice Arena    │   • Misconception Heatmaps          │
│   • Gamified Quiz Challenge      │   • Early Warning System            │
│   • Socratic AI Chat (Ask Arya)  │   • School Announcements            │
├──────────────────────────────────┴─────────────────────────────────────┤
│                    RBAC ROUTE GUARDS & CONTROLLERS                     │
│         (App Controller • StateManager • SuggestionsEngine)            │
├──────────────────────────────────┬─────────────────────────────────────┤
│        HYBRID AI ENGINE          │       PERSISTENCE & SYNC            │
│   • Google Gemini Flash (Cloud)  │   • Firebase Cloud Firestore        │
│   • Socratic Heuristics (Local)  │   • LocalStorage Offline Cache      │
└─────────────────┬────────────────┴──────────────────┬──────────────────┘
                  │                                   │
                  ▼                                   ▼
┌──────────────────────────────────┐ ┌───────────────────────────────────┐
│     VERCEL SERVERLESS EDGE       │ │        FIREBASE PLATFORM          │
│       (/api/index.js)            │ │          (arya-788ea)             │
│   • Secure Gemini AI Proxy       │ │   • Cloud Firestore Database      │
│   • School Roster REST APIs      │ │   • Google & Email Authentication │
│   • Health & Config Endpoints    │ │   • Firestore Security Rules      │
└──────────────────────────────────┘ └───────────────────────────────────┘
```

For complete architectural specifications, see:
- 📘 [`SYSTEM_ARCHITECTURE.md`](./SYSTEM_ARCHITECTURE.md)
- 🗄️ [`DATABASE_ARCHITECTURE.md`](./DATABASE_ARCHITECTURE.md)
- 🔥 [`FIREBASE_ARCHITECTURE.md`](./FIREBASE_ARCHITECTURE.md)

---

## 🔥 8. Firebase Cloud Database & Security Architecture

The application connects to project **`arya-788ea`**:
- **Authentication**: Google OAuth Sign-in (`GoogleAuthProvider`) + Email/Password authentication (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).
- **Cloud Firestore**: Real-time cloud synchronization of student profiles, practice attempts, quiz submissions, and school cohorts.
- **Security Rules (`firestore.rules`)**:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
      match /practice_attempts/{attemptId} {
        allow read, write: if true;
      }
      match /quiz_submissions/{submissionId} {
        allow read, write: if true;
      }
      match /cohort_analytics/{cohortId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
  ```

---

## 🔒 9. Role-Based Access Control (RBAC)

The application implements client and backend role enforcement:

| Role | Identifiers | Accessible Views | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | Default / `student` | `#view-home`, `#view-learn`, `#view-practice`, `#view-quiz`, `#view-chat`, `#view-analytics`, `#view-study-plan`, `#view-notes` | Practice math, solve quizzes, earn XP/badges, chat with Arya. Restricted from admin views. |
| **Teacher** | `teacher` | All Student views + `#view-teacher` | View cohort performance, generate parent remarks, print reports. |
| **School Admin** | `admin` | All views + `#view-admin` & `#view-teacher` | Full institutional roster management, early warning interventions, announcements, CSV export. |

---

## 💻 10. Local Development & Deployment Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Local Setup
```bash
# Clone the repository
git clone https://github.com/munishs770-dotcom/AI-Tutor.git
cd AI-Tutor

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run local development server
npm run dev
# Server will start at http://localhost:8080
```

### 2. Environment Variables (`.env`)
```env
PORT=8080
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_PROJECT_ID=arya-788ea
FIREBASE_DATABASE_URL=https://arya-788ea-default-rtdb.firebaseio.com
```

### 3. Vercel Edge Deployment
The project is configured for one-click Vercel deployment:
- Edge API routes are configured via `api/index.js` and `vercel.json`.
- Dual-folder synchronization ensures both `index.html` and `public/index.html` remain identical.
- Every push to `main` automatically triggers a zero-downtime Vercel edge deployment.

---

## 📚 11. Project Documentation Directory

| Document | Description |
| :--- | :--- |
| **[`README.md`](./README.md)** | This document — Primary project manual and overview. |
| **[`SYSTEM_ARCHITECTURE.md`](./SYSTEM_ARCHITECTURE.md)** | In-depth system design, component hierarchy, and Socratic state machines. |
| **[`DATABASE_ARCHITECTURE.md`](./DATABASE_ARCHITECTURE.md)** | Firestore schema definitions, offline cache protocol, and indexes. |
| **[`FIREBASE_ARCHITECTURE.md`](./FIREBASE_ARCHITECTURE.md)** | Firebase project configuration, auth pipelines, and security rules. |
| **[`DEPLOYMENT.md`](./DEPLOYMENT.md)** | Vercel and Firebase CLI deployment runbook. |
| **[`AI_Tutor_Report_FINAL.pdf`](./AI_Tutor_Report_FINAL.pdf)** | Formal 20-page comprehensive capstone project report. |
| **[`project-report.html`](./project-report.html)** | Source HTML for the 20-page formal printable report. |

---

<p align="center">
  <strong>Arya AI Tutor</strong> — Engineered with ❤️ for the IIT Patna Advanced AI Engineering Capstone.<br>
  <em>Empowering adolescent mathematical intuition through Socratic AI guidance.</em>
</p>
