# ⚖️ Arya AI Tutor: Class 8 Mathematics Personalized Learning Assistant

> **Capstone Project**: AI-Powered Personalized Learning Assistant  
> **Target Subject**: Class 8 Mathematics — Algebra & Linear Equations in One Variable  
> **Target Audience**: Students aged 12–15 (NCERT / CBSE / ICSE / Common Core)  
> **Live Local Web App**: `http://localhost:8080/`

---

## 🌟 1. Project Objective & Vision
The objective of this project is to build an AI-powered personalized tutoring application that helps students master **Class 8 Mathematics (Algebra & Linear Equations)** through intuitive Socratic explanations, interactive simulations, dynamic problem generation, progressive hint ladders, and continuous diagnostic feedback.

Instead of a generic chatbot that directly gives away answers, **Arya AI Tutor** acts as a true pedagogical mentor:
- Explains concepts through real-world visual metaphors (such as a grocery **Balance Scale** for equations and mystery gift boxes for variables).
- Scaffolds learning with a **3-tier Hint Ladder** (Conceptual Nudge ➔ Strategy Guide ➔ Step-by-Step Derivation).
- Diagnoses common adolescent algebraic misconceptions (e.g., forgetting to flip signs when transposing across the `=` border).
- Dynamically generates infinite practice problems and quizzes with guaranteed clean integer solutions.
- Recommends personalized study roadmaps and next lessons based on real learner performance.

---

## 🎯 2. Target Audience Analysis

| Dimension | Specification |
| :--- | :--- |
| **Intended Learner** | Students aged **12–15 years** studying **Class 8 Mathematics**. |
| **Key Challenges Faced** | 1. **Formula Memorization vs. Application:** Students can recite $(a+b)^2 = a^2 + 2ab + b^2$ but fail to apply it in mental math or problem expansions.<br>2. **Transposition Confusion:** Forgetting to change signs when moving numbers across `=` (e.g., writing $x = 10 + 4$ instead of $10 - 4$).<br>3. **Word Problem Intimidation:** Difficulty translating English sentences (age problems, perimeter, consecutive integers) into algebraic equations. |
| **How AI Tutor Solves It** | 1. **Interactive Equation Balance Scale Widget:** Visually proves that LHS must equal RHS and demonstrates that removing weights from both pans maintains balance.<br>2. **Socratic AI Guidance:** Prompts students with guiding questions rather than spoon-feeding solutions.<br>3. **Personalized Diagnostic Feedback:** Differentiates between arithmetic slips and conceptual errors (e.g., detecting sign flips). |

---

## 🧠 3. Tutor Persona & System Prompt

Arya's core personality is anchored in the **Socratic Method** and growth-mindset educational psychology.

```markdown
You are "Arya", an empathetic, expert AI Mathematics Tutor specializing in Class 8 Mathematics (ages 12-15), specifically focusing on Algebra and Linear Equations in One Variable.

TEACHING PHILOSOPHY & BEHAVIOR:
1. Socratic Teaching: Guide through questions. If the student asks for an answer, DO NOT give the final number directly. Give a gentle conceptual hint first, then a leading question, and only provide the full solution if they remain stuck after multiple attempts.
2. Simplicity & Clarity: Use plain, conversational language suitable for an 8th grader. Avoid intimidating mathematical jargon unless you explain it with an everyday analogy (e.g., grocery balance scale, mystery gift boxes).
3. Encouragement & Growth Mindset: Always validate effort. If the student makes a mistake, celebrate that they tried and diagnose why it happened (e.g., "Ah, check what happened to the plus sign when it crossed the equals border!").
4. Math Notation: Format math formulas clearly using standard LaTeX math syntax ($2x + 5 = 15$).
5. Interactivity: End explanations with a quick check-for-understanding question.
```

---

## 🚀 4. Core Features & Learning Modes

### 🎓 1. Learn Mode (Interactive Concept Mastery)
- **NCERT/CBSE Class 8 Curated Curriculum:**
  - *Linear Equations in One Variable* (Balance scale, single/two-step equations, variables on both sides, fractions, brackets, word problems).
  - *Algebraic Expressions & Identities* (Terms, like/unlike terms, standard identities: $(a+b)^2$, $(a-b)^2$, $(a+b)(a-b)$).
  - *Factorisation* (Common factors, regrouping, splitting the middle term).
- **Interactive Equation Balance Scale Widget:** An interactive SVG simulation of a grocery balance scale where students can add/subtract unit weights or $x$-boxes on both pans to see the scale tilt or balance!
- **Worked Examples & Quick Checks:** Interactive multiple-choice checkpoints that provide immediate feedback and award XP.

