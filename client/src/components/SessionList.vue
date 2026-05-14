<script setup>
import { computed } from 'vue';

const props = defineProps({
  sessions: { type: Array, required: true },
  running: { type: Boolean, default: false },
  currentSeconds: { type: Number, default: 0 },
});

const emit = defineEmits(['delete']);

function fmtDuration(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h} 小时 ${m} 分钟`;
  return `${m} 分钟`;
}

const displaySessions = computed(() => {
  const list = props.sessions.map((s, i) => ({ ...s, _idx: i, active: false }));
  if (props.running && props.currentSeconds > 0) {
    list.unshift({ start_time: '进行中', seconds: props.currentSeconds, active: true, _idx: -1 });
  }
  return list;
});
</script>

<template>
  <div class="section-label">今日记录</div>
  <div class="session-list" v-if="displaySessions.length">
    <div v-for="s in displaySessions" :key="s._idx" class="session-row">
      <span class="session-time">
        <span v-if="s.active" class="dot-live"></span>
        {{ s.start_time }}{{ s.active ? ' · 进行中' : '' }}
      </span>
      <span class="session-dur">
        {{ fmtDuration(s.seconds) }}
        <button v-if="!s.active" class="session-del" @click="emit('delete', s._idx)" title="删除">&times;</button>
      </span>
    </div>
  </div>
  <div v-else class="empty-hint">今天还没有专注记录</div>
</template>

<style scoped>
.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  margin-bottom: 8px;
  margin-top: 4px;
}
.session-list {
  max-height: 180px;
  overflow-y: auto;
}
.session-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.15s;
}
.session-row:hover { background: rgba(212, 168, 83, 0.04); }
.session-time {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot-live {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--success);
  animation: blink 1s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.session-dur {
  font-weight: 550;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}
.session-del {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 4px;
  transition: all 0.15s;
  opacity: 0;
}
.session-row:hover .session-del { opacity: 1; }
.session-del:hover { color: var(--danger); background: var(--danger-bg); }

.session-list::-webkit-scrollbar { width: 4px; }
.session-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 2px; }

.empty-hint {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 28px 0;
}
</style>
