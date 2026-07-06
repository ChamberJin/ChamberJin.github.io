<template>
  <div id="stars"></div>
</template>
<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const container = document.getElementById('stars')
  const count = 200
  let css = ''
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 2 + 1
    const opacity = Math.random() * 0.6 + 0.2
    css += `${x}% ${y}% ${size}px rgba(255,255,255,${opacity})${i < count - 1 ? ', ' : ''}`
  }
  container.style.boxShadow = css
  container.style.width = '0'
  container.style.height = '0'
})
</script>
