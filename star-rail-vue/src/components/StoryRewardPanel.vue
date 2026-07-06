<template>
  <div class="card" v-show="versions.length > 0">
    <div class="panel-section">
      <div class="panel-section-title">剧情活动奖励</div>
      <div v-for="v in versions" :key="v.label" class="toggle-row">
        <label style="font-size:0.82rem;">
          📖 {{ v.label }}（{{ formatDate(v.startDate) }}起）
          <span style="display:block;font-size:0.7rem;color:var(--text-dim);margin-top:2px;">+4000星琼 +10专票</span>
        </label>
        <div class="toggle-switch"
          :class="{ active: state[v.label]?.checked }"
          @click="toggle(v.label)">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject } from 'vue'

const storyRewards = inject('storyRewards')
const { state } = storyRewards

const props = defineProps({ versions: { type: Array, default: () => [] } })

function formatDate(d) {
  return `${d.getMonth()+1}/${d.getDate()}`
}

function toggle(label) {
  if (state[label]) {
    state[label].checked = !state[label].checked
  }
}
</script>
