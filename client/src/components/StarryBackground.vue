<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
let stars = [];
let animId = null;

function generateStars(w, h) {
  const count = 160;
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      baseOpacity: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    });
  }
}

let lastTime = 0;

function draw(ctx, w, h, elapsed) {
  ctx.clearRect(0, 0, w, h);

  for (const s of stars) {
    const opacity = s.baseOpacity + Math.sin(elapsed * s.speed + s.phase) * 0.15;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 210, 255, ${Math.max(0.05, opacity)})`;
    ctx.fill();
  }

  // Draw constellation lines between nearby bright stars
  const bright = stars.filter(s => s.r > 1.0);
  ctx.strokeStyle = 'rgba(180, 160, 220, 0.08)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < bright.length; i++) {
    for (let j = i + 1; j < bright.length; j++) {
      const dx = bright[i].x - bright[j].x;
      const dy = bright[i].y - bright[j].y;
      if (dx * dx + dy * dy < 32400) {
        ctx.beginPath();
        ctx.moveTo(bright[i].x, bright[i].y);
        ctx.lineTo(bright[j].x, bright[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate(ctx, timestamp) {
  if (!lastTime) lastTime = timestamp;
  const elapsed = (timestamp - lastTime) * 0.06;
  lastTime = timestamp;
  const cvs = canvas.value;
  draw(ctx, cvs.width, cvs.height, elapsed);
  animId = requestAnimationFrame((t) => animate(ctx, t));
}

function resize() {
  const cvs = canvas.value;
  if (!cvs) return;
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  generateStars(cvs.width, cvs.height);
}

onMounted(() => {
  resize();
  const ctx = canvas.value.getContext('2d');
  animId = requestAnimationFrame((t) => animate(ctx, t));
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  cancelAnimationFrame(animId);
  window.removeEventListener('resize', resize);
});
</script>

<template>
  <canvas ref="canvas" class="starry-bg"></canvas>
</template>

<style scoped>
.starry-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
