document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const journey = document.getElementById("journey");
  const beginJourney = document.getElementById("beginJourney");
  const milestoneCards = document.querySelectorAll(".milestone");
  const storySections = document.querySelectorAll(".story-section");
  const polaroids = document.querySelectorAll(".polaroid");
  const polaroidNote = document.getElementById("polaroidNote");
  const lockBox = document.getElementById("lockBox");
  const letterSection = document.getElementById("letter");
  const letterParagraphs = [...document.querySelectorAll(".letter__inner p")];
  const quizButtons = document.querySelectorAll(".quiz .options button");
  const quizResult = document.getElementById("quizResult");
  const meterFill = document.getElementById("meterFill");
  const heartButton = document.getElementById("heartButton");
  const secretMessage = document.getElementById("secretMessage");
  const surpriseButton = document.getElementById("surpriseButton");
  const surpriseMessage = document.getElementById("surpriseMessage");
  const fireworksCanvas = document.getElementById("fireworks");
  const heartsContainer = document.querySelector(".floating-hearts");
  const loadingScreen = document.getElementById("loadingScreen");
  const floatingNote = document.getElementById("floatingNote");
  const forYouNote = document.getElementById("forYouNote");
  const forYouClose = document.getElementById("forYouClose");
  const replayJourney = document.getElementById("replayJourney");
  const chapterTags = document.querySelectorAll(".chapter-tag");
  const heroTitle = document.querySelector(".hero h1");
  const backgroundGlow = document.querySelector(".background-glow");

  let loveLevel = 12;
  let heartClicks = 0;
  let letterShown = false;
  let floatingNoteDisplayed =
    sessionStorage.getItem("floatingNoteShown") === "true";
  const forYouDismissed = localStorage.getItem("forYouDismissed") === "true";

  const compliments = [
    "You light up every room you enter, Anu 💕.",
    "My heart does a happy dance seeing you!",
    "Anu 💕, your laugh is my favorite melody.",
    "Every day with you feels like a cinematic celebration.",
    "You are my forever safe place.",
    "Instant serotonin = your smile, Anu 💕.",
    "Can someone be this magical? (Answer: you).",
  ];

  prepLetterParagraphs();
  assignSectionDelays();
  initLoadingScreen();
  initGlobalEffects();
  handleForYouNotes();
  initJourneyFlow();
  initObservers();
  initPolaroids();
  initLockbox();
  initQuiz();
  initLoveMeter();
  initSurpriseButton();
  initFireworks();
  initEasterEggs();

  function prepLetterParagraphs() {
    letterParagraphs.forEach((p) => {
      p.dataset.fullText = p.textContent.trim();
      p.textContent = "";
    });
  }

  function assignSectionDelays() {
    storySections.forEach((section, index) => {
      section.dataset.delay = (index * 0.12).toFixed(2);
    });
  }

  function initLoadingScreen() {
    window.addEventListener("load", () => {
      setTimeout(() => loadingScreen?.classList.add("hidden"), 1200);
    });
  }

  function initGlobalEffects() {
    document.addEventListener("click", createRipple);
    window.addEventListener("scroll", handleParallax);
    handleParallax();
    setInterval(createHeart, 900);
  }

  function handleForYouNotes() {
    if (!forYouDismissed) {
      setTimeout(() => forYouNote?.classList.add("visible"), 4500);
    }
    forYouClose?.addEventListener("click", () => {
      forYouNote?.classList.remove("visible");
      localStorage.setItem("forYouDismissed", "true");
    });
  }

  function maybeShowFloatingNote(message = "For You, Anu 💕", persist = false) {
    if (!floatingNote) return;
    floatingNote.classList.remove("hidden");
    floatingNote.textContent = message;
    floatingNote.classList.add("visible");
    if (!persist) {
      setTimeout(() => floatingNote.classList.remove("visible"), 6000);
    }
  }

  function initJourneyFlow() {
    beginJourney?.addEventListener("click", () => {
      intro.classList.add("fade-out");
      setTimeout(() => {
        intro.classList.add("hidden");
        journey.classList.remove("hidden");
        gsap.from(".hero__text", {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: "power3.out",
        });
        if (!floatingNoteDisplayed) {
          floatingNoteDisplayed = true;
          sessionStorage.setItem("floatingNoteShown", "true");
          setTimeout(() => maybeShowFloatingNote(), 4000);
        }
      }, 700);
    });

    replayJourney?.addEventListener("click", () => {
      resetStory();
    });
  }

  function resetStory() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    journey.classList.add("hidden");
    intro.classList.remove("hidden", "fade-out");
    letterShown = false;
    letterParagraphs.forEach((p) => {
      p.textContent = "";
      p.classList.remove("typing", "revealed");
    });
  }

  function initObservers() {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.transitionDelay = `${delay}s`;
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    milestoneCards.forEach((card) => revealObserver.observe(card));
    storySections.forEach((section) => revealObserver.observe(section));
  }

  function initPolaroids() {
    polaroids.forEach((card) => {
      const rotation = (Math.random() * 8 - 4).toFixed(2);
      card.style.setProperty("--rotation", `${rotation}deg`);

      card.addEventListener("click", () => {
        polaroids.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        polaroidNote.textContent = card.dataset.note;
      });

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        card.style.setProperty("--tiltX", `${(offsetX / rect.width) * 8}deg`);
        card.style.setProperty("--tiltY", `${(-offsetY / rect.height) * 8}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tiltX", "0deg");
        card.style.setProperty("--tiltY", "0deg");
        card.style.setProperty("--lift", "0px");
        card.style.setProperty("--scale", "1");
      });
    });
  }

  function initLockbox() {
    lockBox?.addEventListener("click", () => {
      if (letterShown) return;
      lockBox.classList.add("open");
      letterSection.classList.remove("hidden");
      letterShown = true;
      setTimeout(() => {
        letterSection.scrollIntoView({ behavior: "smooth" });
        typeParagraphs();
      }, 500);
    });
  }

  function typeParagraphs() {
    const baseDelay = 2500;
    letterParagraphs.forEach((p, index) => {
      setTimeout(() => typeText(p), index * baseDelay);
    });
  }

  function typeText(element) {
    const text = element.dataset.fullText;
    let i = 0;
    element.classList.add("typing");
    const typer = setInterval(() => {
      element.textContent = text.slice(0, i);
      i++;
      if (i > text.length) {
        clearInterval(typer);
        element.classList.add("revealed");
      }
    }, 25);
  }

  function initQuiz() {
    quizButtons.forEach((button) => {
      button.addEventListener("click", () => {
        quizButtons.forEach((b) =>
          b.classList.remove("correct", "wrong", "shake", "sparkle")
        );
        const isCorrect = button.dataset.correct === "true";
        button.classList.add(isCorrect ? "correct" : "wrong");
        quizResult.textContent = isCorrect
          ? "Of course! Comfort is always Mom's paratha."
          : "Cute guess... but think home!";
        if (isCorrect) {
          button.classList.add("sparkle");
          setTimeout(() => button.classList.remove("sparkle"), 800);
        } else {
          button.classList.add("shake");
          setTimeout(() => button.classList.remove("shake"), 600);
        }
      });
    });
  }

  function initLoveMeter() {
    heartButton?.addEventListener("click", () => {
      loveLevel += 12;
      heartClicks += 1;
      if (loveLevel > 100) loveLevel = 100;
      meterFill.style.width = `${loveLevel}%`;
      meterFill.classList.add("bounce");
      heartButton.classList.add("pulse");
      setTimeout(() => {
        meterFill.classList.remove("bounce");
        heartButton.classList.remove("pulse");
      }, 500);

      if (heartClicks === 5) {
        secretMessage?.classList.remove("hidden");
        maybeShowFloatingNote("Secret unlocked: Anu 💕 owns my whole galaxy.");
      }
    });
  }

  function initSurpriseButton() {
    surpriseButton?.addEventListener("click", () => {
      const randomMessage =
        compliments[Math.floor(Math.random() * compliments.length)];
      surpriseMessage.textContent = randomMessage;
    });
  }

  function initEasterEggs() {
    heroTitle?.addEventListener("dblclick", () => {
      maybeShowFloatingNote("Even the stars whisper your name, Anu 💕.");
    });

    chapterTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        maybeShowFloatingNote(
          "No skipping chapters—our story is perfect, Anu 💕."
        );
      });
    });
  }

  function handleParallax() {
    if (!backgroundGlow) return;
    const offset = window.scrollY * -0.04;
    backgroundGlow.style.transform = `translateY(${offset}px)`;
  }

  function createRipple(event) {
    const ripple = document.createElement("span");
    ripple.className = "click-ripple";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  function createHeart() {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${6 + Math.random() * 4}s`;
    heart.style.fontSize = `${10 + Math.random() * 20}px`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
  }

  function initFireworks() {
    if (!fireworksCanvas) return;
    const ctx = fireworksCanvas.getContext("2d");
    let width, height;
    const fireworks = [];
    const particles = [];

    function resizeCanvas() {
      width = fireworksCanvas.clientWidth;
      height = fireworksCanvas.clientHeight;
      fireworksCanvas.width = width;
      fireworksCanvas.height = height;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Firework {
      constructor() {
        this.x = Math.random() * width;
        this.y = height + 20;
        this.targetY = Math.random() * (height * 0.4) + 20;
        this.speed = 4 + Math.random() * 3;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.exploded = false;
      }
      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY && !this.exploded) {
          this.exploded = true;
          this.explode();
        }
      }
      explode() {
        for (let i = 0; i < 24; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = Math.random() * 3 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.01 + 0.01;
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + 0.2;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function animateFireworks() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);

      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }

      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded) {
          fireworks.splice(index, 1);
        }
      });

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.alpha <= 0) particles.splice(index, 1);
      });

      requestAnimationFrame(animateFireworks);
    }

    animateFireworks();
  }
});
