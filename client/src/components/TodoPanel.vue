<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api.js';
import TodoInput from './TodoInput.vue';
import TodoItem from './TodoItem.vue';
import TodoStats from './TodoStats.vue';

const todos = ref([]);
const loading = ref(true);

onMounted(async () => {
  try { todos.value = await api.getTodos(); } catch (e) { console.error(e); }
  loading.value = false;
});

async function handleAdd(text) {
  try {
    const todo = await api.createTodo(text);
    todos.value.unshift(todo);
  } catch (e) { console.error(e); }
}

async function handleToggle(id, done) {
  try {
    await api.updateTodo(id, done);
    const t = todos.value.find(td => td.id === id);
    if (t) t.done = done ? 1 : 0;
  } catch (e) { console.error(e); }
}

async function handleDelete(id) {
  try {
    await api.deleteTodo(id);
    todos.value = todos.value.filter(td => td.id !== id);
  } catch (e) { console.error(e); }
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div class="icon-wrap icon-todo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
      </div>
      <h2>待办事项</h2>
    </div>

    <TodoInput @add="handleAdd" />

    <ul v-if="todos.length" class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="handleToggle"
        @delete="handleDelete"
      />
    </ul>
    <div v-else-if="!loading" class="empty-hint">&#10024; 暂无待办，享受清闲</div>

    <TodoStats :todos="todos" />
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
.icon-todo {
  background: linear-gradient(135deg, rgba(212, 168, 83, 0.15), rgba(232, 201, 122, 0.1));
  color: var(--accent);
}
.panel-header h2 {
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.2px;
}
.todo-list { list-style: none; }
.empty-hint {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 28px 0;
}
</style>
