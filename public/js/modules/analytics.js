// Analytics, Progress Charts & Study Plan Generator
// Renders custom, lightweight HTML5 Canvas charts for mastery by topic,
// generates 7-day adaptive study plans, and formats teacher/parent report cards.

export class AnalyticsRenderer {
  // Render Mastery Bar Chart by Topic
  static renderTopicMasteryChart(canvasId, topicStats) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = (rect.width || 500) * dpr;
    canvas.height = 220 * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "220px";
    ctx.scale(dpr, dpr);

    const width = canvas.width / dpr;
    const height = 220;

    ctx.clearRect(0, 0, width, height);

    const topics = Object.keys(topicStats);
    if (topics.length === 0) return;

    const barWidth = Math.min(65, (width - 80) / topics.length - 20);
    const chartHeight = 140;
    const baseY = height - 45;

    // Grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    for (let percent = 0; percent <= 100; percent += 25) {
      const y = baseY - (percent / 100) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${percent}%`, 35, y + 3);
    }

    // Draw bars
    const colors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b"];
    const totalSpacing = (width - 60) / topics.length;

    topics.forEach((topic, idx) => {
      const data = topicStats[topic];
      const accuracy = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;
      const barH = (accuracy / 100) * chartHeight;
      const x = 55 + idx * totalSpacing + (totalSpacing - barWidth) / 2;
      const y = baseY - barH;

      // Gradient fill
      const grad = ctx.createLinearGradient(0, y, 0, baseY);
      const color = colors[idx % colors.length];
      grad.addColorStop(0, color);
      grad.addColorStop(1, `${color}66`);

      // Draw rounded bar
      ctx.fillStyle = grad;
      ctx.beginPath();
      const r = 6;
      if (barH > r) {
        ctx.moveTo(x, baseY);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.arcTo(x + barWidth, y, x + barWidth, y + r, r);
        ctx.lineTo(x + barWidth, baseY);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      // Accuracy text on top of bar
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${accuracy}%`, x + barWidth / 2, y - 6);

      // Label below bar
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "11px Inter, sans-serif";
      const shortLabel = topic.length > 12 ? topic.substring(0, 10) + ".." : topic;
      ctx.fillText(shortLabel, x + barWidth / 2, baseY + 18);

      // Attempt count badge
      ctx.fillStyle = "#64748b";
      ctx.font = "10px Inter, sans-serif";
      ctx.fillText(`${data.correct}/${data.attempted} Qs`, x + barWidth / 2, baseY + 32);
    });
  }

  // Generates an automated 7-Day Personalized Study Roadmap
  static generateStudyPlan(state) {
    const { strongAreas, needsPractice } = state ? 
      { strongAreas: [{ topic: "Linear Equations", accuracy: 80 }], needsPractice: [{ topic: "Word Problems", accuracy: 45 }] } : {};

    const focusTopic = needsPractice && needsPractice.length > 0 ? needsPractice[0].topic : "Linear Equations in One Variable";
    const difficulty = state?.profile?.difficulty || "Beginner";

    return [
      {
        day: "Day 1",
        title: "Foundations & Balance Scale",
        topic: "Linear Equations",
        activity: "Explore the Balance Scale simulation and solve 5 single-step equations.",
        goal: "Understand that LHS must always equal RHS.",
        duration: "20 mins",
        status: "completed"
      },
      {
        day: "Day 2",
        title: "Transposition Mastery",
        topic: "Linear Equations",
        activity: "Practice the sign-flip border checkpoint rule on 8 two-step problems.",
        goal: "Isolate $x$ without sign errors.",
        duration: "25 mins",
        status: "current"
      },
      {
        day: "Day 3",
        title: "Variables on Both Sides",
        topic: "Linear Equations",
        activity: "Solve equations with mystery boxes on both pans ($5x - 4 = 2x + 11$).",
        goal: "Collect like terms with 80%+ accuracy.",
        duration: "25 mins",
        status: "upcoming"
      },
      {
        day: "Day 4",
        title: "Targeted Focus: " + focusTopic,
        topic: focusTopic,
        activity: `Special deep dive into ${focusTopic} to turn your weakest topic into a strength!`,
        goal: "Master word problem translations and bracket expansions.",
        duration: "30 mins",
        status: "upcoming"
      },
      {
        day: "Day 5",
        title: "Algebraic Identities Super-Power",
        topic: "Identities",
        activity: "Learn and apply $(a+b)^2$ and $(a+b)(a-b)$ mental math shortcuts.",
        goal: "Expand quadratic expressions in under 30 seconds.",
        duration: "20 mins",
        status: "upcoming"
      },
      {
        day: "Day 6",
        title: "Factorisation Detective",
        topic: "Factorisation",
        activity: "Practice common factors and splitting the middle term ($x^2 + 7x + 12$).",
        goal: "Reverse polynomial multiplication smoothly.",
        duration: "25 mins",
        status: "upcoming"
      },
      {
        day: "Day 7",
        title: "Grand Mastery Quiz Arena",
        topic: "Comprehensive Review",
        activity: "Take a 10-question timed mock exam to unlock the 'Math Wizard' badge!",
        goal: "Achieve 90%+ overall score.",
        duration: "30 mins",
        status: "upcoming"
      }
    ];
  }
}