### ✍️ 2. Practice Arena (Infinite Dynamic Problem Generator)
- **Procedural Math Engine:** Procedurally generates unlimited, mathematically sound problems with clean integer solutions across 3 difficulty tiers:
  - *Beginner:* Single-step and two-step linear equations ($x + a = b$, $ax + b = c$).
  - *Intermediate:* Variables on both sides and brackets ($ax + b = cx + d$, $a(x+b) = c$).
  - *Advanced:* Fractional equations with cross-multiplication and multi-bracket distributions.
- **3-Tier Hint Ladder:** 
  - *Level 1:* Conceptual Goal Reminder
  - *Level 2:* Targeted Operation Hint
  - *Level 3:* Step-by-Step Derivation & Verification
- **Built-in Digital Scratchpad / Whiteboard:** Canvas-based scratchpad with pen, color palette, and eraser so students can work out calculations directly on screen.
- **Diagnostic Evaluator:** Analyzes student submissions and provides custom feedback for sign errors, arithmetic slips, or algebraic misconceptions.

### 🏆 3. Quiz Arena (Gamified Speed Challenge)
- **5-Question Timed Challenge:** Randomized question set pulled across curriculum domains.
- **Dynamic Distractor Engine:** Generates 4 unique multiple-choice options with realistic distractors (including sign-flip traps).
- **Live Stopwatch & Visual Progress Bar.**
- **Comprehensive Score Card & Report:** Displays total score, accuracy percentage, XP rewards, and itemized question-by-question review with tutor advice.

### ❓ 4. Ask Arya (Socratic AI Chat)
- Conversational chat powered by a **Hybrid AI Engine**:
  - **Live Google Gemini API Integration:** Seamlessly connects with `gemini-1.5-flash` or `gemini-2.0-flash`.
  - **Smart Offline Socratic Brain:** Heuristic math pattern matcher and reasoning engine that works 100% out-of-the-box without needing an API key or internet connection.
- **Voice Microphone Input:** Speak math doubts directly using the Web Speech Recognition API.
- **Voice Read-Aloud (TTS):** Toggle speech synthesis so Arya reads responses aloud.
- **Quick Doubt Chips:** One-click prompts for common adolescent doubts.

---

## 💎 5. Advanced Features Implemented

1. **Student Profile & Personalization:**
   - Configure Student Name, Difficulty Tier (Beginner, Intermediate, Advanced), and Target Academic Goals.
   - Dynamic difficulty auto-adaptation based on question history.
2. **Analytics & Canvas Progress Charts:**
   - Topic Mastery Bar Chart rendered on HTML5 Canvas.
   - Dynamic classification of **Strong Areas** (70%+ accuracy) vs. **Needs Practice**.
   - AI-recommended next lesson based on performance.
3. **7-Day Personalized Study Roadmap:**
   - Automatically generated 7-day adaptive plan with daily activities, milestones, and time commitments.
4. **Smart Notes & PDF Study Assistant:**
   - Paste class notes or upload `.txt` / `.md` summaries.
   - Automatically extracts formulas ($ax+b=c$, $(a+b)^2$) and auto-generates custom quiz questions directly from the student's own notes.
5. **Teacher & Parent Dashboard:**
   - Summary of total questions attempted, overall accuracy, active days, and streak.
   - Auto-generated academic remarks diagnosing learner strengths and weaknesses.
   - One-click **Print / Save PDF Report**.
6. **Gamification & Rewards Engine:**
   - **XP System:** Earn XP for practice problems, quick checks, quizzes, and notes analysis.
   - **Level Progression:** Advance from Level 1 Novice up to Level 5 Math Wizard.
   - **Daily Learning Streak Tracker:** Persisted in `localStorage` across consecutive days.
   - **8 Unlockable Achievement Badges** (Equation Pioneer, Streak Champion, Flawless Quizzer, Socratic Thinker, etc.).
   - **Web Audio Sound Synthesizer:** Real-time synthesized audio feedback (success chimes, encouragement pulses, victory fanfares) with zero external audio assets.
   - **Full-Screen Confetti Cannon:** Celebratory particle effects on quiz completion and badge unlocks.

---

## 🛠️ 6. Technology Stack & Architecture

