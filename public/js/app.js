// Main Application Controller: Arya - Class 8 AI Math Tutor
// Orchestrates navigation, learning modes, dynamic problem generation,
// Socratic chat, quiz arena, whiteboard, balance scale, gamification,
// Firebase Authentication, Intelligent Suggestions, and School Admin Portal.

import { CURRICULUM, COMMON_MISCONCEPTIONS } from "./data/curriculum.js";
import { ProblemGenerator } from "./modules/problem-generator.js";
import { AIEngine } from "./modules/ai-engine.js";
import { StateManager } from "./modules/state.js";
import { SoundManager, ConfettiCannon, BADGES } from "./modules/gamification.js";
import { BalanceScaleWidget } from "./modules/balance-scale.js";
import { Whiteboard } from "./modules/whiteboard.js";
import { AnalyticsRenderer } from "./modules/analytics.js";
import { NotesProcessor } from "./modules/pdf-reader.js";
import { FirebaseService } from "./modules/firebase-service.js";
import { SuggestionsEngine } from "./modules/suggestions-engine.js";
import { AdminPortal } from "./modules/admin-portal.js";

class App {
  constructor() {
    this.state = StateManager.loadState();
    this.aiEngine = new AIEngine();
    this.soundManager = new SoundManager();
    this.soundManager.enabled = this.state.settings.soundEffects;

    this.firebaseService = new FirebaseService();
    this.adminPortal = new AdminPortal(this);

    this.currentView = "learn";
    this.activeTopic = CURRICULUM[0];
    this.activeSubtopic = CURRICULUM[0].subtopics[0];

    // Practice Mode State
    this.currentPracticeProblem = null;
    this.practiceHintLevel = 0;
    this.whiteboard = null;
    this.balanceScale = null;

    // Quiz Arena State
    this.quizState = {
      active: false,
      questions: [],
      currentIndex: 0,
      userAnswers: [],
      score: 0,
      timerSeconds: 0,
      timerInterval: null
    };

    this.suggestions = [];

    this.init();
  }

  init() {
    this.applyTheme(this.state.settings.theme);
    this.setupAuth();
    this.updateHeaderUI();
    this.setupNavigation();
    this.setupModals();
    this.setupLearnView();
    this.setupPracticeView();
    this.setupQuizView();
    this.setupChatView();
    this.setupAnalyticsView();
    this.setupStudyPlanView();
    this.setupNotesView();
    this.setupTeacherView();
    this.setupAdminPortalView();
    this.setupBadgesModal();
    this.loadSuggestions();

    // Default view: learn
    this.switchView("learn");

    // Initialize balance scale widget
    setTimeout(() => {
      this.balanceScale = new BalanceScaleWidget("scale-interactive-container");
      this.balanceScale.init();
      this.renderMathJaxOrKaTeX();
    }, 100);
  }

