let highestZ = 1;

class Paper {
  constructor(index) {
    this.holdingPaper = false;
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    // Fixed positions for sequential arrangement
    this.index = index;
    this.currentPaperX = 50;
    this.currentPaperY = 50 + index * 50; // Stack papers with 50px vertical spacing
    this.rotation = -5 + index * 2; // Slight rotation variation

    this.touchPoints = [];
  }

  init(paper) {
    // Mouse Events
    paper.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Calculate offset from mouse position to paper corner
      const rect = paper.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;

      // Add dragging class for visual feedback
      paper.classList.add("dragging");
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.holdingPaper) return;

      // Calculate new position based on mouse position minus offset
      this.currentPaperX = e.clientX - this.offsetX;
      this.currentPaperY = e.clientY - this.offsetY;

      // Keep paper within viewport bounds
      const maxX = window.innerWidth - paper.offsetWidth;
      const maxY = window.innerHeight - paper.offsetHeight;
      this.currentPaperX = Math.max(0, Math.min(maxX, this.currentPaperX));
      this.currentPaperY = Math.max(0, Math.min(maxY, this.currentPaperY));

      // Update position with absolute positioning instead of transforms
      paper.style.left = `${this.currentPaperX}px`;
      paper.style.top = `${this.currentPaperY}px`;
    });

    document.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      paper.classList.remove("dragging");
    });
    paper.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();

        // Store touch points for potential two-finger rotation
        this.touchPoints = Array.from(e.touches).map((t) => ({
          x: t.clientX,
          y: t.clientY,
        }));

        if (this.touchPoints.length >= 2) {
          // Two-finger gesture - handle rotation
          const [t1, t2] = this.touchPoints;
          const dx = t2.x - t1.x;
          const dy = t2.y - t1.y;
          const angle = Math.atan2(dy, dx);
          this.rotation = ((angle * 180) / Math.PI + 360) % 360;
          this.rotating = true;
        } else if (this.touchPoints.length === 1) {
          // Single-finger gesture - handle dragging
          this.rotating = false;
          this.moveX = this.touchPoints[0].x;
          this.moveY = this.touchPoints[0].y;

          this.velX = this.moveX - this.prevX;
          this.velY = this.moveY - this.prevY;

          if (this.holdingPaper) {
            this.currentPaperX += this.velX;
            this.currentPaperY += this.velY;

            // Keep paper within viewport bounds
            this.currentPaperX = Math.max(
              -100,
              Math.min(window.innerWidth - 100, this.currentPaperX)
            );
            this.currentPaperY = Math.max(
              -100,
              Math.min(window.innerHeight - 100, this.currentPaperY)
            );

            this.prevX = this.moveX;
            this.prevY = this.moveY;
          }
        }

        if (this.holdingPaper) {
          // Apply rotation first, then translation
          paper.style.transform = `rotateZ(${this.rotation}deg) translate(${this.currentPaperX}px, ${this.currentPaperY}px)`;
        }
      },
      { passive: false }
    );

    paper.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        if (this.holdingPaper) return;
        this.holdingPaper = true;

        // Bring paper to front
        paper.style.zIndex = highestZ;
        highestZ += 1;

        const firstTouch = e.touches[0];
        const rect = paper.getBoundingClientRect();
        this.offsetX = firstTouch.clientX - rect.left;
        this.offsetY = firstTouch.clientY - rect.top;

        // Store initial touch positions
        this.touchPoints = Array.from(e.touches).map((t) => ({
          x: t.clientX,
          y: t.clientY,
        }));

        this.startX = firstTouch.clientX;
        this.startY = firstTouch.clientY;
        paper.classList.add("dragging");
      },
      { passive: false }
    );

    paper.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        this.holdingPaper = false;
        this.rotating = false;
        this.touchPoints = [];

        // Reset velocities
        this.velX = 0;
        this.velY = 0;
      },
      { passive: false }
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const papers = Array.from(document.querySelectorAll(".paper"));

  papers.forEach((paper, index) => {
    paper.style.position = "absolute";
    const p = new Paper(index);
    p.init(paper);

    paper.style.left = `${p.currentPaperX}px`;
    paper.style.top = `${p.currentPaperY}px`;
    paper.style.transform = `rotateZ(${p.rotation}deg)`;
  });
});
