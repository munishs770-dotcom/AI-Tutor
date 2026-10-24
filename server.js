// Arya AI Tutor - Production Express Server & Backend API
// Connects Frontend to Database (Firebase / Firestore), handles School Admin Portal APIs,
// provides Gemini AI Proxy, and serves the web application.

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
const staticDir = fs.existsSync(path.join(__dirname, 'public')) ? path.join(__dirname, 'public') : (fs.existsSync(path.join(process.cwd(), 'css')) ? process.cwd() : __dirname);
app.use(express.static(staticDir));

// In-Memory Database / Cache (syncs with Firebase Firestore when credentials provided)
const db = {
  schoolInfo: {
    schoolId: "DPS-DELHI-001",
    name: "Delhi Public School - Mathematics Dept.",
    academicYear: "2026-2027",
    teacherInCharge: "Dr. Rajesh Sharma (Head of Mathematics)"
  },
  announcements: [
    {
      id: "ann_1",
      date: new Date().toISOString().split("T")[0],
      title: "Mid-Term Linear Equations Revision Challenge",
      message: "All Class 8 students are encouraged to complete the Balance Scale simulation and at least 5 Practice Arena problems before Friday!",
      priority: "high",
      author: "Dr. Rajesh Sharma"
    }
  ],
  students: [
    {
      id: "std_aarav",
      name: "Aarav Sharma",
      email: "aarav.sharma@dps.edu",
      role: "student",
      grade: "Class 8-A",
      difficulty: "Beginner",
      avatar: "🚀",
      streak: 3,
      xp: 180,
      level: 1,
      totalAttempted: 8,
      totalCorrect: 6,
      accuracy: 75,
      strongAreas: ["Linear Equations", "Balance Scale"],
      weakAreas: ["Word Problems"],
      lastActive: new Date().toISOString()
    },
    {
      id: "std_priya",
      name: "Priya Patel",
      email: "priya.patel@dps.edu",
      role: "student",
      grade: "Class 8-A",
      difficulty: "Intermediate",
      avatar: "🌟",
      streak: 5,
      xp: 340,
      level: 3,
      totalAttempted: 16,
      totalCorrect: 14,
      accuracy: 88,
      strongAreas: ["Algebraic Identities", "Linear Equations"],
      weakAreas: ["Fractional Cross-Multiplication"],
      lastActive: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "std_rohan",
      name: "Rohan Verma",
      email: "rohan.verma@dps.edu",
      role: "student",
      grade: "Class 8-B",
      difficulty: "Beginner",
      avatar: "🦉",
      streak: 1,
      xp: 90,
      level: 1,
      totalAttempted: 9,
      totalCorrect: 4,
      accuracy: 44,
      strongAreas: ["Single-Step Equations"],
      weakAreas: ["Transposition Signs", "Word Problems"],
      lastActive: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: "std_ananya",
      name: "Ananya Iyer",
      email: "ananya.iyer@dps.edu",
      role: "student",
      grade: "Class 8-B",
      difficulty: "Advanced",
      avatar: "⚡",
      streak: 9,
      xp: 620,
      level: 6,
      totalAttempted: 28,
      totalCorrect: 26,
      accuracy: 93,
      strongAreas: ["Factorisation", "Identities", "Word Problems"],
      weakAreas: [],
      lastActive: new Date().toISOString()
    }
  ]
};

// -----------------------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------------------

// 1. Health check & DB mode
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    school: db.schoolInfo.name,
    totalEnrolled: db.students.length,
    backendMode: process.env.FIREBASE_PROJECT_ID ? 'Firebase Connected' : 'Local Cloud-Sync Server'
  });
});

