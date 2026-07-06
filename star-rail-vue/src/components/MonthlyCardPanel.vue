<template>
  <div class="card">
    <div class="panel-section">
      <div class="panel-section-title">月卡设置</div>
      <div class="toggle-row">
        <label>☕ 小月卡（每天 90 星琼）</label>
        <div class="toggle-switch" :class="{ active: enabled }" @click="$emit('toggle')"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ enabled: Boolean })
defineEmits(['toggle'])
</script>
