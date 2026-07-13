<template>
  <div class="card">
    <div class="panel-section">
      <div class="panel-section-title">月卡设置</div>
      <div class="toggle-row">
        <label>☕ 小月卡（每天 90 星琼）</label>
        <div class="toggle-switch" :class="{ active: enabled }" @click="$emit('toggle')"></div>
      </div>
      <div v-if="enabled" class="card-days-row" style="margin-top:8px;">
        <label style="font-size:0.78rem;color:var(--text-dim);display:flex;align-items:center;gap:8px;">
          剩余月卡天数（0=不限）
          <input type="number" min="0" max="180" :value="remainingDays"
            @input="$emit('update-remaining', parseInt($event.target.value) || 0)"
            style="width:60px;background:rgba(0,0,0,0.3);border:1px solid var(--border-color);border-radius:6px;padding:4px 8px;color:var(--text-primary);font-size:0.85rem;outline:none;text-align:center;font-weight:600;">
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ enabled: Boolean, remainingDays: Number })
defineEmits(['toggle', 'update-remaining'])
</script>