  // --- Authentication & Firebase Integration ---
  setupAuth() {
    this.firebaseService.onAuthStateChanged((user) => {
      this.handleAuthStateChange(user);
    });

    const openLoginBtn = document.getElementById("header-login-btn");
    if (openLoginBtn) {
      openLoginBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.openLoginModal();
      });
    }

    const logoutBtn = document.getElementById("header-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        this.soundManager.playClick();
        await this.firebaseService.signOut();
        this.showToast("Signed out successfully.", "info");
      });
    }

    // Google Sign-In Button
    const googleLoginBtn = document.getElementById("auth-google-login-btn");
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener("click", async () => {
        this.soundManager.playClick();
        const role = document.querySelector('input[name="auth-role"]:checked')?.value || "student";
        const res = await this.firebaseService.signInWithGoogle(role);
        if (res.success) {
          this.closeModal("login-modal");
          this.soundManager.playSuccess();
          ConfettiCannon.fire(2000);
          this.showToast(`Welcome back, ${res.user.name}! Connected with Google.`, "success");
        }
      });
    }

    // Email/Password Form Submit
    const emailAuthForm = document.getElementById("auth-email-form");
    if (emailAuthForm) {
      emailAuthForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("auth-input-email").value;
        const pass = document.getElementById("auth-input-password").value;
        const role = document.querySelector('input[name="auth-role"]:checked')?.value || "student";
        const res = await this.firebaseService.signInWithEmailPassword(email, pass, role);
        if (res.success) {
          this.closeModal("login-modal");
          this.soundManager.playSuccess();
          this.showToast(`Welcome ${res.user.name}! (${role === 'admin' ? 'School Authority' : 'Student'})`, "success");
        }
      });
    }

    // Quick Demo Logins
    document.getElementById("demo-login-student")?.addEventListener("click", async () => {
      await this.firebaseService.signInWithEmailPassword("aarav.sharma@dps.edu", "password123", "student");
      this.closeModal("login-modal");
      this.soundManager.playSuccess();
      this.showToast("Logged in as Demo Student: Aarav Sharma", "success");
    });

    document.getElementById("demo-login-admin")?.addEventListener("click", async () => {
      await this.firebaseService.signInWithEmailPassword("dr.sharma@dps.edu", "admin123", "admin");
      this.closeModal("login-modal");
      this.soundManager.playSuccess();
      this.showToast("Logged in as School Authority: Dr. Rajesh Sharma", "success");
      this.switchView("admin");
    });
  }

  handleAuthStateChange(user) {
    const loginBtn = document.getElementById("header-login-btn");
    const logoutBtn = document.getElementById("header-logout-btn");
    const userChip = document.getElementById("header-profile-btn");
    const adminNavBtn = document.getElementById("nav-btn-admin");

    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "flex";
      if (userChip) {
        userChip.style.display = "flex";
        document.getElementById("header-student-name").textContent = user.name;
        document.getElementById("header-avatar").textContent = user.avatar || "🎓";
      }

      this.state.profile.name = user.name;
      this.state.profile.email = user.email;
      this.state.profile.role = user.role;
      StateManager.saveState(this.state);

      // Show Admin Portal in Sidebar if user is admin
      if (adminNavBtn) {
        if (user.role === "admin") {
          adminNavBtn.style.display = "flex";
        } else {
          adminNavBtn.style.display = "flex"; // Keep accessible for demonstration
        }
      }
    } else {
      if (loginBtn) loginBtn.style.display = "flex";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (userChip) userChip.style.display = "flex";
    }

    this.updateHeaderUI();
  }

  openLoginModal() {
    const modal = document.getElementById("login-modal");
    if (modal) modal.classList.add("active");
  }

  // --- Intelligent Suggestions Engine ---
  async loadSuggestions() {
    this.suggestions = await SuggestionsEngine.fetchSuggestions(this.state.profile);

    const onAction = (item) => {
      this.soundManager.playClick();
      if (item.targetDifficulty) {
        this.state.profile.difficulty = item.targetDifficulty;
        StateManager.saveState(this.state);
        const diffSelect = document.getElementById("practice-difficulty-select");
        if (diffSelect) diffSelect.value = item.targetDifficulty;
      }
      if (item.targetTopic) {
        const topicSelect = document.getElementById("practice-topic-select");
        if (topicSelect) topicSelect.value = item.targetTopic;
      }
      this.switchView(item.actionView || "practice");
      this.showToast(`Applied suggestion: ${item.title}`, "info");
    };

    SuggestionsEngine.renderSuggestionsWidget("learn-suggestions-container", this.suggestions, onAction);
    SuggestionsEngine.renderSuggestionsWidget("practice-suggestions-container", this.suggestions, onAction);
    this.renderMathJaxOrKaTeX();
  }

  // --- Theme & Sound ---
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.state.settings.theme = theme;
    StateManager.saveState(this.state);
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.innerHTML = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  }

  toggleTheme() {
    const next = this.state.settings.theme === "dark" ? "light" : "dark";
    this.applyTheme(next);
  }

  // --- Header & Global Badges ---
  updateHeaderUI() {
    const p = this.state.profile;
    const g = this.state.gamification;

    const studentNameEl = document.getElementById("header-student-name");
    const streakEl = document.getElementById("header-streak-count");
    const xpEl = document.getElementById("header-xp-count");
    const levelEl = document.getElementById("header-level-badge");
    const avatarEl = document.getElementById("header-avatar");

    if (studentNameEl) studentNameEl.textContent = p.name;
    if (streakEl) streakEl.textContent = `${g.streak} Days`;
    if (xpEl) xpEl.textContent = `${g.xp} XP`;
    if (levelEl) levelEl.textContent = `Lvl ${g.level}`;
    if (avatarEl) avatarEl.textContent = p.avatar;

    // Check for level milestones or new badges
    this.checkBadgesUnlock();
  }

  checkBadgesUnlock() {
    const g = this.state.gamification;
    const unlocked = g.unlockedBadges;

    if (g.streak >= 3 && !unlocked.includes("streak_3")) this.unlockBadge("streak_3");
    if (g.streak >= 7 && !unlocked.includes("streak_7")) this.unlockBadge("streak_7");
    if (g.level >= 5 && !unlocked.includes("math_wizard")) this.unlockBadge("math_wizard");
  }

  unlockBadge(badgeId) {
    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return;

    this.state.gamification.unlockedBadges.push(badgeId);
    this.state.gamification.xp += badge.xpReward;
    StateManager.saveState(this.state);

    this.soundManager.playFanfare();
    ConfettiCannon.fire(3000);

    this.showToast(`🏆 Badge Unlocked: ${badge.name}! +${badge.xpReward} XP`, "success");
    this.updateHeaderUI();
  }

  // --- View Navigation ---
  setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-item");
    navButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const view = e.currentTarget.getAttribute("data-view");
        this.soundManager.playClick();
        this.switchView(view);
      });
    });

    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.toggleTheme();
      });
    }

    const soundBtn = document.getElementById("sound-toggle-btn");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        this.state.settings.soundEffects = !this.state.settings.soundEffects;
        this.soundManager.enabled = this.state.settings.soundEffects;
        StateManager.saveState(this.state);
        soundBtn.innerHTML = this.soundManager.enabled ? "🔊 Sound On" : "🔇 Sound Off";
        this.showToast(this.soundManager.enabled ? "Sound effects enabled" : "Sound effects muted");
      });
    }

    const profileBadgeBtn = document.getElementById("header-profile-btn");
    if (profileBadgeBtn) {
      profileBadgeBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.openProfileModal();
      });
    }

    const settingsBtn = document.getElementById("header-settings-btn");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.openSettingsModal();
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    document.querySelectorAll(".nav-item").forEach((btn) => {
      if (btn.getAttribute("data-view") === viewName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    document.querySelectorAll(".app-view").forEach((panel) => {
      if (panel.id === `view-${viewName}`) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    if (viewName === "analytics") {
      this.refreshAnalytics();
    } else if (viewName === "practice" && !this.currentPracticeProblem) {
      this.nextPracticeProblem();
    } else if (viewName === "teacher") {
      this.refreshTeacherDashboard();
    } else if (viewName === "admin") {
      this.adminPortal.fetchAdminData();
    }

    this.renderMathJaxOrKaTeX();
  }

  // --- Modals Setup ---
  setupModals() {
    document.querySelectorAll(".modal-close, .modal-backdrop").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-backdrop") || e.target.classList.contains("modal-close")) {
          document.querySelectorAll(".modal-container").forEach((m) => m.classList.remove("active"));
        }
      });
    });

    // Cloud DB Header Status Button -> Opens Settings modal directly
    const cloudHeaderBtn = document.getElementById("header-cloud-btn");
    if (cloudHeaderBtn) {
      cloudHeaderBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.openSettingsModal();
      });
    }

    // Test Firebase Connection Button in Settings
    const testFbBtn = document.getElementById("btn-test-firebase-conn");
    if (testFbBtn) {
      testFbBtn.addEventListener("click", async () => {
        this.soundManager.playClick();
        const outputEl = document.getElementById("settings-firebase-test-output");
        if (outputEl) {
          outputEl.style.display = "block";
          outputEl.style.color = "#38bdf8";
          outputEl.innerHTML = "⏳ Testing Cloud Firestore connection...";
        }

        const res = await this.firebaseService.testFirestoreConnection();
        if (outputEl) {
          if (res.success) {
            outputEl.style.color = "#34d399";
            outputEl.innerHTML = `✅ <strong>Connected!</strong> ${res.message}`;
            this.soundManager.playSuccess();
          } else {
            outputEl.style.color = "#f87171";
            outputEl.innerHTML = `⚠️ <strong>Notice:</strong> ${res.message}`;
            this.soundManager.playEncouragement();
          }
        }
      });
    }

    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveProfileFromForm();
      });
    }

    const settingsForm = document.getElementById("settings-form");
    if (settingsForm) {
      settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveSettingsFromForm();
      });
    }

    // Listen for Firebase Connection status changes
    this.firebaseService.onConnectionStateChanged((status) => {
      const cloudIcon = document.getElementById("header-cloud-icon");
      const cloudText = document.getElementById("header-cloud-text");
      const statusBadge = document.getElementById("settings-db-status-badge");
      const statusDesc = document.getElementById("settings-db-status-desc");

      if (status.mode === "live") {
        if (cloudIcon) cloudIcon.textContent = "🟢";
        if (cloudText) cloudText.textContent = `Firestore: ${status.projectId}`;
        if (statusBadge) statusBadge.innerHTML = `🟢 <strong>Live Cloud Firestore:</strong> ${status.projectId}`;
        if (statusDesc) statusDesc.textContent = "Authenticated with live Google Firebase database. Real-time cloud sync active.";
      } else {
        if (cloudIcon) cloudIcon.textContent = "🟡";
        if (cloudText) cloudText.textContent = "Cloud DB: Ready";
        if (statusBadge) statusBadge.innerHTML = `🟡 <strong>Cloud DB:</strong> Hybrid Sync Active`;
        if (statusDesc) statusDesc.textContent = "Synced with Express backend & local cache. Enter Firebase API Key for live Firestore.";
      }
    });
  }

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove("active");
  }

  openProfileModal() {
    const modal = document.getElementById("profile-modal");
    if (!modal) return;
    const p = this.state.profile;
    document.getElementById("profile-input-name").value = p.name;
    document.getElementById("profile-select-difficulty").value = p.difficulty;
    document.getElementById("profile-input-goals").value = p.studyGoals || "";
    modal.classList.add("active");
  }

  saveProfileFromForm() {
    const name = document.getElementById("profile-input-name").value.trim() || "Student";
    const diff = document.getElementById("profile-select-difficulty").value;
    const goals = document.getElementById("profile-input-goals").value.trim();

    this.state.profile.name = name;
    this.state.profile.difficulty = diff;
    this.state.profile.studyGoals = goals;
    StateManager.saveState(this.state);

    // Sync profile to cloud
    this.firebaseService.syncUserProfile({
      uid: this.firebaseService.currentUser?.uid || "usr_student",
      name,
      difficulty: diff,
      role: this.state.profile.role
    });

    this.updateHeaderUI();
    this.closeModal("profile-modal");
    this.showToast("Profile updated & synced to Cloud Database!", "success");
    this.soundManager.playSuccess();
  }

  openSettingsModal() {
    const modal = document.getElementById("settings-modal");
    if (!modal) return;
    const s = this.state.settings;
    document.getElementById("settings-gemini-key").value = s.geminiApiKey || "";
    document.getElementById("settings-gemini-model").value = s.geminiModel || "gemini-1.5-flash";
    document.getElementById("settings-live-api-toggle").checked = s.useLiveApi || false;

    // Firebase Config inputs
    const fb = this.firebaseService.config || {};
    const fbKeyInput = document.getElementById("settings-firebase-key");
    const fbProjInput = document.getElementById("settings-firebase-project");
    const fbDomainInput = document.getElementById("settings-firebase-domain");
    const fbAppIdInput = document.getElementById("settings-firebase-appid");

    if (fbKeyInput) fbKeyInput.value = fb.apiKey || "";
    if (fbProjInput) fbProjInput.value = fb.projectId || "ai-tutor-class8";
    if (fbDomainInput) fbDomainInput.value = fb.authDomain || "";
    if (fbAppIdInput) fbAppIdInput.value = fb.appId || "";

    const outputEl = document.getElementById("settings-firebase-test-output");
    if (outputEl) outputEl.style.display = "none";

    modal.classList.add("active");
  }

  saveSettingsFromForm() {
    const key = document.getElementById("settings-gemini-key").value.trim();
    const model = document.getElementById("settings-gemini-model").value;
    const useLive = document.getElementById("settings-live-api-toggle").checked;

    // Firebase settings
    const fbKey = document.getElementById("settings-firebase-key")?.value.trim();
    const fbProj = document.getElementById("settings-firebase-project")?.value.trim();
    const fbDomain = document.getElementById("settings-firebase-domain")?.value.trim();
    const fbAppId = document.getElementById("settings-firebase-appid")?.value.trim();

    if (fbProj) {
      this.firebaseService.saveFirebaseConfig({
        apiKey: fbKey || "",
        authDomain: fbDomain || `${fbProj}.firebaseapp.com`,
        projectId: fbProj,
        storageBucket: `${fbProj}.appspot.com`,
        appId: fbAppId || ""
      });
    }

    this.state.settings.geminiApiKey = key;
    this.state.settings.geminiModel = model;
    this.state.settings.useLiveApi = useLive && key.length > 0;
    this.aiEngine.setApiKey(key, this.state.settings.useLiveApi);
    this.aiEngine.setModel(model);

    StateManager.saveState(this.state);
    this.closeModal("settings-modal");
    this.showToast("Cloud Database & AI settings saved successfully!", "success");
    this.soundManager.playSuccess();
  }

  // --- Learn View ---
  setupLearnView() {
    this.renderCurriculumSidebar();
    this.renderCurrentLesson();
  }

  renderCurriculumSidebar() {
    const topicNavContainer = document.getElementById("curriculum-topic-list");
    if (!topicNavContainer) return;

    topicNavContainer.innerHTML = CURRICULUM.map((topic) => {
      const isTopicActive = topic.id === this.activeTopic.id;
      return `
        <div class="topic-group ${isTopicActive ? 'active' : ''}">
          <div class="topic-group-header" data-topic-id="${topic.id}">
            <span class="topic-icon">${topic.icon}</span>
            <span class="topic-title">${topic.title}</span>
          </div>
          <div class="subtopic-list">
            ${topic.subtopics.map((sub) => {
              const isSubActive = isTopicActive && sub.id === this.activeSubtopic.id;
              return `
                <button class="subtopic-btn ${isSubActive ? 'active' : ''}" data-topic-id="${topic.id}" data-subtopic-id="${sub.id}">
                  ${sub.title}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");

    topicNavContainer.querySelectorAll(".subtopic-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const topicId = e.currentTarget.getAttribute("data-topic-id");
        const subtopicId = e.currentTarget.getAttribute("data-subtopic-id");
        this.selectTopicAndSubtopic(topicId, subtopicId);
        this.soundManager.playClick();
      });
    });
  }

  selectTopicAndSubtopic(topicId, subtopicId) {
    const foundTopic = CURRICULUM.find((t) => t.id === topicId);
    if (!foundTopic) return;
    this.activeTopic = foundTopic;

    const foundSub = foundTopic.subtopics.find((s) => s.id === subtopicId) || foundTopic.subtopics[0];
    this.activeSubtopic = foundSub;

    this.renderCurriculumSidebar();
    this.renderCurrentLesson();
    this.renderMathJaxOrKaTeX();
  }

  renderCurrentLesson() {
    const container = document.getElementById("lesson-content-container");
    if (!container || !this.activeSubtopic) return;

    const sub = this.activeSubtopic;
    const isLinearIntro = sub.id === "intro_to_equations" || sub.id === "solving_single_step";

    container.innerHTML = `
      <div class="lesson-header-card">
        <div class="lesson-meta">
          <span class="lesson-badge">${this.activeTopic.badge}</span>
          <span class="lesson-grade">Class 8 Mathematics</span>
        </div>
        <h2 class="lesson-heading">${sub.title}</h2>
        <p class="lesson-summary">${sub.summary}</p>
      </div>

      <!-- Interactive Balance Scale Widget Embed -->
      ${isLinearIntro ? `
        <div id="scale-interactive-container" class="scale-embed-slot"></div>
      ` : ''}

      <div class="lesson-body-markdown card-glass">
        ${this.formatMarkdownToHtml(sub.content)}
      </div>

      ${sub.example ? `
        <div class="worked-example-card card-glass">
          <div class="example-tag">📘 Worked Example</div>
          <h4 class="example-problem">${sub.example.problem}</h4>
          <div class="example-steps">
            ${sub.example.steps ? sub.example.steps.map(s => `<div class="step-item">${this.formatMarkdownToHtml(s)}</div>`).join("") : `<div class="step-item">${sub.example.solution}</div>`}
          </div>
        </div>
      ` : ''}

      ${sub.quickCheck ? `
        <div class="quick-check-card card-glass" id="quick-check-block">
          <div class="quick-check-tag">⚡ Check Your Understanding</div>
          <p class="quick-check-q">${sub.quickCheck.question}</p>
          <div class="quick-check-options">
            ${sub.quickCheck.options.map((opt, oIdx) => `
              <button class="qc-option-btn" data-opt-idx="${oIdx}">${opt}</button>
            `).join("")}
          </div>
          <div class="qc-feedback" id="qc-feedback" style="display: none;"></div>
        </div>
      ` : ''}

      <div class="lesson-footer-actions">
        <button class="btn btn-primary" id="btn-practice-this-lesson">
          ✍️ Practice Problems on this Topic (+15 XP)
        </button>
        <button class="btn btn-secondary" id="btn-ask-tutor-lesson">
          ❓ Ask Arya a Doubt About This
        </button>
      </div>
    `;

    if (isLinearIntro) {
      setTimeout(() => {
        this.balanceScale = new BalanceScaleWidget("scale-interactive-container");
        this.balanceScale.init();
      }, 50);
    }

    if (sub.quickCheck) {
      const qcButtons = container.querySelectorAll(".qc-option-btn");
      const qcFeedback = document.getElementById("qc-feedback");

      qcButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const chosenIdx = parseInt(e.currentTarget.getAttribute("data-opt-idx"), 10);
          qcButtons.forEach((b) => b.classList.remove("selected", "correct", "wrong"));

          if (chosenIdx === sub.quickCheck.correctIndex) {
            e.currentTarget.classList.add("correct");
            qcFeedback.className = "qc-feedback feedback-correct";
            qcFeedback.innerHTML = `🎉 <strong>Correct!</strong> ${sub.quickCheck.explanation}`;
            this.soundManager.playSuccess();
            this.state.gamification.xp += 10;
            StateManager.saveState(this.state);
            this.updateHeaderUI();
          } else {
            e.currentTarget.classList.add("wrong");
            qcFeedback.className = "qc-feedback feedback-wrong";
            qcFeedback.innerHTML = `🤔 <strong>Not quite.</strong> ${sub.quickCheck.explanation}`;
            this.soundManager.playEncouragement();
          }
          qcFeedback.style.display = "block";
          this.renderMathJaxOrKaTeX();
        });
      });
    }

    container.querySelector("#btn-practice-this-lesson")?.addEventListener("click", () => {
      this.soundManager.playClick();
      this.switchView("practice");
    });

    container.querySelector("#btn-ask-tutor-lesson")?.addEventListener("click", () => {
      this.soundManager.playClick();
      this.switchView("chat");
      this.sendUserChatMessage(`Can you give me an everyday example of ${sub.title}?`);
    });

    this.renderMathJaxOrKaTeX();
  }

  // --- Practice View ---
  setupPracticeView() {
    const diffSelect = document.getElementById("practice-difficulty-select");
    const topicSelect = document.getElementById("practice-topic-select");
    const nextBtn = document.getElementById("practice-next-btn");
    const submitBtn = document.getElementById("practice-submit-btn");
    const hintBtn = document.getElementById("practice-hint-btn");
    const whiteboardToggleBtn = document.getElementById("practice-whiteboard-toggle");

    if (diffSelect) {
      diffSelect.value = this.state.profile.difficulty;
      diffSelect.addEventListener("change", (e) => {
        this.state.profile.difficulty = e.target.value;
        StateManager.saveState(this.state);
        this.nextPracticeProblem();
      });
    }

    if (topicSelect) {
      topicSelect.addEventListener("change", () => {
        this.nextPracticeProblem();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.nextPracticeProblem();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.evaluatePracticeAnswer();
      });
    }

    const inputField = document.getElementById("practice-answer-input");
    if (inputField) {
      inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.evaluatePracticeAnswer();
        }
      });
    }

    if (hintBtn) {
      hintBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.revealPracticeHint();
      });
    }

    if (whiteboardToggleBtn) {
      whiteboardToggleBtn.addEventListener("click", () => {
        this.toggleWhiteboard();
      });
    }

    this.setupWhiteboardTools();
  }

  setupWhiteboardTools() {
    const clearBtn = document.getElementById("wb-tool-clear");
    const eraserBtn = document.getElementById("wb-tool-eraser");
    const colorPickers = document.querySelectorAll(".wb-color-dot");

    if (clearBtn) clearBtn.addEventListener("click", () => this.whiteboard?.clear());
    if (eraserBtn) eraserBtn.addEventListener("click", () => this.whiteboard?.setEraser());

    colorPickers.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const color = e.currentTarget.getAttribute("data-color");
        if (this.whiteboard) this.whiteboard.setColor(color);
      });
    });
  }

  toggleWhiteboard() {
    const wbContainer = document.getElementById("whiteboard-container");
    if (!wbContainer) return;

    if (wbContainer.style.display === "none" || !wbContainer.style.display) {
      wbContainer.style.display = "block";
      if (!this.whiteboard) {
        this.whiteboard = new Whiteboard("practice-canvas");
      }
    } else {
      wbContainer.style.display = "none";
    }
  }

  nextPracticeProblem() {
    const diff = document.getElementById("practice-difficulty-select")?.value || this.state.profile.difficulty;
    const topic = document.getElementById("practice-topic-select")?.value || "linear_eq";

    this.currentPracticeProblem = ProblemGenerator.generate({ topic, difficulty: diff });
    this.practiceHintLevel = 0;

    const problemCard = document.getElementById("practice-problem-card");
    const feedbackBox = document.getElementById("practice-feedback-box");
    const hintBox = document.getElementById("practice-hint-box");
    const answerInput = document.getElementById("practice-answer-input");
    const submitBtn = document.getElementById("practice-submit-btn");

    if (problemCard) {
      problemCard.innerHTML = `
        <div class="problem-meta-badge">${this.currentPracticeProblem.topic} • ${this.currentPracticeProblem.subtopic} • <span class="diff-tag ${diff.toLowerCase()}">${diff}</span></div>
        <div class="problem-question-text">${this.currentPracticeProblem.questionHtml}</div>
      `;
    }

    if (answerInput) {
      answerInput.value = "";
      answerInput.disabled = false;
      answerInput.focus();
    }

    if (feedbackBox) {
      feedbackBox.style.display = "none";
      feedbackBox.innerHTML = "";
    }

    if (hintBox) {
      hintBox.style.display = "none";
      hintBox.innerHTML = "";
    }

    if (submitBtn) submitBtn.disabled = false;

    const hintBtn = document.getElementById("practice-hint-btn");
    if (hintBtn) hintBtn.innerHTML = "💡 Need a Hint? (Level 1)";

    if (this.whiteboard) this.whiteboard.clear();
    this.renderMathJaxOrKaTeX();
  }

  revealPracticeHint() {
    if (!this.currentPracticeProblem) return;

    const hints = this.currentPracticeProblem.hints;
    if (!hints || hints.length === 0) return;

    this.practiceHintLevel = Math.min(this.practiceHintLevel + 1, hints.length);
    const hintBox = document.getElementById("practice-hint-box");
    const hintBtn = document.getElementById("practice-hint-btn");

    if (hintBox) {
      hintBox.style.display = "block";
      hintBox.innerHTML = `
        <div class="hint-header">🎯 Socratic Guidance (Hint ${this.practiceHintLevel} of ${hints.length})</div>
        <div class="hint-content">${this.formatMarkdownToHtml(hints[this.practiceHintLevel - 1])}</div>
      `;
      hintBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (hintBtn) {
      if (this.practiceHintLevel < hints.length) {
        hintBtn.innerHTML = `💡 Next Hint (Level ${this.practiceHintLevel + 1})`;
      } else {
        hintBtn.innerHTML = `💡 Full Solution Revealed`;
      }
    }

    if (!this.state.gamification.unlockedBadges.includes("socratic_mind")) {
      this.unlockBadge("socratic_mind");
    }

    this.renderMathJaxOrKaTeX();
  }

  evaluatePracticeAnswer() {
    if (!this.currentPracticeProblem) return;

    const answerInput = document.getElementById("practice-answer-input");
    const userAns = answerInput ? answerInput.value.trim() : "";

    const evalResult = ProblemGenerator.evaluateAnswer(this.currentPracticeProblem, userAns);

    const feedbackBox = document.getElementById("practice-feedback-box");
    const submitBtn = document.getElementById("practice-submit-btn");

    if (feedbackBox) {
      feedbackBox.style.display = "block";
      feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

      if (evalResult.isCorrect) {
        feedbackBox.className = "feedback-box feedback-box-success";
        feedbackBox.innerHTML = `
          <h4>${evalResult.feedback}</h4>
          <p>${evalResult.encouragement}</p>
          <div class="solution-summary">
            <strong>Target Answer:</strong> ${this.currentPracticeProblem.answer}
          </div>
        `;
        this.soundManager.playSuccess();
        ConfettiCannon.fire(1800);
        if (submitBtn) submitBtn.disabled = true;

        StateManager.recordAttempt(this.state, {
          topic: this.currentPracticeProblem.topic,
          subtopic: this.currentPracticeProblem.subtopic,
          difficulty: this.currentPracticeProblem.difficulty,
          isCorrect: true,
          problemId: this.currentPracticeProblem.id
        });

        // Cloud Firestore sync for correct answer
        this.firebaseService.logAttemptToCloud({
          problemId: this.currentPracticeProblem.id,
          topic: this.currentPracticeProblem.topic,
          subtopic: this.currentPracticeProblem.subtopic,
          difficulty: this.currentPracticeProblem.difficulty,
          question: this.currentPracticeProblem.plainQuestion,
          studentAnswer: userAns,
          targetAnswer: this.currentPracticeProblem.answer,
          isCorrect: true,
          hintsUsed: this.practiceHintLevel
        });

        if (!this.state.gamification.unlockedBadges.includes("first_equation")) {
          this.unlockBadge("first_equation");
        }
      } else {
        feedbackBox.className = "feedback-box feedback-box-warning";
        feedbackBox.innerHTML = `
          <h4>${evalResult.feedback}</h4>
          <p>${evalResult.encouragement}</p>
          <div class="actions-row">
            <button class="btn btn-sm btn-outline" id="btn-try-again">Try Again</button>
            <button class="btn btn-sm btn-outline" id="btn-view-solution">See Full Solution</button>
          </div>
        `;
        this.soundManager.playEncouragement();

        StateManager.recordAttempt(this.state, {
          topic: this.currentPracticeProblem.topic,
          subtopic: this.currentPracticeProblem.subtopic,
          difficulty: this.currentPracticeProblem.difficulty,
          isCorrect: false,
          problemId: this.currentPracticeProblem.id
        });

        // Cloud Firestore sync for incorrect answer
        this.firebaseService.logAttemptToCloud({
          problemId: this.currentPracticeProblem.id,
          topic: this.currentPracticeProblem.topic,
          subtopic: this.currentPracticeProblem.subtopic,
          difficulty: this.currentPracticeProblem.difficulty,
          question: this.currentPracticeProblem.plainQuestion,
          studentAnswer: userAns,
          targetAnswer: this.currentPracticeProblem.answer,
          isCorrect: false,
          hintsUsed: this.practiceHintLevel,
          misconception: evalResult.misconception || "Calculation or transposition error"
        });

        setTimeout(() => {
          document.getElementById("btn-try-again")?.addEventListener("click", () => {
            answerInput.focus();
            feedbackBox.style.display = "none";
          });
          document.getElementById("btn-view-solution")?.addEventListener("click", () => {
            this.revealPracticeHint();
            this.revealPracticeHint();
            this.revealPracticeHint();
          });
        }, 50);
      }
    }

    this.updateHeaderUI();
    this.renderMathJaxOrKaTeX();
  }

  // --- Quiz Arena View ---
  setupQuizView() {
    const startQuizBtn = document.getElementById("quiz-start-btn");
    const nextQuizBtn = document.getElementById("quiz-next-question-btn");
    const retakeQuizBtn = document.getElementById("quiz-retake-btn");

    if (startQuizBtn) {
      startQuizBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.startQuiz();
      });
    }

    if (nextQuizBtn) {
      nextQuizBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.submitQuizAnswerAndNext();
      });
    }

    if (retakeQuizBtn) {
      retakeQuizBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.startQuiz();
      });
    }
  }

  startQuiz() {
    const diff = document.getElementById("quiz-difficulty-select")?.value || this.state.profile.difficulty;
    const questions = [];

    for (let i = 0; i < 5; i++) {
      const q = ProblemGenerator.generate({ topic: "mixed", difficulty: diff });
      const correctVal = q.numericAnswer;
      const optionsSet = new Set([correctVal.toString()]);
      const possibleDistractors = [
        (correctVal + 1).toString(),
        (correctVal - 1).toString(),
        (correctVal + 2).toString(),
        (correctVal - 2).toString(),
        (correctVal + 3).toString(),
        (correctVal - 3).toString(),
        (-correctVal).toString(),
        (correctVal + 5).toString()
      ];
      for (const d of possibleDistractors) {
        if (optionsSet.size < 4 && !optionsSet.has(d)) {
          optionsSet.add(d);
        }
      }

      const shuffled = Array.from(optionsSet).sort(() => Math.random() - 0.5);
      q.mcqOptions = shuffled;
      q.mcqCorrectIdx = shuffled.indexOf(correctVal.toString());
      questions.push(q);
    }

    this.quizState = {
      active: true,
      questions,
      currentIndex: 0,
      userAnswers: [],
      score: 0,
      timerSeconds: 0,
      timerInterval: null
    };

    document.getElementById("quiz-intro-screen").style.display = "none";
    document.getElementById("quiz-results-screen").style.display = "none";
    document.getElementById("quiz-active-screen").style.display = "block";

    if (this.quizState.timerInterval) clearInterval(this.quizState.timerInterval);
    this.quizState.timerInterval = setInterval(() => {
      this.quizState.timerSeconds++;
      const mins = Math.floor(this.quizState.timerSeconds / 60);
      const secs = this.quizState.timerSeconds % 60;
      const timerEl = document.getElementById("quiz-timer-display");
      if (timerEl) timerEl.textContent = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);

    this.renderCurrentQuizQuestion();
  }

  renderCurrentQuizQuestion() {
    const q = this.quizState.questions[this.quizState.currentIndex];
    const total = this.quizState.questions.length;
    const current = this.quizState.currentIndex + 1;

    const progressEl = document.getElementById("quiz-progress-bar");
    if (progressEl) progressEl.style.width = `${((current - 1) / total) * 100}%`;

    const indicatorEl = document.getElementById("quiz-question-indicator");
    if (indicatorEl) indicatorEl.textContent = `Question ${current} of ${total}`;

    const card = document.getElementById("quiz-question-card");
    if (card) {
      card.innerHTML = `
        <div class="problem-meta-badge">${q.topic} • ${q.subtopic}</div>
        <div class="quiz-question-prompt">${q.questionHtml}</div>
        <div class="quiz-options-grid">
          ${q.mcqOptions.map((opt, idx) => `
            <button class="quiz-option-card" data-idx="${idx}">
              <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="option-text">$${opt}$</span>
            </button>
          `).join("")}
        </div>
      `;
    }

    card.querySelectorAll(".quiz-option-card").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.soundManager.playClick();
        card.querySelectorAll(".quiz-option-card").forEach(b => b.classList.remove("selected"));
        e.currentTarget.classList.add("selected");
      });
    });

    this.renderMathJaxOrKaTeX();
  }

  submitQuizAnswerAndNext() {
    const card = document.getElementById("quiz-question-card");
    const selectedBtn = card.querySelector(".quiz-option-card.selected");

    if (!selectedBtn) {
      this.showToast("Please pick an option to continue!", "warning");
      return;
    }

    const selectedIdx = parseInt(selectedBtn.getAttribute("data-idx"), 10);
    const q = this.quizState.questions[this.quizState.currentIndex];
    const isCorrect = selectedIdx === q.mcqCorrectIdx;

    if (isCorrect) this.quizState.score++;
    this.quizState.userAnswers.push({
      question: q,
      selectedIdx,
      isCorrect
    });

    StateManager.recordAttempt(this.state, {
      topic: q.topic,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      isCorrect,
      problemId: q.id
    });

    this.quizState.currentIndex++;
    if (this.quizState.currentIndex < this.quizState.questions.length) {
      this.renderCurrentQuizQuestion();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    if (this.quizState.timerInterval) clearInterval(this.quizState.timerInterval);

    const total = this.quizState.questions.length;
    const score = this.quizState.score;
    const pct = Math.round((score / total) * 100);

    document.getElementById("quiz-active-screen").style.display = "none";
    document.getElementById("quiz-results-screen").style.display = "block";

    document.getElementById("quiz-final-score").textContent = `${score}/${total}`;
    document.getElementById("quiz-final-percentage").textContent = `${pct}% Accuracy`;

    const xpEarned = score * 25 + (pct === 100 ? 50 : 0);
    this.state.gamification.xp += xpEarned;
    StateManager.saveState(this.state);
    this.updateHeaderUI();

    // Cloud Firestore Sync: Log completed Quiz Session
    this.firebaseService.logQuizToCloud({
      score,
      totalQuestions: total,
      accuracy: pct,
      xpEarned,
      durationSeconds: this.quizState.timerSeconds || 0,
      quizAnswers: this.quizState.userAnswers.map(ans => ({
        subtopic: ans.question.subtopic,
        isCorrect: ans.isCorrect
      }))
    });

    // Cloud Firestore Sync: Update student profile progress
    this.firebaseService.syncUserProfile({
      uid: this.firebaseService.currentUser?.uid || "usr_student",
      name: this.state.profile.name,
      xp: this.state.gamification.xp,
      streak: this.state.gamification.streak,
      level: this.state.gamification.level
    });

    document.getElementById("quiz-xp-earned").textContent = `+${xpEarned} XP`;

    if (pct === 100 && !this.state.gamification.unlockedBadges.includes("flawless_quiz")) {
      this.unlockBadge("flawless_quiz");
    }

    if (pct >= 80) {
      this.soundManager.playFanfare();
      ConfettiCannon.fire(3500);
    } else {
      this.soundManager.playSuccess();
    }

    const reviewList = document.getElementById("quiz-review-list");
    if (reviewList) {
      reviewList.innerHTML = this.quizState.userAnswers.map((item, idx) => `
        <div class="review-item card-glass ${item.isCorrect ? 'review-correct' : 'review-wrong'}">
          <div class="review-header">
            <strong>Question ${idx + 1}: ${item.question.subtopic}</strong>
            <span class="review-badge ${item.isCorrect ? 'badge-correct' : 'badge-wrong'}">
              ${item.isCorrect ? '✓ Correct' : '✗ Missed'}
            </span>
          </div>
          <p class="review-q">${item.question.plainQuestion}</p>
          <div class="review-ans-row">
            <div>Your answer: <strong>${item.question.mcqOptions[item.selectedIdx]}</strong></div>
            <div>Correct answer: <strong>${item.question.answer}</strong></div>
          </div>
          ${!item.isCorrect ? `
            <div class="review-tip">
              💡 <em>Tutor Tip:</em> ${item.question.hints[0]}
            </div>
          ` : ''}
        </div>
      `).join("");
    }

    this.renderMathJaxOrKaTeX();
  }

  // --- Socratic AI Chat View ---
  setupChatView() {
    const sendBtn = document.getElementById("chat-send-btn");
    const inputField = document.getElementById("chat-user-input");
    const quickPrompts = document.querySelectorAll(".quick-prompt-chip");
    const voiceBtn = document.getElementById("chat-voice-btn");
    const ttsToggleBtn = document.getElementById("chat-tts-toggle");

    if (sendBtn) sendBtn.addEventListener("click", () => this.submitUserChat());

    if (inputField) {
      inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.submitUserChat();
        }
      });
    }

    quickPrompts.forEach((chip) => {
      chip.addEventListener("click", (e) => {
        const text = e.currentTarget.textContent.trim().replace(/^['"]|['"]$/g, "");
        this.sendUserChatMessage(text);
      });
    });

    if (voiceBtn) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        voiceBtn.addEventListener("click", () => {
          voiceBtn.classList.add("recording");
          this.showToast("Listening... Speak your math question!", "info");
          recognition.start();
        });

        recognition.onresult = (event) => {
          voiceBtn.classList.remove("recording");
          const transcript = event.results[0][0].transcript;
          if (inputField) inputField.value = transcript;
          this.submitUserChat();
        };

        recognition.onerror = () => {
          voiceBtn.classList.remove("recording");
          this.showToast("Microphone error or speech not detected.", "warning");
        };

        recognition.onend = () => voiceBtn.classList.remove("recording");
      } else {
        voiceBtn.style.display = "none";
      }
    }

    if (ttsToggleBtn) {
      ttsToggleBtn.addEventListener("click", () => {
        this.state.settings.speechSynthesis = !this.state.settings.speechSynthesis;
        StateManager.saveState(this.state);
        ttsToggleBtn.classList.toggle("active", this.state.settings.speechSynthesis);
        this.showToast(this.state.settings.speechSynthesis ? "Voice Read-Aloud On" : "Voice Read-Aloud Off");
      });
    }

    const chatMsgs = document.getElementById("chat-messages-container");
    if (chatMsgs && chatMsgs.children.length === 0) {
      this.appendChatMessage("assistant", `Hello **${this.state.profile.name}**! 👋 I'm **Arya**, your AI Math Tutor. 
Ask me anything about Class 8 Algebra—like how to solve an equation, why signs flip during transposition, or for an everyday puzzle!`);
    }
  }

  async submitUserChat() {
    const input = document.getElementById("chat-user-input");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    await this.sendUserChatMessage(text);
  }

  async sendUserChatMessage(text) {
    this.appendChatMessage("user", text);
    this.soundManager.playClick();
    const typingIndicator = this.showTypingIndicator();

    try {
      const responseObj = await this.aiEngine.chat({
        message: text,
        studentProfile: this.state.profile,
        currentProblem: this.currentPracticeProblem
      });

      this.removeTypingIndicator(typingIndicator);
      this.appendChatMessage("assistant", responseObj.response, responseObj.source);

      // Cloud Firestore Sync: Log doubt and Socratic guidance
      this.firebaseService.logDoubtToCloud({
        studentQuery: text,
        aiResponse: responseObj.response,
        source: responseObj.source
      });

      if (this.state.settings.speechSynthesis && 'speechSynthesis' in window) {
        const cleanSpeech = responseObj.response.replace(/[\$\*\#\_]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanSpeech);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      this.removeTypingIndicator(typingIndicator);
      this.appendChatMessage("assistant", "In algebra, whatever you do to one side of the scale, do to the other! Let's conquer this together.");
    }
  }

  appendChatMessage(role, content, source = "") {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message-row ${role === 'user' ? 'row-user' : 'row-assistant'}`;

    const isAssistant = role === "assistant";
    const avatar = isAssistant ? "👩‍🏫" : this.state.profile.avatar;
    const authorName = isAssistant ? "Arya (AI Tutor)" : this.state.profile.name;

    msgDiv.innerHTML = `
      <div class="chat-avatar">${avatar}</div>
      <div class="chat-bubble">
        <div class="bubble-header">
          <span class="bubble-author">${authorName}</span>
          ${source === 'gemini-api' ? '<span class="source-badge">⚡ Gemini 1.5</span>' : ''}
        </div>
        <div class="bubble-content">${this.formatMarkdownToHtml(content)}</div>
      </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    this.renderMathJaxOrKaTeX();
  }

  showTypingIndicator() {
    const container = document.getElementById("chat-messages-container");
    if (!container) return null;

    const ind = document.createElement("div");
    ind.className = "chat-message-row row-assistant typing-row";
    ind.innerHTML = `
      <div class="chat-avatar">👩‍🏫</div>
      <div class="chat-bubble typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    container.appendChild(ind);
    container.scrollTop = container.scrollHeight;
    return ind;
  }

  removeTypingIndicator(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // --- Analytics & Progress View ---
  setupAnalyticsView() {
    this.refreshAnalytics();
  }

  refreshAnalytics() {
    const { strongAreas, needsPractice } = StateManager.getStrengthsAndWeaknesses(this.state);
    const recommendedLesson = StateManager.getRecommendedLesson(this.state);

    const total = this.state.analytics.totalQuestionsAttempted;
    const correct = this.state.analytics.totalQuestionsCorrect;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    document.getElementById("stats-total-attempted").textContent = total;
    document.getElementById("stats-total-correct").textContent = correct;
    document.getElementById("stats-accuracy-pct").textContent = `${pct}%`;

    const strongList = document.getElementById("analytics-strong-areas");
    if (strongList) {
      strongList.innerHTML = strongAreas.map(item => `
        <div class="strength-chip">
          <span class="chip-icon">🌟</span>
          <span class="chip-title">${item.topic}</span>
          <span class="chip-acc">${item.accuracy}% Accuracy</span>
        </div>
      `).join("");
    }

    const weakList = document.getElementById("analytics-needs-practice");
    if (weakList) {
      weakList.innerHTML = needsPractice.map(item => `
        <div class="weakness-chip">
          <span class="chip-icon">🎯</span>
          <span class="chip-title">${item.topic}</span>
          <span class="chip-acc">${item.accuracy}% Accuracy</span>
        </div>
      `).join("");
    }

    const recCard = document.getElementById("analytics-recommendation-card");
    if (recCard) {
      recCard.innerHTML = `
        <div class="rec-badge">🚀 AI Suggested Next Step</div>
        <h3>${recommendedLesson.title}</h3>
        <p>${recommendedLesson.reason}</p>
        <button class="btn btn-primary btn-sm" id="btn-jump-to-rec">Start Lesson Now</button>
      `;

      recCard.querySelector("#btn-jump-to-rec")?.addEventListener("click", () => {
        this.switchView(recommendedLesson.actionMode);
      });
    }

    setTimeout(() => {
      AnalyticsRenderer.renderTopicMasteryChart("analytics-mastery-chart", this.state.analytics.topicStats);
    }, 100);
  }

  // --- Study Plan View ---
  setupStudyPlanView() {
    const roadmapContainer = document.getElementById("study-roadmap-container");
    if (!roadmapContainer) return;

    const plan = AnalyticsRenderer.generateStudyPlan(this.state);
    roadmapContainer.innerHTML = plan.map((item) => `
      <div class="roadmap-card card-glass ${item.status}">
        <div class="roadmap-day-badge">${item.day}</div>
        <div class="roadmap-body">
          <h4>${item.title}</h4>
          <p class="roadmap-act">${item.activity}</p>
          <div class="roadmap-meta">
            <span>🎯 Goal: ${item.goal}</span>
            <span>⏱️ ${item.duration}</span>
          </div>
        </div>
        <div class="roadmap-status">
          ${item.status === 'completed' ? '✓ Completed' : item.status === 'current' ? '▶️ Up Today' : '🔒 Upcoming'}
        </div>
      </div>
    `).join("");
  }

  // --- Notes & PDF Assistant View ---
  setupNotesView() {
    const processBtn = document.getElementById("notes-process-btn");
    const textarea = document.getElementById("notes-text-input");
    const fileInput = document.getElementById("notes-file-upload");

    if (processBtn && textarea) {
      processBtn.addEventListener("click", () => {
        const text = textarea.value.trim();
        if (!text) {
          this.showToast("Please paste or upload some notes first!", "warning");
          return;
        }
        this.processStudentNotes(text);
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          if (textarea) textarea.value = evt.target.result;
          this.showToast(`Loaded ${file.name}! Click 'Analyze Notes'.`, "info");
        };
        reader.readAsText(file);
      });
    }
  }

  processStudentNotes(text) {
    const analysis = NotesProcessor.analyzeNotes(text);
    if (!analysis) return;

    const resultsArea = document.getElementById("notes-analysis-results");
    if (!resultsArea) return;

    resultsArea.style.display = "block";
    resultsArea.innerHTML = `
      <div class="notes-summary-card card-glass">
        <h3>📊 Notes Extraction Summary</h3>
        <p>${analysis.summary}</p>
        <div class="notes-formulas-section">
          <h4>Detected Formulas & Identities:</h4>
          <div class="formula-chips">
            ${analysis.formulas.map(f => `<span class="formula-chip">${f}</span>`).join("")}
          </div>
        </div>
        <div class="notes-custom-questions">
          <h4>✨ Auto-Generated Custom Practice Questions:</h4>
          ${analysis.generatedQuestions.map((q, idx) => `
            <div class="custom-q-item">
              <p><strong>Q${idx + 1}:</strong> ${q.question}</p>
              <div class="custom-q-ans">Answer: <em>${q.answer}</em> (${q.concept})</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    if (!this.state.gamification.unlockedBadges.includes("notes_scholar")) {
      this.unlockBadge("notes_scholar");
    }

    this.soundManager.playSuccess();
    this.renderMathJaxOrKaTeX();
  }

  // --- Teacher / Parent Dashboard ---
  setupTeacherView() {
    document.getElementById("teacher-print-report-btn")?.addEventListener("click", () => {
      window.print();
    });
  }

  refreshTeacherDashboard() {
    const p = this.state.profile;
    const a = this.state.analytics;
    const g = this.state.gamification;

    document.getElementById("teacher-student-name").textContent = p.name;
    document.getElementById("teacher-grade-level").textContent = p.grade;
    document.getElementById("teacher-difficulty").textContent = p.difficulty;
    document.getElementById("teacher-streak").textContent = `${g.streak} Days Active`;
    document.getElementById("teacher-xp").textContent = `${g.xp} Total XP`;

    const total = a.totalQuestionsAttempted;
    const correct = a.totalQuestionsCorrect;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;

    document.getElementById("teacher-total-qs").textContent = total;
    document.getElementById("teacher-accuracy").textContent = `${acc}%`;

    const remarksEl = document.getElementById("teacher-remarks");
    if (remarksEl) {
      if (acc >= 80) {
        remarksEl.textContent = `${p.name} demonstrates exemplary conceptual understanding in Class 8 Linear Equations. Ready to progress to challenge problems!`;
      } else if (acc >= 60) {
        remarksEl.textContent = `${p.name} has a solid grasp of foundational algebraic equations but occasionally makes transposition sign errors. Additional practice on bracket expansions is advised.`;
      } else {
        remarksEl.textContent = `${p.name} is building confidence. Recommend using the Balance Scale visualizer and reviewing single-step equations.`;
      }
    }
  }

  // --- School Admin Portal View ---
  setupAdminPortalView() {
    this.adminPortal.init();
  }

  // --- Badges Modal ---
  setupBadgesModal() {
    const openBadgesBtn = document.getElementById("header-badges-btn");
    const modal = document.getElementById("badges-modal");

    if (openBadgesBtn && modal) {
      openBadgesBtn.addEventListener("click", () => {
        this.soundManager.playClick();
        this.renderBadgesGrid();
        modal.classList.add("active");
      });
    }
  }

  renderBadgesGrid() {
    const grid = document.getElementById("badges-grid-container");
    if (!grid) return;

    const unlocked = this.state.gamification.unlockedBadges;

    grid.innerHTML = BADGES.map((badge) => {
      const isUnlocked = unlocked.includes(badge.id);
      return `
        <div class="badge-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}">
          <div class="badge-icon">${badge.icon}</div>
          <h4 class="badge-name">${badge.name}</h4>
          <p class="badge-desc">${badge.description}</p>
          <div class="badge-status-tag">
            ${isUnlocked ? '✓ Unlocked' : `🔒 +${badge.xpReward} XP`}
          </div>
        </div>
      `;
    }).join("");
  }

  // --- Helpers: Markdown & KaTeX ---
  formatMarkdownToHtml(markdown) {
    if (!markdown) return "";
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>');
    return html;
  }

  renderMathJaxOrKaTeX() {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
    }
  }

  showToast(message, type = "info") {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      document.body.appendChild(toast);
    }
    toast.className = `app-toast toast-${type} active`;
    toast.textContent = message;

    setTimeout(() => {
      toast.classList.remove("active");
    }, 3200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.aiTutorApp = new App();
});
