# 🏗️ Arya AI Tutor: System Architecture Blueprint

> **System**: Arya AI Tutor — Class 8 Mathematics Personalized Learning Assistant  
> **Target Audience**: Students aged 12–15 (NCERT / CBSE / ICSE) & School Faculty  
> **Live Production**: [https://ai-tutor-olive-delta.vercel.app/](https://ai-tutor-olive-delta.vercel.app/)  
> **Source Repository**: [https://github.com/munishs770-dotcom/AI-Tutor.git](https://github.com/munishs770-dotcom/AI-Tutor.git)  
> **Specification**: IIT Patna Advanced AI Engineering Capstone  

---

## 📑 Table of Contents
1. [Architectural Overview & Design Principles](#1-architectural-overview--design-principles)
2. [High-Level System Topology](#2-high-level-system-topology)
3. [Frontend Component & Module Hierarchy](#3-frontend-component--module-hierarchy)
4. [Routing & Role-Based Access Control (RBAC) Engine](#4-routing--role-based-access-control-rbac-engine)
5. [Dual-Brain AI Architecture](#5-dual-brain-ai-architecture)
6. [Socratic Pedagogical State Machine & Hint Ladder](#6-socratic-pedagogical-state-machine--hint-ladder)
7. [Mathematical Simulation Engines](#7-mathematical-simulation-engines)
8. [Gamification & Behavioral Feedback Subsystems](#8-gamification--behavioral-feedback-subsystems)
9. [Institutional Analytics & Early Warning System](#9-institutional-analytics--early-warning-system)
10. [Resilience, Latency Profiles & Failure Modes](#10-resilience-latency-profiles--failure-modes)

---

## 1. Architectural Overview & Design Principles

The Arya AI Tutor architecture is engineered around four guiding tenets:

1. **Pedagogical Integrity (The Anti-Spoon-Feeding Law)**: The system strictly prohibits revealing final answers outright. Every interaction is routed through a Socratic scaffolding ladder that trains adolescent learners in foundational algebraic intuition.
2. **Deterministic Mathematical Reliability**: While LLMs are exceptional at conversational scaffolding, they frequently hallucinate arithmetic calculations. Arya decouples mathematical generation and validation from the LLM, using deterministic procedural engines to guarantee clean integer solutions.
3. **Dual-Brain Hybrid Execution**: Cloud-first with local-offline fallback. The application functions completely even in zero-bandwidth or offline conditions using local heuristic rule engines.
4. **Zero-Overhead Vanilla Foundations**: The frontend utilizes native ES6 modules, CSS Custom Properties, and HTML5 Canvas/SVG, bypassing heavy monolithic client frameworks (React/Angular) to achieve sub-40ms UI response times on low-power school Chromebooks and mobile devices.

---

## 2. High-Level System Topology

```
                                  ┌──────────────────────────────┐
                                  │      CLIENT USER AGENT       │
                                  │   (Edge Browser / Device)    │
                                  └──────────────┬───────────────┘
                                                 │
                                                 │ HTTPS / TLS 1.3
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL EDGE CDN & GATEWAY                                 │
│  - Static Asset Delivery (HTML5, Vanilla CSS3 Glassmorphism, ES6 Modules, SVGs)        │
│  - Edge URL Rewrites (/api/* ➔ Serverless Node Function)                              │
└───────────────────────┬────────────────────────────────────────┬───────────────────────┘
                        │                                        │
           Static Files │                               API REST │ Requests
                        ▼                                        ▼
┌─────────────────────────────────┐            ┌─────────────────────────────────────────┐
│     CLIENT RUNTIME APPLICATION  │            │        VERCEL SERVERLESS RUNTIME        │
│  ┌───────────────────────────┐  │            │             (/api/index.js)             │
│  │   App Orchestrator        │  │            ├─────────────────────────────────────────┤
│  │   (js/app.js)             │  │            │  • Express Router & CORS Gateways       │
│  ├───────────────────────────┤  │            │  • Secure Gemini Proxy (/api/ai/chat)   │
│  │   RBAC Route Guards       │  │            │  • School Roster API (/api/admin/*)     │
│  ├───────────────────────────┤  │            │  • Health & Telemetry (/api/health)     │
│  │   Mathematical Widgets    │  │            └────────────┬───────────────────┬────────┘
│  │   - Balance Scale SVG     │  │                         │                   │
│  │   - Canvas Scratchpad     │  │          Encrypted JSON │                   │ HTTPS
│  │   - KaTeX Math Typesetter │  │                         ▼                   ▼
│  └─────────────┬─────────────┘  │            ┌─────────────────┐ ┌─────────────────────┐
└────────────────┼────────────────┘            │  GOOGLE GEMINI  │ │ FIREBASE ADMIN SDK  │
                 │                             │  FLASH AI API   │ │ (arya-788ea)        │
                 │ Direct Web SDK Sync         └─────────────────┘ └──────────┬──────────┘
                 ▼                                                            │
┌───────────────────────────────────────────────────┐                         │
│             FIREBASE CLOUD PLATFORM               │                         │
│                  (arya-788ea)                     │                         │
├───────────────────────────────────────────────────┤                         │
│  • Firebase Authentication (Google OAuth & Email) │                         │
│  • Cloud Firestore Real-time Document Store       │◄────────────────────────┘
│    - /users/{uid}                                 │    Institutional Batch Sync
│    - /practice_attempts/{attemptId}               │
│    - /quiz_submissions/{submissionId}             │
│    - /cohort_analytics/{schoolId}                 │
│  • Production Firestore Security Rules            │
└───────────────────────────────────────────────────┘
```

---

## 3. Frontend Component & Module Hierarchy

The client application follows a modular, dependency-injected design:

```
d:/AI Tutor Project/
├── index.html                     # Unified SPA Shell (All 10 Viewports & 4 Modals)
├── css/styles.css                 # Cosmic Glassmorphic Design System & Tokens
├── js/
│   ├── app.js                     # Root Controller: App Class, Event Bus, View Routing
│   ├── data/
│   │   └── curriculum.js          # NCERT Class 8 Curriculum Database & Misconceptions
│   └── modules/
│       ├── ai-engine.js           # Dual-Brain Orchestrator (Gemini Cloud + Local Heuristic)
│       ├── firebase-service.js    # Firebase Auth, Firestore Sync & Silent Cloud Persistence
│       ├── admin-portal.js        # School Authority Governance, Roster Table & Heatmap
│       ├── suggestions-engine.js  # Adaptive Learning Recommendations & Socratic Nudges
│       ├── problem-generator.js   # Procedural Class 8 Algebra Problem Generator
│       ├── balance-scale.js       # Interactive SVG Physical Scale Simulation
│       ├── whiteboard.js          # Canvas-based Digital Scratchpad with Color Palette
│       ├── analytics.js           # Canvas Mastery Charts & 7-Day Study Roadmap Engine
│       ├── gamification.js        # XP Economy, Badges, Web Audio Synthesizer, Confetti
│       ├── pdf-reader.js          # Notes Formula Extractor & Custom Question Builder
│       └── state.js               # Reactive LocalStorage Cache & Session Synchronizer
```

---

## 4. Routing & Role-Based Access Control (RBAC) Engine

The application implements client-side single-page routing with strict role guards enforced inside `App.prototype.switchView(viewName)`:

### Role Specifications

| Role Level | Target Users | Accessible Views | Navigation Visuals |
| :--- | :--- | :--- | :--- |
| **Guest / Anonymous** | Prospective students & parents | `#view-home`, `#view-learn`, `#view-practice`, `#view-quiz` | Default sidebar, `🎒 Student Mode` header pill. Admin views show `🔒 Staff` lock badges. |
| **Authenticated Student** | Enrolled Class 8 pupils | `#view-home`, `#view-learn`, `#view-practice`, `#view-quiz`, `#view-chat`, `#view-analytics`, `#view-study-plan`, `#view-notes` | Personalized XP, Streaks, `🎒 Student Mode` pill, automatic cloud sync. |
| **Teacher** | Mathematics faculty | All Student views + `#view-teacher` | Header pill: `👨‍🏫 Faculty Member`. Access to student diagnostic summaries. |
| **School Admin** | Principals & Dept Heads | All views + `#view-admin` & `#view-teacher` | Header pill: `🏫 School Authority`. Full cohort rosters, misconception heatmaps, broadcast alerts, CSV export. |

### Route Guard Enforcement Workflow

```
User Clicks Navigation Item (e.g. #nav-btn-admin)
                     │
                     ▼
       switchView(targetViewName)
                     │
         Is target restricted?
      (viewName == 'admin' | 'teacher')
                    / \
             YES   /   \  NO
                  /     \
                 ▼       ▼
       Check currentUser.role
                 │
       Is role 'admin' or 'teacher'?
               /   \
        YES   /     \  NO
             /       \
            ▼         ▼
  Activate View    1. Block Navigation
  Fetch Metrics    2. Play Warning Sound
                   3. Show Toast: "🔒 Restricted: Faculty Credentials Required"
                   4. Trigger openLoginModal('admin')
```

---

## 5. Dual-Brain AI Architecture

Arya employs a **Hybrid Dual-Brain** architecture to eliminate latency bottlenecks, API quota exhaustion, and offline disconnects:

```
                      User Enters Math Question / Doubt
                                      │
                                      ▼
                        AIEngine.generateResponse(prompt)
                                      │
                         Is Gemini Live API Enabled
                          AND API Key Present?
                                     / \
                              YES   /   \  NO / Offline
                                   /     \
                                  ▼       ▼
                     Cloud Brain             Offline Socratic Brain
              (Google Gemini 1.5/2.0 Flash)   (Local Heuristic Engine)
                          │                          │
                 System Socratic Prompt      Regex Misconception Matcher
                 Enforcement                 Class 8 Algebraic Rules
                          │                          │
                   Sub-600ms Stream           Sub-5ms Deterministic Response
                          │                          │
                          └───────────┬──────────────┘
                                      │
                                      ▼
                        KaTeX Mathematical Typesetter
                                      │
                                      ▼
                           Rendered Math Chat Bubble
```

### System Socratic Prompt Configuration
When calling the Gemini API, the prompt enforces strict pedagogical boundaries:
- **Zero Direct Answers**: Replaces numerical outputs with guiding questions.
- **Cognitive Diagnostics**: Identifies signs flips, bracket distribution oversights, and arithmetic slips.
- **Adolescent Language**: Uses grocery balance and mystery box metaphors tailored to 12–15 year olds.

---

## 6. Socratic Pedagogical State Machine & Hint Ladder

When students solve problems in the **Practice Arena**, they interact with a deterministic 3-tier scaffolding ladder:

```
  ┌───────────────────────────────────────────────────────────┐
  │                 TIER 0: RAW PROBLEM STATE                 │
  │ Example: Solve for x:  3x + 7 = 22                        │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Click "Need a Hint?"
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │              TIER 1: CONCEPTUAL NUDGE (XP: 100%)          │
  │ "Remember our Balance Scale! What constant term is        │
  │ sitting beside 3x that we can remove from both sides?"     │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Click "Next Hint"
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │              TIER 2: TARGETED OPERATION (XP: 80%)         │
  │ "Subtract 7 from both LHS and RHS: 3x = 22 - 7.           │
  │ Now what does 3x equal?"                                  │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Click "Reveal Full Steps"
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │             TIER 3: STEP-BY-STEP DERIVATION (XP: 50%)     │
  │ "Step 1: 3x = 15. Step 2: Divide both sides by 3: x = 5.  │
  │ Verification: 3(5) + 7 = 15 + 7 = 22 (Balanced!)."        │
  └───────────────────────────────────────────────────────────┘
```

---

## 7. Mathematical Simulation Engines

### 7.1 Interactive SVG Balance Scale
- **Physics Simulation**: Custom SVG DOM nodes simulate physical balance beams.
- **Mathematical Equivalence**: The left pan represents $ax + b$; the right pan represents $c$.
- **Real-Time Tilt Dynamics**: Adjusting unit weights or $x$-blocks recalculates the torque differential:
  $$\Delta = \text{Weight}_{\text{LHS}} - \text{Weight}_{\text{RHS}}$$
  The balance beam rotates dynamically via CSS transforms (`rotate(deg)`) proportional to $\Delta$, restoring level equilibrium ($0^\circ$) only when LHS equals RHS.

### 7.2 Procedural Problem Generator
- Dynamically generates algebraically valid problems with **guaranteed clean integers**:
  1. Picks integer target solution $x^* \in [-15, 15] \setminus \{0\}$.
  2. Selects integer coefficients $a, c \in [-9, 9] \setminus \{0\}$.
  3. Derives constants $b, d$ deterministically such that $ax^* + b = cx^* + d$.
  4. Formulates distractor answers using adolescent sign-flip errors ($x = -x^*$, $x = x^* + a$).

---

## 8. Gamification & Behavioral Feedback Subsystems

Arya utilizes behavioral reinforcement psychology to maintain learner engagement:

1. **Experience Point (XP) Economy**:
   - Practice problem solved: `+15 XP`
   - Zero-hint bonus: `+10 XP`
   - Quiz question correct: `+20 XP`
   - Daily concept completion: `+30 XP`
2. **Dynamic Levels**: Levels 1 through 5 scale progressively ($XP_{\text{required}} = 100 \times \text{Level}^{1.4}$).
3. **Daily Learning Streak**: Automatically evaluated by comparing the current UTC date with the stored timestamp. Streaks increment on consecutive days and reset gracefully after a 36-hour grace window.
4. **Web Audio Synthesizer**: Uses the native Web Audio API (`AudioContext`) to generate synthesized sound waves (sine, triangle, sawtooth) on the fly, eliminating external MP3 audio asset latency.
5. **Confetti Cannon Particle Engine**: Dynamic HTML5 Canvas particle system triggered on quiz completion and badge achievements.

---

## 9. Institutional Analytics & Early Warning System

For school administrators and mathematics faculty, Arya aggregates real-time telemetry:

```
[Student Submissions & Quiz Logs]
                 │
                 ▼
     Misconception Aggregator
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
Misconception Heatmap     Early Warning Radar
- Sign Flip Errors: 38%   - Flag: Aarav Patel (Class 8-A)
- Bracket Distr:    24%   - Risk Level: HIGH (Consecutive Quiz < 40%)
- Fraction Cross:   12%   - Prescribed Intervention: Balance Scale Visualizer
```

- **Early Warning System**: Automatically flags students whose 5-attempt rolling accuracy falls below 55%, alerting the teacher with targeted pedagogical remediation advice.
- **Cohort Misconception Heatmap**: Visualizes error distributions across Class 8-A and 8-B to guide classroom lesson planning.

---

## 10. Resilience, Latency Profiles & Failure Modes

| Potential Failure Mode | System Detection | Automatic Mitigation |
| :--- | :--- | :--- |
| **Gemini API Down / Quota Exceeded** | HTTP 429 / 503 / Network Timeout | Seamless fallback to local Socratic Heuristic Engine within 15ms. |
| **No Internet Connection** | `navigator.onLine === false` | Offline mode activates; local state cached in `localStorage`; UI remains fully operational. |
| **Firebase Cloud Unavailable** | Handshake rejection / Timeout | Graceful degradation to local cache; writes queued for background sync when connection recovers. |
| **Malformed Math Input** | Regex validation failure | Diagnostic prompt: *"Arya noticed unusual characters. Try typing your answer as a number, e.g., 4 or -3."* |

---

<p align="center">
  <strong>Arya AI Tutor System Architecture</strong> • Built for Scalable, Resilient Socratic Learning.
</p>
