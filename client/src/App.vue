<script setup>
import StarryBackground from './components/StarryBackground.vue';
import TodoPanel from './components/TodoPanel.vue';
import FocusPanel from './components/FocusPanel.vue';
</script>

<template>
  <StarryBackground />
  <div class="container">
    <TodoPanel />
    <FocusPanel />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 24px;
  max-width: 820px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 20px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

@media (max-width: 740px) {
  .container { flex-direction: column; gap: 20px; padding: 24px 16px; }
}
</style>
