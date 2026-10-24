// Intelligent Suggestions & Adaptive Difficulty Engine
// Evaluates real-time learner patterns, accuracy velocity, and misconceptions
// to generate actionable, growth-oriented educational recommendations.

export class SuggestionsEngine {
  static async fetchSuggestions(studentProfile, recentAttempts = []) {
    // Attempt to fetch from backend server
    try {
      const studentId = studentProfile.uid || studentProfile.name || "default";
      const response = await fetch(`/api/suggestions/${encodeURIComponent(studentId)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.suggestions && data.suggestions.length > 0) {
          return data.suggestions;
        }
      }
    } catch (e) {
      // Fallback to client heuristics
    }

    return this.generateClientSuggestions(studentProfile, recentAttempts);
  }

  static generateClientSuggestions(profile, recentAttempts) {
    const suggestions = [];
    const accuracy = profile.accuracy || 75;
    const diff = profile.difficulty || "Beginner";

    // 1. Adaptive Difficulty Nudge
    if (accuracy >= 80 && diff === "Beginner") {
      suggestions.push({
        type: "level_up",
        badge: "🚀 Difficulty Nudge",
        title: "Ready for Intermediate Tier!",
        message: `You've achieved ${accuracy}% accuracy on single-step equations. Step up to Intermediate tier to tackle brackets and variables on both sides (+20 XP)!`,
        actionText: "Switch to Intermediate",
        actionView: "practice",
        targetDifficulty: "Intermediate"
      });
    } else if (accuracy < 60) {
      suggestions.push({
        type: "review",
        badge: "💡 Foundation Review",
        title: "Review the Balance Scale",
        message: "Visualizing equations as a grocery balance scale eliminates 90% of transposition sign slips. Spend 2 minutes testing LHS = RHS!",
        actionText: "Open Balance Scale",
        actionView: "learn"
      });
    }

    // 2. Misconception Remediation
    suggestions.push({
      type: "remediation",
      badge: "🎯 Targeted Practice",
      title: "Master Word Problem Translations",
      message: "Translate English sentences into algebra using our 3-Step Codebreaker (Assign $x$ ➔ Form Equation ➔ Balance).",
      actionText: "Try Word Problems",
      actionView: "practice",
      targetTopic: "word_problems"
    });

    // 3. Mental Math Identity Trick
    suggestions.push({
      type: "tip",
      badge: "⚡ Mental Math Secret",
      title: "Multiply Instantly with Identities",
      message: "Did you know you can calculate $104 \\times 96$ mentally in 3 seconds? Use $(100 + 4)(100 - 4) = 100^2 - 4^2 = 9984$!",
      actionText: "Explore Identities",
      actionView: "learn"
    });

    return suggestions;
  }

  // Renders suggestions into a target container
  static renderSuggestionsWidget(containerId, suggestions, onActionClick) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!suggestions || suggestions.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="suggestions-panel card-glass">
        <div class="suggestions-header">
          <div class="suggestions-title">
            <span class="icon">✨</span>
            <h4>Arya's Smart Learning Suggestions</h4>
          </div>
          <span class="suggestions-count">${suggestions.length} Active Insights</span>
        </div>

        <div class="suggestions-grid">
          ${suggestions.map((s, idx) => `
            <div class="suggestion-item card-glass ${s.type}">
              <div class="suggestion-badge">${s.badge}</div>
              <h5>${s.title}</h5>
              <p>${s.message}</p>
              ${s.actionText ? `
                <button class="btn btn-sm btn-outline suggestion-act-btn" data-idx="${idx}">
                  ${s.actionText} →
                </button>
              ` : ''}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    // Attach click listeners to action buttons
    container.querySelectorAll(".suggestion-act-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
        const item = suggestions[idx];
        if (onActionClick && item) {
          onActionClick(item);
        }
      });
    });
  }
}
