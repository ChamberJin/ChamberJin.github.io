<template>
  <div class="save-flash" :class="{ visible: show }">{{ msg }}</div>
</template>
<script setup>
import { ref } from 'vue'
const show = ref(false)
let timer = null
function flash(msg = '✓ 已自动保存') {
  show.value = true
  clearTimeout(timer)
  timer = setTimeout(() => show.value = false, 1500)
}
defineExpose({ flash })
</script>
