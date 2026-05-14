<script setup>
const props = defineProps({
  todo: { type: Object, required: true },
});
const emit = defineEmits(['toggle', 'delete']);
</script>

<template>
  <li :class="{ completed: todo.done }">
    <span class="cb-wrap">
      <input
        type="checkbox"
        :checked="todo.done"
        @change="emit('toggle', todo.id, !todo.done)"
      />
    </span>
    <span class="task-text">{{ todo.text }}</span>
    <button class="del-btn" @click="emit('delete', todo.id)" title="删除">&times;</button>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  padding: 11px 14px;
  border-radius: 10px;
  gap: 12px;
  transition: background 0.2s;
  margin-bottom: 2px;
  animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
li:hover { background: rgba(212, 168, 83, 0.05); }

.cb-wrap {
  flex-shrink: 0;
  position: relative;
  width: 20px; height: 20px;
}
.cb-wrap input {
  appearance: none;
  -webkit-appearance: none;
  width: 20px; height: 20px;
  border: 2px solid var(--text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  margin: 0;
  position: relative;
}
.cb-wrap input:hover { border-color: var(--accent); }
.cb-wrap input:checked {
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  border-color: var(--accent);
}
.cb-wrap input:checked::after {
  content: '';
  position: absolute;
  left: 5px; top: 1px;
  width: 5px; height: 10px;
  border: solid #1a1030;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.task-text {
  flex: 1;
  font-size: 14px;
  word-break: break-all;
  transition: color 0.2s;
}
.completed .task-text {
  text-decoration: line-through;
  color: var(--text-muted);
}

.del-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 6px;
  transition: all 0.15s;
  flex-shrink: 0;
  opacity: 0;
}
li:hover .del-btn { opacity: 1; }
.del-btn:hover {
  color: var(--danger);
  background: var(--danger-bg);
}
</style>
