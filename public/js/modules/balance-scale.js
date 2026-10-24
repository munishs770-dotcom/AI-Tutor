// Interactive Visual Balance Scale for Linear Equations
// Allows students to visually experiment with equations like 2x + 4 = 10
// Demonstrates that adding/removing equal weights from both pans maintains balance.

export class BalanceScaleWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      targetX: 3, // secret or known value of x
      leftXCount: 2,
      leftUnits: 4,
      rightXCount: 0,
      rightUnits: 10
    };
  }

  init(initialEquation = { leftX: 2, leftUnits: 4, rightX: 0, rightUnits: 10, xVal: 3 }) {
    this.state.leftXCount = initialEquation.leftX;
    this.state.leftUnits = initialEquation.leftUnits;
    this.state.rightXCount = initialEquation.rightX;
    this.state.rightUnits = initialEquation.rightUnits;
    this.state.targetX = initialEquation.xVal;
    this.render();
  }

  // Calculate total weight on both sides
  getWeights() {
    const leftWeight = this.state.leftXCount * this.state.targetX + this.state.leftUnits;
    const rightWeight = this.state.rightXCount * this.state.targetX + this.state.rightUnits;
    return { leftWeight, rightWeight };
  }

  render() {
    if (!this.container) return;

    const { leftWeight, rightWeight } = this.getWeights();
    const diff = leftWeight - rightWeight;
    // Angle of tilt: max +/- 14 degrees
    const tiltAngle = Math.max(-14, Math.min(14, diff * 2.5));

    const isBalanced = leftWeight === rightWeight;

    this.container.innerHTML = `
      <div class="scale-widget-card">
        <div class="scale-header">
          <div class="scale-title">
            <span class="scale-icon">⚖️</span>
            <h4>Interactive Equation Balance Scale</h4>
          </div>
          <div class="scale-status ${isBalanced ? 'status-balanced' : 'status-unbalanced'}">
            ${isBalanced ? '✓ Perfectly Balanced! (LHS = RHS)' : diff > 0 ? '⚠️ Left Pan is Heavier' : '⚠️ Right Pan is Heavier'}
          </div>
        </div>

        <div class="scale-equation-display">
          <div class="side-equation">
            <strong>Left Pan (LHS):</strong>
            <span class="eq-badge">${this.state.leftXCount > 0 ? `${this.state.leftXCount}x` : ''} ${this.state.leftUnits > 0 ? `+ ${this.state.leftUnits}` : ''} = <em>${leftWeight} kg</em></span>
          </div>
          <div class="equal-symbol">${isBalanced ? '=' : '≠'}</div>
          <div class="side-equation">
            <strong>Right Pan (RHS):</strong>
            <span class="eq-badge">${this.state.rightXCount > 0 ? `${this.state.rightXCount}x` : ''} ${this.state.rightUnits > 0 ? `${this.state.rightUnits}` : '0'} = <em>${rightWeight} kg</em></span>
          </div>
        </div>

        <!-- SVG Scale Diagram -->
        <div class="scale-svg-wrapper">
          <svg viewBox="0 0 500 240" class="scale-svg">
            <!-- Base Stand -->
            <path d="M 230 230 L 270 230 L 255 110 L 245 110 Z" fill="#64748b" />
            <circle cx="250" cy="230" r="14" fill="#475569" />
            <circle cx="250" cy="110" r="8" fill="#3b82f6" />

            <!-- Rotating Beam Group -->
            <g transform="rotate(${tiltAngle}, 250, 110)" style="transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
              <!-- Main Beam -->
              <rect x="70" y="106" width="360" height="8" rx="4" fill="#334155" />
              <!-- Left Pivot Point -->
              <circle cx="100" cy="110" r="5" fill="#f59e0b" />
              <!-- Right Pivot Point -->
              <circle cx="400" cy="110" r="5" fill="#f59e0b" />

              <!-- Left Pan Strings & Tray -->
              <line x1="100" y1="110" x2="60" y2="180" stroke="#94a3b8" stroke-width="2" />
              <line x1="100" y1="110" x2="140" y2="180" stroke="#94a3b8" stroke-width="2" />
              <rect x="50" y="180" width="100" height="8" rx="3" fill="#6366f1" />

              <!-- Right Pan Strings & Tray -->
              <line x1="400" y1="110" x2="360" y2="180" stroke="#94a3b8" stroke-width="2" />
              <line x1="400" y1="110" x2="440" y2="180" stroke="#94a3b8" stroke-width="2" />
              <rect x="350" y="180" width="100" height="8" rx="3" fill="#10b981" />

              <!-- Left Pan Items (drawn above tray) -->
              <g transform="translate(60, 140)">
                ${this.renderPanItems(this.state.leftXCount, this.state.leftUnits, "#6366f1")}
              </g>

              <!-- Right Pan Items -->
              <g transform="translate(360, 140)">
                ${this.renderPanItems(this.state.rightXCount, this.state.rightUnits, "#10b981")}
              </g>
            </g>
          </svg>
        </div>

        <!-- Scale Controls: Add / Subtract from both sides -->
        <div class="scale-controls">
          <div class="scale-control-group">
            <span class="control-label">Left Pan Operations:</span>
            <button class="btn-sm btn-outline scale-op-btn" data-action="sub-left-unit">- 1 Unit</button>
            <button class="btn-sm btn-outline scale-op-btn" data-action="add-left-unit">+ 1 Unit</button>
            <button class="btn-sm btn-outline scale-op-btn" data-action="sub-left-x">- 1 Box (x)</button>
            <button class="btn-sm btn-outline scale-op-btn" data-action="add-left-x">+ 1 Box (x)</button>
          </div>
          <div class="scale-control-group">
            <span class="control-label">Right Pan Operations:</span>
            <button class="btn-sm btn-outline scale-op-btn" data-action="sub-right-unit">- 1 Unit</button>
            <button class="btn-sm btn-outline scale-op-btn" data-action="add-right-unit">+ 1 Unit</button>
            <button class="btn-sm btn-outline scale-op-btn" data-action="sub-right-x">- 1 Box (x)</button>
            <button class="btn-sm btn-outline scale-op-btn" data-action="add-right-x">+ 1 Box (x)</button>
          </div>
        </div>

        <div class="scale-tip">
          💡 <strong>Golden Algebra Law:</strong> When you subtract $4$ units from the left pan, subtract $4$ units from the right pan too! Watch how the scale remains balanced.
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderPanItems(xCount, unitCount, color) {
    let svgItems = "";
    let curX = 0;

    // Render mystery boxes (x)
    for (let i = 0; i < Math.min(xCount, 4); i++) {
      svgItems += `
        <g transform="translate(${curX}, 10)">
          <rect width="20" height="24" rx="3" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
          <text x="10" y="17" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">x</text>
        </g>
      `;
      curX += 22;
    }

    // Render marble units
    curX = 0;
    for (let j = 0; j < Math.min(unitCount, 12); j++) {
      const row = Math.floor(j / 5);
      const col = j % 5;
      svgItems += `
        <circle cx="${col * 14 + 10}" cy="${row * 12 - 5}" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />
      `;
    }

    return svgItems;
  }

  attachEventListeners() {
    const buttons = this.container.querySelectorAll(".scale-op-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.getAttribute("data-action");
        if (action === "sub-left-unit" && this.state.leftUnits > 0) this.state.leftUnits--;
        if (action === "add-left-unit") this.state.leftUnits++;
        if (action === "sub-left-x" && this.state.leftXCount > 0) this.state.leftXCount--;
        if (action === "add-left-x") this.state.leftXCount++;

        if (action === "sub-right-unit" && this.state.rightUnits > 0) this.state.rightUnits--;
        if (action === "add-right-unit") this.state.rightUnits++;
        if (action === "sub-right-x" && this.state.rightXCount > 0) this.state.rightXCount--;
        if (action === "add-right-x") this.state.rightXCount++;

        this.render();
      });
    });
  }
}
