// State Management Module for AI Tutor
// Persists student profile, session history, gamification metrics (XP, streak, badges),
// and accuracy analytics by topic in LocalStorage.

export class StateManager {
  static STORAGE_KEY = "ai_tutor_app_state_v1";

  static getDefaultState() {
    return {
      profile: {
        name: "Aarav",
        grade: "Class 8",
        difficulty: "Beginner", // Beginner, Intermediate, Advanced
        selectedTopic: "linear_eq_one_var",
        avatar: "🚀",
        targetExamDate: "",
        studyGoals: "Score 95%+ in Math Midterms"
      },
      gamification: {
        xp: 120,
        level: 1,
        streak: 3,
        lastActiveDate: new Date().toISOString().split("T")[0],
        unlockedBadges: ["welcome_onboard", "first_equation"]
      },
      analytics: {
        totalQuestionsAttempted: 8,
        totalQuestionsCorrect: 6,
        timeSpentMinutes: 24,
        topicStats: {
          "Linear Equations": { attempted: 5, correct: 4 },
          "Algebraic Expressions": { attempted: 2, correct: 1 },
          "Factorisation": { attempted: 1, correct: 1 },
          "Word Problems": { attempted: 0, correct: 0 }
        },
        attemptsHistory: []
      },
      settings: {
        theme: "dark",
        soundEffects: true,
        speechSynthesis: false,
        useLiveApi: false,
        geminiApiKey: "",
        geminiModel: "gemini-1.5-flash"
      },
      savedNotes: []
    };
  }

  static loadState() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        const defaults = this.getDefaultState();
        this.saveState(defaults);
        return defaults;
      }
      const parsed = JSON.parse(raw);
      // Merge with defaults in case of new schema keys
      const merged = { ...this.getDefaultState(), ...parsed };
      this.updateDailyStreak(merged);
      return merged;
    } catch (e) {
      console.error("Failed to parse saved state, using defaults:", e);
      return this.getDefaultState();
    }
  }

  static saveState(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }

  // Daily Streak calculation
  static updateDailyStreak(state) {
    const today = new Date().toISOString().split("T")[0];
    const last = state.gamification.lastActiveDate;

    if (!last) {
      state.gamification.lastActiveDate = today;
      state.gamification.streak = 1;
      return;
    }

    if (last === today) {
      // Already active today
      return;
    }

    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const yesterday = prevDate.toISOString().split("T")[0];

    if (last === yesterday) {
      // Active yesterday, streak increments!
      state.gamification.streak += 1;
      state.gamification.lastActiveDate = today;
    } else {
      // Streak broken, reset to 1
      state.gamification.streak = 1;
      state.gamification.lastActiveDate = today;
    }
    this.saveState(state);
  }

  // Record an attempt and update metrics
  static recordAttempt(state, { topic, subtopic, difficulty, isCorrect, problemId }) {
    if (!state.analytics.topicStats[topic]) {
      state.analytics.topicStats[topic] = { attempted: 0, correct: 0 };
    }

    state.analytics.totalQuestionsAttempted += 1;
    state.analytics.topicStats[topic].attempted += 1;

    if (isCorrect) {
      state.analytics.totalQuestionsCorrect += 1;
      state.analytics.topicStats[topic].correct += 1;
      // Award XP
      const xpEarned = difficulty === "Advanced" ? 30 : difficulty === "Intermediate" ? 20 : 15;
      state.gamification.xp += xpEarned;
    } else {
      // Encouragement XP for effort
      state.gamification.xp += 5;
    }

    // Calculate level (100 XP per level)
    state.gamification.level = Math.floor(state.gamification.xp / 100) + 1;

    // Log history
    state.analytics.attemptsHistory.unshift({
      timestamp: new Date().toISOString(),
      topic,
      subtopic,
      difficulty,
      isCorrect,
      problemId
    });

    // Keep history capped at 100 items
    if (state.analytics.attemptsHistory.length > 100) {
      state.analytics.attemptsHistory.pop();
    }

    this.saveState(state);
  }

  // Identify Strong and Weak areas based on real attempts
  static getStrengthsAndWeaknesses(state) {
    const strongAreas = [];
    const needsPractice = [];

    const stats = state.analytics.topicStats;
    for (const [topic, data] of Object.entries(stats)) {
      if (data.attempted >= 2) {
        const accuracy = Math.round((data.correct / data.attempted) * 100);
        if (accuracy >= 70) {
          strongAreas.push({ topic, accuracy, count: data.attempted });
        } else {
          needsPractice.push({ topic, accuracy, count: data.attempted });
        }
      }
    }

    // Default fallbacks if learner has few attempts
    if (strongAreas.length === 0 && needsPractice.length === 0) {
      strongAreas.push({ topic: "Basic Linear Equations", accuracy: 80, count: 4 });
      needsPractice.push({ topic: "Word Problems & Fractions", accuracy: 50, count: 2 });
    }

    return { strongAreas, needsPractice };
  }

  // Auto-generate AI Next Recommended Lesson
  static getRecommendedLesson(state) {
    const { needsPractice } = this.getStrengthsAndWeaknesses(state);
    if (needsPractice.length > 0) {
      const topNeed = needsPractice[0].topic;
      return {
        topic: topNeed,
        title: `Mastering ${topNeed}`,
        reason: `Based on your recent attempts, reviewing ${topNeed} will give you the biggest boost in your score!`,
        actionMode: "practice",
        targetDifficulty: state.profile.difficulty
      };
    }
    return {
      topic: "Variables on Both Sides",
      title: "Equations with Variables on Both Sides",
      reason: "You've built rock-solid foundations in single-step equations! Let's level up.",
      actionMode: "learn",
      targetDifficulty: "Intermediate"
    };
  }
}
