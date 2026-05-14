<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../api.js';

const props = defineProps({
  totalSeconds: { type: Number, required: true },
});

const goalMinutes = ref(480);
const showPopup = ref(false);

const pct = computed(() => {
  const min = (props.totalSeconds || 0) / 60;
  return Math.min(100, (min / goalMinutes.value) * 100);
});

onMounted(async () => {
  try {
    const data = await api.getGoal();
    goalMinutes.value = data.goal_minutes;
  } catch (e) { console.error(e); }
});

async function setGoal(min) {
  goalMinutes.value = min;
  try {
    await api.updateGoal(min);
  } catch (e) { console.error(e); }
}

function selectPreset(h) {
  setGoal(h * 60);
  showPopup.value = false;
}

function applyCustom() {
  setGoal(goalMinutes.value);
  showPopup.value = false;
}

const goalHourInput = computed({
  get: () => Math.floor(goalMinutes.value / 60),
  set: (h) => { goalMinutes.value = Math.max(1, Math.min(1440, h * 60 + (goalMinutes.value % 60))); },
});

const goalMinInput = computed({
  get: () => goalMinutes.value % 60,
  set: (m) => { goalMinutes.value = Math.max(1, Math.min(1440, Math.floor(goalMinutes.value / 60) * 60 + m)); },
});
</script>

<template>
  <div class="progress-section">
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" :style="{ width: pct + '%' }"></div>
    </div>
    <div class="progress-labels">
      <span>{{
        (() => {
          const h = Math.floor((totalSeconds || 0) / 3600);
          const m = Math.floor(((totalSeconds || 0) % 3600) / 60);
          return h > 0 ? `今日 ${h} 小时 ${m} 分钟` : `今日 ${m} 分钟`;
        })()
      }}</span>
      <span class="goal" @click.stop="showPopup = !showPopup">{{
        goalMinutes % 60 === 0 ? `目标 ${goalMinutes / 60} 小时` : `目标 ${Math.floor(goalMinutes / 60)} 小时 ${goalMinutes % 60} 分钟`
      }}</span>
      <div v-if="showPopup" class="goal-popup">
        <div class="preset-row">
          <button v-for="h in [2,4,6,8,10,12]" :key="h"
            :class="['preset-btn', { active: h * 60 === goalMinutes }]"
            @click="selectPreset(h)">{{ h }}h</button>
        </div>
        <div class="custom-row">
          自定义 <input type="number" v-model="goalHourInput" min="1" max="24" @change="applyCustom"> 小时
          <input type="number" v-model="goalMinInput" min="0" max="59" step="5" class="min-input" @change="applyCustom"> 分钟
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-section { margin-bottom: 28px; }

.progress-bar-wrap {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  height: 14px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-dark), var(--accent), var(--accent-light));
  background-size: 200% 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
  width: 0%;
  animation: shimmer 2.5s linear infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-secondary);
  position: relative;
}
.goal {
  font-weight: 550;
  color: var(--accent);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.2s;
}
.goal:hover { background: rgba(212, 168, 83, 0.08); }

.goal-popup {
  position: absolute;
  right: 0; top: calc(100% + 8px);
  background: #141428;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10;
  min-width: 220px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.preset-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.preset-btn {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  color: var(--text);
  transition: all 0.15s;
}
.preset-btn:hover { background: rgba(212, 168, 83, 0.1); border-color: var(--accent); }
.preset-btn.active { background: var(--accent); color: #1a1030; border-color: var(--accent); font-weight: 600; }
.custom-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}
.custom-row input {
  width: 44px;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  text-align: center;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}
.custom-row input:focus { border-color: var(--accent); }
.custom-row .min-input { width: 44px; }
</style>
