<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { api } from '../api.js';
import ProgressBar from './ProgressBar.vue';
import TimerDisplay from './TimerDisplay.vue';
import SessionList from './SessionList.vue';

const totalSeconds = ref(0);
const sessions = ref([]);
const running = ref(false);
const currentSeconds = ref(0);

let timerInterval = null;
let timerStart = null;
let elapsedBefore = 0;

onMounted(async () => {
  try {
    const data = await api.getToday();
    totalSeconds.value = data.total_seconds || 0;
    sessions.value = data.sessions || [];
    elapsedBefore = totalSeconds.value;
  } catch (e) { console.error(e); }
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
    const elapsed = (Date.now() - timerStart) / 1000;
    if (elapsed >= 1) {
      const startTime = new Date(timerStart).toLocaleTimeString('zh-CN', { hour12: false });
      api.addSession(startTime, Math.round(elapsed));
    }
  }
});

function startTimer() {
  if (timerInterval) return;
  timerStart = Date.now();
  running.value = true;
  timerInterval = setInterval(() => {
    currentSeconds.value = elapsedBefore + (Date.now() - timerStart) / 1000;
  }, 200);
}

async function stopTimer() {
  if (!timerInterval) return;
  clearInterval(timerInterval);
  timerInterval = null;
  const elapsed = (Date.now() - timerStart) / 1000;
  if (elapsed >= 1) {
    const startTime = new Date(timerStart).toLocaleTimeString('zh-CN', { hour12: false });
    try {
      await api.addSession(startTime, Math.round(elapsed));
    } catch (e) { console.error(e); }
  }
  totalSeconds.value = elapsedBefore + (elapsed >= 1 ? elapsed : 0);
  elapsedBefore = totalSeconds.value;
  currentSeconds.value = totalSeconds.value;
  running.value = false;
  try {
    const data = await api.getToday();
    totalSeconds.value = data.total_seconds || 0;
    sessions.value = data.sessions || [];
    elapsedBefore = totalSeconds.value;
    currentSeconds.value = totalSeconds.value;
  } catch (e) { console.error(e); }
}

async function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  running.value = false;
  currentSeconds.value = totalSeconds.value;
}

async function deleteSession(index) {
  const s = sessions.value[index];
  if (!s) return;
  try {
    await api.deleteSession(s.id);
    totalSeconds.value = Math.max(0, totalSeconds.value - (s.seconds || 0));
    elapsedBefore = totalSeconds.value;
    currentSeconds.value = totalSeconds.value;
    sessions.value.splice(index, 1);
  } catch (e) { console.error(e); }
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div class="icon-wrap icon-focus">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <h2>每日专注</h2>
    </div>

    <ProgressBar :total-seconds="running ? currentSeconds : totalSeconds" />

    <TimerDisplay
      :running="running"
      :seconds="running ? currentSeconds : totalSeconds"
      @start="startTimer"
      @stop="stopTimer"
      @reset="resetTimer"
    />

    <SessionList
      :sessions="sessions"
      :running="running"
      :current-seconds="running ? Math.max(0, currentSeconds - totalSeconds) : 0"
      @delete="deleteSession"
    />
  </div>
</template>

<style scoped>
.panel {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-card);
  border-radius: var(--radius);
  padding: 32px 28px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s;
  flex: 1 1 350px;
  min-width: 310px;
}
.panel:hover {
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 168, 83, 0.05);
}
.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.icon-wrap {
  width: 38px; height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}
.icon-focus {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.12), rgba(74, 222, 128, 0.06));
  color: var(--success);
}
.panel-header h2 {
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.2px;
}
</style>
