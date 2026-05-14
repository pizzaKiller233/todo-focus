<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add']);
const text = ref('');

function submit() {
  const val = text.value.trim();
  if (!val) return;
  emit('add', val);
  text.value = '';
}
</script>

<template>
  <div class="todo-input-wrap">
    <input
      v-model="text"
      type="text"
      placeholder="写点什么..."
      maxlength="200"
      autocomplete="off"
      @keydown.enter="submit"
    />
    <button @click="submit">添加</button>
  </div>
</template>

<style scoped>
.todo-input-wrap {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.todo-input-wrap input {
  flex: 1;
  padding: 11px 16px;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  font-size: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  transition: all 0.25s;
}
.todo-input-wrap input::placeholder { color: var(--text-muted); }
.todo-input-wrap input:focus {
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.todo-input-wrap button {
  padding: 11px 20px;
  background: linear-gradient(135deg, var(--accent-dark), var(--accent), var(--accent-light));
  color: #1a1030;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 12px var(--accent-glow);
}
.todo-input-wrap button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px var(--accent-glow);
}
.todo-input-wrap button:active { transform: translateY(0); }
</style>
