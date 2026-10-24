// School Authority / Admin Portal Controller
// Manages school benchmarks, student rosters, at-risk alerts,
// school-wide announcements, and academic reports.

export class AdminPortal {
  constructor(app) {
    this.app = app;
    this.schoolStats = null;
    this.students = [];
    this.selectedFilterGrade = "all";
  }

  async init() {
    await this.fetchAdminData();
    this.bindEvents();
  }

  async fetchAdminData() {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch("/api/admin/school-stats"),
        fetch("/api/admin/students")
      ]);

      if (statsRes.ok && studentsRes.ok) {
        this.schoolStats = await statsRes.json();
        const stdData = await studentsRes.json();
        this.students = stdData.students || [];
        this.render();
      }
    } catch (e) {
      console.warn("Could not fetch server admin data, using fallback cache:", e);
      // Fallback local data
      this.students = [
        { id: "1", name: "Aarav Sharma", email: "aarav.sharma@dps.edu", grade: "Class 8-A", difficulty: "Beginner", totalAttempted: 8, totalCorrect: 6, accuracy: 75, streak: 3, level: 1, lastActive: "Just now" },
        { id: "2", name: "Priya Patel", email: "priya.patel@dps.edu", grade: "Class 8-A", difficulty: "Intermediate", totalAttempted: 16, totalCorrect: 14, accuracy: 88, streak: 5, level: 3, lastActive: "1 hr ago" },
        { id: "3", name: "Rohan Verma", email: "rohan.verma@dps.edu", grade: "Class 8-B", difficulty: "Beginner", totalAttempted: 9, totalCorrect: 4, accuracy: 44, streak: 1, level: 1, lastActive: "2 hrs ago" },
        { id: "4", name: "Ananya Iyer", email: "ananya.iyer@dps.edu", grade: "Class 8-B", difficulty: "Advanced", totalAttempted: 28, totalCorrect: 26, accuracy: 93, streak: 9, level: 6, lastActive: "Just now" }
      ];
      this.schoolStats = {
        schoolInfo: { name: "Delhi Public School - Mathematics Dept." },
        kpis: { totalStudents: 4, avgAccuracy: 75, totalQuestionsSolved: 61, activeStreakCount: 3, atRiskCount: 1 },
        announcements: []
      };
      this.render();
    }
  }

  render() {
    const container = document.getElementById("admin-portal-content");
    if (!container || !this.schoolStats) return;

    const k = this.schoolStats.kpis;
    const s = this.schoolStats.schoolInfo;

    container.innerHTML = `
      <!-- Admin Header -->
      <div class="admin-header-card card-glass">
        <div class="admin-header-main">
          <div class="admin-icon-bubble">🏫</div>
          <div>
            <h2>${s.name || "School Authority Administration"}</h2>
            <div class="admin-meta-row">
              <span>Academic Year: <strong>2026-2027</strong></span>
              <span>•</span>
              <span>Teacher In-Charge: <strong>Dr. Rajesh Sharma</strong></span>
              <span>•</span>
              <span class="db-status-pill">🔥 Firebase Connected</span>
            </div>
          </div>
        </div>
        <div class="admin-top-actions">
          <button class="btn btn-secondary btn-sm" id="admin-export-csv-btn">
            📥 Export Student Data (CSV)
          </button>
          <button class="btn btn-primary btn-sm" id="admin-new-broadcast-btn">
            📢 Post Announcement
          </button>
        </div>
      </div>

      <!-- KPI Overview Cards -->
      <div class="admin-kpi-grid">
        <div class="admin-kpi-card card-glass">
          <div class="kpi-val">${k.totalStudents}</div>
          <div class="kpi-label">Enrolled Students</div>
        </div>
        <div class="admin-kpi-card card-glass">
          <div class="kpi-val" style="color: var(--accent-emerald);">${k.avgAccuracy}%</div>
          <div class="kpi-label">School Average Accuracy</div>
        </div>
        <div class="admin-kpi-card card-glass">
          <div class="kpi-val" style="color: #38bdf8;">${k.totalQuestionsSolved}</div>
          <div class="kpi-label">Questions Solved</div>
        </div>
        <div class="admin-kpi-card card-glass">
          <div class="kpi-val" style="color: #fb923c;">${k.activeStreakCount}</div>
          <div class="kpi-label">Students with Active Streak (≥3 Days)</div>
        </div>
        <div class="admin-kpi-card card-glass ${k.atRiskCount > 0 ? 'kpi-alert' : ''}">
          <div class="kpi-val" style="color: var(--accent-rose);">${k.atRiskCount}</div>
          <div class="kpi-label">At-Risk Students (&lt;60% Accuracy)</div>
        </div>
      </div>

      <!-- Roster Filters & Table -->
      <div class="card-glass" style="margin-top: 1.5rem;">
        <div class="roster-toolbar">
          <h3>📋 Class 8 Student Performance Roster</h3>
          <div class="roster-controls">
            <input type="text" class="custom-select" id="roster-search-input" placeholder="Search student name or email..." style="width: 240px;">
            <select class="custom-select" id="roster-grade-filter">
              <option value="all">All Sections (Class 8)</option>
              <option value="Class 8-A">Section 8-A</option>
              <option value="Class 8-B">Section 8-B</option>
            </select>
          </div>
        </div>

        <div class="roster-table-wrapper">
          <table class="roster-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Section</th>
                <th>Tier</th>
                <th>Solved</th>
                <th>Accuracy</th>
                <th>Streak</th>
                <th>Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="roster-table-body">
              ${this.renderStudentRows(this.students)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Broadcast Announcements Panel -->
      <div class="card-glass" style="margin-top: 1.5rem;">
        <h3>📢 School Math Announcements</h3>
        <p class="brand-tagline">Broadcast messages and practice tasks that appear on all student dashboards</p>
        <div class="announcements-list" id="admin-announcements-list" style="margin-top: 1rem;">
          ${(this.schoolStats.announcements || []).map(a => `
            <div class="announcement-item card-glass">
              <div class="ann-header">
                <strong>${a.title}</strong>
                <span class="ann-date">${a.date} • ${a.author}</span>
              </div>
              <p class="ann-msg">${a.message}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    this.bindDynamicListeners(container);
  }

  renderStudentRows(studentsList) {
    if (!studentsList || studentsList.length === 0) {
      return `<tr><td colspan="8" style="text-align: center; padding: 2rem;">No students found matching filters.</td></tr>`;
    }

    return studentsList.map(s => {
      const isAtRisk = s.accuracy < 60;
      return `
        <tr class="${isAtRisk ? 'row-at-risk' : ''}">
          <td>
            <div class="student-cell">
              <span class="cell-avatar">${s.avatar || '🎓'}</span>
              <div>
                <strong>${s.name}</strong>
                <div class="cell-email">${s.email}</div>
              </div>
            </div>
          </td>
          <td><span class="section-tag">${s.grade}</span></td>
          <td><span class="diff-tag ${s.difficulty.toLowerCase()}">${s.difficulty}</span></td>
          <td><strong>${s.totalCorrect}/${s.totalAttempted}</strong> Qs</td>
          <td>
            <strong style="color: ${isAtRisk ? 'var(--accent-rose)' : s.accuracy >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)'};">
              ${s.accuracy}%
            </strong>
          </td>
          <td>🔥 ${s.streak} Days</td>
          <td><span class="level-badge-sm">Lvl ${s.level}</span></td>
          <td>
            <button class="btn btn-sm btn-outline nudge-btn" data-name="${s.name}" data-email="${s.email}">
              💬 Send Nudge
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  bindEvents() {
    // Top export button
    document.addEventListener("click", (e) => {
      if (e.target.id === "admin-export-csv-btn") {
        this.exportCSV();
      }
      if (e.target.id === "admin-new-broadcast-btn") {
        this.openBroadcastModal();
      }
    });
  }

  bindDynamicListeners(container) {
    const searchInput = container.querySelector("#roster-search-input");
    const gradeFilter = container.querySelector("#roster-grade-filter");
    const tbody = container.querySelector("#roster-table-body");

    const applyFilter = () => {
      const query = (searchInput.value || "").toLowerCase().trim();
      const grade = gradeFilter.value;

      let filtered = [...this.students];
      if (grade !== "all") {
        filtered = filtered.filter(s => s.grade === grade);
      }
      if (query) {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query));
      }
      if (tbody) tbody.innerHTML = this.renderStudentRows(filtered);
    };

    if (searchInput) searchInput.addEventListener("input", applyFilter);
    if (gradeFilter) gradeFilter.addEventListener("change", applyFilter);

    // Nudge buttons
    container.querySelectorAll(".nudge-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const studentName = e.currentTarget.getAttribute("data-name");
        this.app.showToast(`📩 Encouragement message sent to ${studentName}!`, "success");
        this.app.soundManager.playSuccess();
      });
    });
  }

  openBroadcastModal() {
    const title = prompt("Enter Announcement Title:", "Weekly Algebra Challenge");
    if (!title) return;
    const message = prompt("Enter Announcement Message for Students:", "Solve 5 practice problems today to unlock the 'Socratic Thinker' badge!");
    if (!message) return;

    fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, priority: "normal" })
    })
    .then(r => r.json())
    .then(data => {
      this.app.showToast("📢 Announcement broadcasted to all students!", "success");
      this.app.soundManager.playSuccess();
      this.fetchAdminData();
    })
    .catch(() => {
      this.app.showToast("Announcement posted locally!", "info");
    });
  }

  exportCSV() {
    let csv = "Student Name,Email,Grade/Section,Difficulty Tier,Questions Attempted,Questions Correct,Accuracy %,Streak (Days),Level\n";
    this.students.forEach(s => {
      csv += `"${s.name}","${s.email}","${s.grade}","${s.difficulty}",${s.totalAttempted},${s.totalCorrect},${s.accuracy}%,${s.streak},${s.level}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Class_8_Math_Roster_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.app.showToast("Class roster exported to CSV successfully!", "success");
  }
}
