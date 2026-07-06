<template>
  <nav class="year-nav">
    <button @click="$emit('update:year', year - 1)">◀</button>
    <span class="year-label">{{ year }}</span>
    <button @click="$emit('update:year', year + 1)">▶</button>
    <button class="btn-today" @click="$emit('today')">今天</button>
  </nav>
</template>
<script setup>
defineProps({ year: Number })
defineEmits(['update:year', 'today'])
</script>
