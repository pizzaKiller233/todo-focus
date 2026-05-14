<script setup>
import { computed } from 'vue';

const props = defineProps({
  running: { type: Boolean, default: false },
  seconds: { type: Number, default: 0 },
});

const emit = defineEmits(['start', 'stop', 'reset']);

const display = computed(() => {
  const totalSec = Math.floor(props.seconds || 0);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});
</script>

<template>
  <div class="timer-section">
    <div :class="['timer-display', { running }]">{{ display }}</div>
    <div class="timer-controls">
      <button
        :class="running ? 'btn-stop' : 'btn-start'"
        @click="running ? emit('stop') : emit('start')"
      >
        {{ running ? '⏸ 暂停' : '▶ 开始专注' }}
      </button>
      <button v-if="running || seconds > 0" class="btn-reset" @click="emit('reset')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.timer-section { text-align: center; }
.timer-display {
  font-size: 64px;
  font-weight: 200;
  font-variant-numeric: tabular-nums;
  letter-spacing: 4px;
  margin: 20px 0 24px;
  color: var(--text);
  transition: color 0.3s;
  user-select: none;
}
.timer-display.running {
  color: var(--accent);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.timer-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.timer-controls button {
  padding: 12px 32px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}

.btn-start {
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff;
  box-shadow: 0 2px 14px var(--success-glow);
}
.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px var(--success-glow);
}

.btn-stop {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: #fff;
  box-shadow: 0 2px 14px rgba(239, 68, 68, 0.3);
}
.btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(239, 68, 68, 0.4);
}

.btn-reset {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  border: 1.5px solid rgba(255, 255, 255, 0.08) !important;
  padding: 12px 16px !important;
}
.btn-reset:hover { background: rgba(255, 255, 255, 0.08); color: var(--text); }

button:active { transform: translateY(0) !important; }
</style>
