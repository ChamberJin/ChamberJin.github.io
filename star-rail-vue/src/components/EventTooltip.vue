<template>
  <div class="event-tooltip" ref="el"></div>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue'
const el = ref(null)
const tooltip = inject('tooltip')

function show(event, date, events) {
  const opts = inject('opts', { monthlyCardEnabled: true })
  const dateStr = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
  let html = `<div class="tt-date">📅 ${dateStr}</div>`
  for (const ev of events) {
    const reward = ev.getReward(date, opts)
    const parts = []
    if (reward.stellarJade) parts.push(`🌟 ${reward.stellarJade}星琼`)
    if (reward.specialPass) parts.push(`🎫 ${reward.specialPass}专票`)
    if (reward.regularPass) parts.push(`🎟 ${reward.regularPass}通票`)
    html += `<div class="tt-item"><span class="tt-name">${ev.name}</span><span class="tt-value">${parts.join(' + ')}</span></div>`
  }
  el.value.innerHTML = html
  el.value.classList.add('visible')
  move(event)
}
function move(event) {
  if (!el.value) return
  const x = event.clientX + 16
  const y = event.clientY + 16
  const rect = el.value.getBoundingClientRect()
  el.value.style.left = Math.min(x, window.innerWidth - rect.width - 10) + 'px'
  el.value.style.top = Math.min(y, window.innerHeight - rect.height - 10) + 'px'
}
function hide() {
  if (el.value) el.value.classList.remove('visible')
}

onMounted(() => {
  tooltip.show = show
  tooltip.move = move
  tooltip.hide = hide
})
</script>
