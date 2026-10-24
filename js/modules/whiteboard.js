// Interactive Math Scratchpad / Whiteboard
// Gives students an on-screen drawing surface to work out algebra steps,
// transpose terms, and calculate scratch work with pen, eraser, and clear tools.

export class Whiteboard {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.isDrawing = false;
    this.color = "#38bdf8"; // vibrant cyan default
    this.lineWidth = 3;
    this.isEraser = false;
    this.lastX = 0;
    this.lastY = 0;

    this.initCanvasSize();
    this.bindEvents();
  }

  initCanvasSize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 240;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  }

  bindEvents() {
    if (!this.canvas) return;

    const startDraw = (e) => {
      this.isDrawing = true;
      const pos = this.getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
    };

    const draw = (e) => {
      if (!this.isDrawing) return;
      const pos = this.getPos(e);

      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(pos.x, pos.y);

      if (this.isEraser) {
        this.ctx.strokeStyle = "#0f172a"; // dark background erase
        this.ctx.lineWidth = 18;
      } else {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
      }

      this.ctx.stroke();
      this.lastX = pos.x;
      this.lastY = pos.y;
    };

    const stopDraw = () => {
      this.isDrawing = false;
    };

    // Mouse events
    this.canvas.addEventListener("mousedown", startDraw);
    this.canvas.addEventListener("mousemove", draw);
    this.canvas.addEventListener("mouseup", stopDraw);
    this.canvas.addEventListener("mouseleave", stopDraw);

    // Touch events for tablets / mobile
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startDraw(e.touches[0]);
    });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      draw(e.touches[0]);
    });
    this.canvas.addEventListener("touchend", stopDraw);

    window.addEventListener("resize", () => {
      // Preserve drawing on resize
      const img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.initCanvasSize();
      this.ctx.putImageData(img, 0, 0);
    });
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  setColor(hex) {
    this.color = hex;
    this.isEraser = false;
  }

  setEraser() {
    this.isEraser = true;
  }

  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