- **Backend Server:** Express.js REST API with CORS (`server.js`), 7 endpoints including health, AI proxy, student sync, curriculum, and admin analytics.
- **Database & Auth:** Firebase Authentication (Email/Password & Google Sign-In) + Cloud Firestore real-time database sync with automatic offline fallback.
- **Frontend:** Vanilla HTML5, CSS3, ES6 Modular JavaScript (Zero heavy external frontend framework overhead).
- **Styling & Aesthetics:** Deep cosmic glassmorphism, responsive CSS grid, vibrant dark/light mode with CSS custom properties, micro-animations, Google Fonts (*Outfit*, *Inter*, *Fira Code*).
- **Mathematical Typography:** KaTeX CDN with auto-render extension for LaTeX formulas ($2x + 5 = 17$, $\frac{a}{b}$).
- **State & Persistence:** Dual-engine `StateManager` + `FirebaseService` synchronization tracking profiles, attempts history, XP, streaks, and school cohorts.
- **AI Backend:** Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) via secure backend proxy + Offline Socratic Heuristic Engine.

```
d:/AI Tutor Project/
│
├── index.html                  # Core single-page web application (9 views, 4 modals)
├── server.js                   # Express.js backend server & REST API (Port 8080)
├── project-report.html         # 15-page comprehensive project report (printable to PDF)
├── AI_Tutor_Project_Report.pdf # Generated 15-page PDF report file (4.2 MB)
├── README.md                   # Complete documentation & project manual
├── package.json                # Node.js dependencies & run scripts
├── .env.example                # Environment variables template
├── css/
│   └── styles.css              # Design system, glassmorphism, themes & animations
├── js/
│   ├── app.js                  # Main controller, navigation & view coordinator
│   ├── data/
│   │   └── curriculum.js       # Class 8 Algebra curriculum, examples & misconceptions
│   └── modules/
│       ├── ai-engine.js        # Hybrid AI Engine: Gemini API + Offline Socratic Brain
│       ├── firebase-service.js # Firebase Auth (Google/Email) & Firestore cloud database
│       ├── admin-portal.js     # School Admin Portal: student rosters, cohorts, CSV export
│       ├── suggestions-engine.js# Real-time adaptive nudges & behavioral recommendations
│       ├── problem-generator.js# Dynamic procedural algebra generator & answer evaluator
│       ├── state.js            # LocalStorage state management, analytics & streak
│       ├── gamification.js     # XP, badges, Web Audio synthesizer & confetti cannon
│       ├── balance-scale.js    # Interactive SVG Balance Scale equation simulation
│       ├── whiteboard.js       # Canvas scratchpad / digital math drawing tool
│       ├── analytics.js        # Canvas Topic Mastery Chart & 7-Day Study Plan generator
│       └── pdf-reader.js       # Notes formula extractor & custom question generator
```

---

## 💻 7. How to Run Locally

1. Open a terminal in the project directory:
   ```bash
   cd "d:/AI Tutor Project"
   ```
2. Start the Express backend server:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   - **Main Web Application:** `http://localhost:8080/`
   - **15-Page Project Report (Web):** `http://localhost:8080/project-report.html`
   - **Pre-rendered PDF Report:** Open `d:/AI Tutor Project/AI_Tutor_Project_Report.pdf`
   - **API Health Check:** `http://localhost:8080/api/health`

---

## 🎬 8. Suggested Demonstration Walkthrough

For presentations and evaluators, follow this 5-minute showcase flow:

1. **Curriculum & Balance Scale (1 min):**
   - Open **Learn Concepts**. Show how an equation is defined as a balance scale.
   - Click `- 1 Unit` and `+ 1 Unit` on the interactive Balance Scale widget to show how LHS and RHS tilt and balance.
   - Answer the Quick Check question to demonstrate instant feedback and XP reward.
2. **Practice Arena & Hint Ladder (1 min):**
   - Click **Practice Arena**. Notice the dynamically generated algebra problem.
   - Click **Toggle Scratchpad** to demonstrate how students can scribble calculations on screen.
   - Click **Need a Hint?** to show the 3-tier progressive hint ladder.
   - Enter a test answer (e.g. correct value or sign flip) to demonstrate the diagnostic evaluator.
3. **Ask Arya (Socratic AI Chat) (1 min):**
   - Click **Ask Arya (AI Chat)**.
   - Click the prompt chip: *"Why does the sign change during transposition?"*
   - Show how Arya explains with the "magic border checkpoint" metaphor.
   - Optionally speak via the microphone or toggle voice read-aloud.
4. **Quiz Arena (1 min):**
   - Navigate to **Quiz Arena** and click **Start Quiz Challenge**.
   - Answer questions with the live timer and progress bar.
   - Complete the quiz to trigger the celebratory confetti and review screen.
5. **Analytics & Teacher Dashboard (1 min):**
   - Open **Progress & Insights** to show the Canvas Topic Mastery bar chart and AI next-lesson recommendation.
   - Open **Teacher Dashboard** to highlight the academic diagnostic summary and print report button.