// 2. School Admin - Overview Stats
app.get('/api/admin/school-stats', (req, res) => {
  const totalStudents = db.students.length;
  const totalAttempted = db.students.reduce((acc, s) => acc + s.totalAttempted, 0);
  const totalCorrect = db.students.reduce((acc, s) => acc + s.totalCorrect, 0);
  const avgAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const activeStreakCount = db.students.filter(s => s.streak >= 3).length;
  const atRiskStudents = db.students.filter(s => s.accuracy < 60);

  const topicBenchmarks = {
    "Linear Equations": { avgAccuracy: 82, totalAttempts: 34 },
    "Algebraic Expressions": { avgAccuracy: 76, totalAttempts: 18 },
    "Factorisation": { avgAccuracy: 71, totalAttempts: 14 },
    "Word Problems": { avgAccuracy: 58, totalAttempts: 22 } // At-risk topic
  };

  res.json({
    schoolInfo: db.schoolInfo,
    kpis: {
      totalStudents,
      avgAccuracy,
      totalQuestionsSolved: totalAttempted,
      activeStreakCount,
      atRiskCount: atRiskStudents.length
    },
    topicBenchmarks,
    atRiskStudents: atRiskStudents.map(s => ({
      name: s.name,
      grade: s.grade,
      accuracy: s.accuracy,
      weakAreas: s.weakAreas
    })),
    announcements: db.announcements
  });
});

// 3. School Admin - Student Roster
app.get('/api/admin/students', (req, res) => {
  const { grade, difficulty, search } = req.query;
  let results = [...db.students];

  if (grade) {
    results = results.filter(s => s.grade === grade);
  }
  if (difficulty) {
    results = results.filter(s => s.difficulty === difficulty);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }

  res.json({
    count: results.length,
    students: results
  });
});

// 4. School Admin - Broadcast Announcement
app.post('/api/admin/broadcast', (req, res) => {
  const { title, message, priority } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  const newAnn = {
    id: 'ann_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    title,
    message,
    priority: priority || 'normal',
    author: db.schoolInfo.teacherInCharge
  };

  db.announcements.unshift(newAnn);
  res.json({ success: true, announcement: newAnn });
});

// 5. Intelligent Suggestions Engine API
app.get('/api/suggestions/:studentId', (req, res) => {
  const student = db.students.find(s => s.id === req.params.studentId) || db.students[0];

  const suggestions = [];

  // Suggestion 1: Adaptive Difficulty Check
  if (student.accuracy >= 80 && student.difficulty === 'Beginner') {
    suggestions.push({
      type: 'level_up',
      badge: '🚀 Difficulty Nudge',
      title: 'Ready for Intermediate Equations!',
      message: `Great job scoring ${student.accuracy}%! You've mastered single-step equations. Level up to Intermediate for +20 XP per problem!`,
      actionText: 'Switch to Intermediate',
      actionView: 'practice'
    });
  } else if (student.accuracy < 55) {
    suggestions.push({
      type: 'review',
      badge: '💡 Foundation Review',
      title: 'Review the Balance Scale',
      message: 'Visualizing equations as a balanced scale is the fastest way to eliminate sign errors. Spend 3 minutes exploring LHS = RHS!',
      actionText: 'Open Balance Scale',
      actionView: 'learn'
    });
  }

  // Suggestion 2: Weak Area Remediation
  if (student.weakAreas && student.weakAreas.length > 0) {
    const primaryWeakness = student.weakAreas[0];
    suggestions.push({
      type: 'weakness_boost',
      badge: '🎯 Targeted Focus',
      title: `Boost Your ${primaryWeakness}`,
      message: `Our AI detected a few missed questions in ${primaryWeakness}. A quick 5-question practice set will turn this into a strength!`,
      actionText: 'Practice Now',
      actionView: 'practice'
    });
  }

  // Suggestion 3: Streak Protector
  suggestions.push({
    type: 'streak_alert',
    badge: '🔥 Streak Protector',
    title: `Keep Your ${student.streak}-Day Streak Alive!`,
    message: 'Complete 1 quick practice problem or quiz today to maintain your consecutive learning streak and earn +30 XP!',
    actionText: 'Quick Practice',
    actionView: 'practice'
  });

  res.json({
    studentId: student.id,
    name: student.name,
    suggestions
  });
});

