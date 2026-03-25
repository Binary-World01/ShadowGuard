<script setup lang="ts">
// Simple banner logic
</script>

<template>
  <div class="banner">
    <div class="content">
      <span class="shield">🛡️</span>
      <span class="text">ShadowGuard: This AI tool is unverified. Enterprise governance policy applied.</span>
    </div>
  </div>
</template>

<style scoped>
.banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #121216;
  color: #ef4444;
  padding: 16px;
  border-bottom: 3px solid #ef4444;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2147483647; /* Max z-index */
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}
.shield { margin-right: 8px; }
.text { font-weight: bold; }
</style>
