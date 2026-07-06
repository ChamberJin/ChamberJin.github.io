<template>
  <div class="card">
    <div class="panel-section">
      <div class="panel-section-title">当前持有</div>
      <div class="resource-inputs">
        <div class="resource-input-group">
          <label>🌟 星琼</label>
          <input type="number" min="0" :value="holdings.stellarJade" @input="$emit('update-holdings', 'stellarJade', $event.target.value)" placeholder="0">
        </div>
        <div class="resource-input-group">
          <label>🎫 专票</label>
          <input type="number" min="0" :value="holdings.specialPass" @input="$emit('update-holdings', 'specialPass', $event.target.value)" placeholder="0">
        </div>
        <div class="resource-input-group">
          <label>🎟 通票</label>
          <input type="number" min="0" :value="holdings.regularPass" @input="$emit('update-holdings', 'regularPass', $event.target.value)" placeholder="0">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ holdings: Object })
defineEmits(['update-holdings'])
</script>