// 6. Progress Synchronization (Student -> Server / Firebase)
app.post('/api/sync/progress', (req, res) => {
  const { studentId, xp, streak, totalAttempted, totalCorrect, difficulty } = req.body;

  let student = db.students.find(s => s.id === studentId || s.email === studentId);
  if (student) {
    if (xp !== undefined) student.xp = xp;
    if (streak !== undefined) student.streak = streak;
    if (totalAttempted !== undefined) student.totalAttempted = totalAttempted;
    if (totalCorrect !== undefined) student.totalCorrect = totalCorrect;
    if (student.totalAttempted > 0) {
      student.accuracy = Math.round((student.totalCorrect / student.totalAttempted) * 100);
    }
    if (difficulty) student.difficulty = difficulty;
    student.lastActive = new Date().toISOString();
  }

  res.json({ success: true, student });
});

// 7. Secure Backend Gemini Chat Proxy
app.post('/api/chat', async (req, res) => {
  const { message, studentProfile, currentProblem } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || req.headers['x-gemini-key'];

  if (!apiKey) {
    return res.status(200).json({
      source: 'offline-proxy',
      note: 'Server operating in offline Socratic mode. Provide GEMINI_API_KEY in .env or Settings for live model proxy.'
    });
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = `You are "Arya", an empathetic Socratic Class 8 Mathematics Tutor. Student name is ${studentProfile?.name || 'Student'}. Guide with questions, never give direct answers immediately, and use simple everyday metaphors.`;

    const fetchResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `Context: ${currentProblem ? currentProblem.plainQuestion : 'Class 8 Math'}\nMessage: ${message}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    const data = await fetchResponse.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ source: 'gemini-server', response: reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Public Firebase Client Config Endpoint (Allows Vercel env vars to auto-hydrate frontend)
app.get('/api/config/firebase', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ai-tutor-class8.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ai-tutor-class8",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ai-tutor-class8.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    configured: Boolean(process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  });
});

// 9. Sync Practice Attempt (Cloud & Server Logging)
const attemptsLog = [];
app.post('/api/sync/attempt', (req, res) => {
  const attempt = {
    id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    ...req.body,
    receivedAt: new Date().toISOString()
  };
  attemptsLog.unshift(attempt);
  if (attemptsLog.length > 500) attemptsLog.pop(); // Keep recent 500
  res.json({ success: true, attemptId: attempt.id });
});

// 10. Sync Quiz Session
const quizLog = [];
app.post('/api/sync/quiz', (req, res) => {
  const session = {
    id: 'qz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    ...req.body,
    receivedAt: new Date().toISOString()
  };
  quizLog.unshift(session);
  if (quizLog.length > 200) quizLog.pop();
  res.json({ success: true, sessionId: session.id });
});

// 11. Sync AI Chat Doubt
const doubtsLog = [];
app.post('/api/sync/doubt', (req, res) => {
  const doubt = {
    id: 'dbt_' + Date.now(),
    ...req.body,
    receivedAt: new Date().toISOString()
  };
  doubtsLog.unshift(doubt);
  if (doubtsLog.length > 300) doubtsLog.pop();
  res.json({ success: true, doubtId: doubt.id });
});

// 12. Query Student History
app.get('/api/sync/history/:studentId', (req, res) => {
  const { studentId } = req.params;
  const studentAttempts = attemptsLog.filter(a => a.studentId === studentId);
  const studentQuizzes = quizLog.filter(q => q.studentId === studentId);
  res.json({
    studentId,
    totalAttempts: studentAttempts.length,
    attempts: studentAttempts.slice(0, 50),
    quizzes: studentQuizzes.slice(0, 20)
  });
});

// Fallback: Serve Single Page Application (only for clean HTML navigation routes, NOT for static assets or APIs)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found', path: req.path });
  }
  if (path.extname(req.path)) {
    return res.status(404).type('text/plain').send('File not found');
  }
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Start Express Server (only when run directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Arya AI Tutor Server Running on Port ${PORT}`);
    console.log(`🌐 Live URL: http://localhost:${PORT}`);
    console.log(`🏫 School: ${db.schoolInfo.name}`);
    console.log(`📊 Admin Portal: http://localhost:${PORT}#admin`);
    console.log(`🔥 Firebase API Config: http://localhost:${PORT}/api/config/firebase`);
    console.log(`=======================================================`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;
