/* =========================
   💜 ELEMENTS
========================= */

const themeSelect = document.getElementById("theme-select");
const biasSelect = document.getElementById("bias-select");
const biasButton = document.getElementById("bias-mode");
const musicButton = document.getElementById("music-mode");
const eraButton = document.getElementById("era-mode");

const html = document.documentElement;
const body = document.body;

/* =========================
   🎨 THEME + BIAS SETUP
========================= */

const savedTheme = localStorage.getItem("theme") || "bts";
const savedBias = localStorage.getItem("bias") || "jhope";

let currentTheme = savedTheme;

html.setAttribute("data-theme", savedTheme);
body.dataset.bias = savedBias;

if (themeSelect) themeSelect.value = savedTheme;
if (biasSelect) biasSelect.value = savedBias;

/* =========================
   🎛 CONTROLS
========================= */

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    const selectedTheme = themeSelect.value;
    if (selectedTheme === currentTheme) return;

    currentTheme = selectedTheme;
    html.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);

    createParticles();
  });
}

if (biasButton) {
  biasButton.addEventListener("click", () => {
    body.classList.toggle("bias-mode");
    biasButton.textContent = body.classList.contains("bias-mode")
      ? "💜 Bias ON"
      : "💜 Bias";
  });
}

if (biasSelect) {
  biasSelect.addEventListener("change", () => {
    body.dataset.bias = biasSelect.value;
    localStorage.setItem("bias", biasSelect.value);
  });
}

if (musicButton) {
  musicButton.addEventListener("click", () => {
    body.classList.toggle("music-mode");
  });
}

/* =========================
   🎬 ERA MODE
========================= */

let eraModeActive = false;

if (eraButton) {
  eraButton.addEventListener("click", () => {
    eraModeActive = !eraModeActive;

    body.classList.toggle("era-mode");
    eraButton.textContent = eraModeActive ? "🎬 Era ON" : "🎬 Era";

    if (!eraModeActive) {
      currentTheme = savedTheme;
      html.setAttribute("data-theme", savedTheme);
    }
  });
}

const eraSections = document.querySelectorAll(".era-section");

const eraObserver = new IntersectionObserver(
  (entries) => {
    if (!eraModeActive) return;

    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const eraTheme = entry.target.dataset.era;
      if (!eraTheme || eraTheme === currentTheme) return;

      currentTheme = eraTheme;
      html.setAttribute("data-theme", eraTheme);

      if (themeSelect) themeSelect.value = eraTheme;

      createParticles();
    });
  },
  { threshold: 0.45 }
);

eraSections.forEach((section) => eraObserver.observe(section));

/* =========================
   ✨ PARTICLES
========================= */

const canvas = document.getElementById("particles");
const ctx = canvas?.getContext("2d");

let particles = [];
let sparkles = [];

const mouse = { x: null, y: null, radius: 180 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("click", (e) => {
  createSparkleBurst(e.clientX, e.clientY);
});

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getThemeColors() {
  const styles = getComputedStyle(html);
  return {
    pink: styles.getPropertyValue("--pink").trim() || "#ff4fd8",
    purple: styles.getPropertyValue("--purple").trim() || "#6a0dad",
    mint: styles.getPropertyValue("--mint").trim() || "#79ffe1",
  };
}

function createParticles() {
  particles = [];

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 14 + 16,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.01,
    });
  }
}

function createSparkleBurst(x, y) {
  for (let i = 0; i < 12; i++) {
    sparkles.push({
      x,
      y,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 3,
      speedY: (Math.random() - 0.5) * 3,
      life: 1,
    });
  }
}

function reactToMouse(p) {
  if (mouse.x === null) return;

  const dx = p.x - mouse.x;
  const dy = p.y - mouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < mouse.radius) {
    const angle = Math.atan2(dy, dx);
    const force = (mouse.radius - dist) / mouse.radius;

    p.x += Math.cos(angle) * force * 6;
    p.y += Math.sin(angle) * force * 6;
  }
}

/* =========================
   ✨ POLISHED SPARKLES
========================= */

function drawSparkle(s, color) {
  ctx.save();

  const theme = html.getAttribute("data-theme");

  let size = s.size;
  let lineWidth = 1.8;
  let glow = 18;
  let alpha = s.life;

  if (theme === "golden") {
    size *= 1.5;
    lineWidth = 2.4;
    glow = 28;
    alpha *= 0.9;
  } else if (theme === "jack-box" || theme === "jack-hope") {
    size *= 1.1;
    lineWidth = 2.6;
    glow = 16;
    alpha *= 1.1;
  } else if (theme === "mots" || theme === "mots7") {
    size *= 1.4;
    lineWidth = 2;
    glow = 24;
    alpha *= 0.85;
  }

  const pop = 1 + (1 - s.life) * 0.6;
  size *= pop;

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.shadowBlur = glow;
  ctx.shadowColor = color;

  ctx.beginPath();
  ctx.moveTo(s.x - size, s.y);
  ctx.lineTo(s.x + size, s.y);
  ctx.moveTo(s.x, s.y - size);
  ctx.lineTo(s.x, s.y + size);
  ctx.stroke();

  ctx.restore();
}

/* =========================
   💜 BTS LOGO
========================= */

function drawBtsLogo(x, y, size, color, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;

  ctx.beginPath();
  ctx.moveTo(-size * 0.35, -size * 0.45);
  ctx.lineTo(-size * 0.08, -size * 0.3);
  ctx.lineTo(-size * 0.08, size * 0.45);
  ctx.lineTo(-size * 0.35, size * 0.3);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size * 0.35, -size * 0.45);
  ctx.lineTo(size * 0.08, -size * 0.3);
  ctx.lineTo(size * 0.08, size * 0.45);
  ctx.lineTo(size * 0.35, size * 0.3);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

/* =========================
   🎬 DRAW LOOP
========================= */

function drawParticles() {
  if (!canvas || !ctx) return;

  const colors = getThemeColors();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sparkles.forEach((s, i) => {
    const theme = html.getAttribute("data-theme");

    if (theme === "golden") s.life -= 0.018;
    else if (theme === "jack-box" || theme === "jack-hope") s.life -= 0.035;
    else if (theme === "mots" || theme === "mots7") s.life -= 0.02;
    else s.life -= 0.025;

    s.x += s.speedX;
    s.y += s.speedY;

    const color =
      i % 3 === 0 ? colors.pink : i % 3 === 1 ? colors.purple : colors.mint;

    drawSparkle(s, color);
  });

  sparkles = sparkles.filter((s) => s.life > 0);

  particles.forEach((p, i) => {
    const speed = body.classList.contains("music-mode") ? 2 : 1;

    p.x += p.speedX * speed;
    p.y += p.speedY * speed;
    p.rotation += p.spin * speed;

    reactToMouse(p);

    if (p.x < -80) p.x = canvas.width + 80;
    if (p.x > canvas.width + 80) p.x = -80;
    if (p.y < -80) p.y = canvas.height + 80;
    if (p.y > canvas.height + 80) p.y = -80;

    const color =
      i % 3 === 0 ? colors.pink : i % 3 === 1 ? colors.purple : colors.mint;

    drawBtsLogo(p.x, p.y, p.size, color, p.rotation);
  });

  requestAnimationFrame(drawParticles);
}

/* =========================
   🚀 START
========================= */

createParticles();
drawParticles();