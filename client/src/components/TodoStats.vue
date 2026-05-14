<script setup>
import { computed } from 'vue';

const props = defineProps({
  todos: { type: Array, required: true },
});

const pending = computed(() => props.todos.filter(t => !t.done).length);
const done = computed(() => props.todos.filter(t => t.done).length);
</script>

<template>
  <div class="todo-stats">
    <span><span class="dot pending"></span>{{ pending }} 项待办</span>
    <span><span class="dot done"></span>{{ done }} 项已完成</span>
  </div>
</template>

<style scoped>
.todo-stats {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
}
.todo-stats span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.dot.pending { background: var(--accent); }
.dot.done { background: var(--success); }
</style>
