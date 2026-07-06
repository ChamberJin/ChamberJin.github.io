<template>
  <div class="card">
    <div class="panel-section">
      <div class="panel-section-title">目标导向</div>
      <div style="font-size:0.78rem;color:var(--text-dim);margin-bottom:8px;">
        输入目标抽数或星琼，计算需要攒到哪天
      </div>
      <div class="goal-row">
        <input type="number" v-model.number="goalValue" min="0" placeholder="数量">
        <select v-model="goalUnit">
          <option value="pulls">抽数</option>
          <option value="jade">星琼</option>
        </select>
        <button class="btn-goal" @click="calc">计算</button>
      </div>
      <div class="goal-result" :class="{ visible: resultText }" v-html="resultText"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  holdings: Object,
  monthlyCardEnabled: Boolean,
  calculateGoal: Function
})

const rangeManager = inject('rangeManager')
const emit = defineEmits(['recalculated'])

const goalValue = ref(0)
const goalUnit = ref('pulls')
const resultText = ref('')

function calc() {
  const val = parseInt(goalValue.value) || 0
  if (val <= 0) {
    resultText.value = '⚠️ 请输入大于 0 的目标值'
    return
  }
  const targetJade = goalUnit.value === 'pulls' ? val * 160 : val
  const currentTotal = props.holdings.stellarJade + props.holdings.specialPass * 160

  if (currentTotal >= targetJade) {
    resultText.value = `✅ 当前持有已超过目标 <span class="gr-value">${targetJade.toLocaleString()}</span> 星琼`
    return
  }

  const opts = { monthlyCardEnabled: props.monthlyCardEnabled }
  const result = props.calculateGoal(targetJade, opts, props.holdings)

  if (!result.reached) {
    resultText.value = `❌ 两年内无法攒够（还需 ${(targetJade - currentTotal).toLocaleString()} 星琼，最多再获取 ${result.totalJade.toLocaleString()}）`
    return
  }

  const dateStr = `${result.date.getFullYear()}年${result.date.getMonth()+1}月${result.date.getDate()}日`
  resultText.value = `
    ✅ 目标 <span class="gr-value">${targetJade.toLocaleString()}</span> 星琼 &nbsp;|&nbsp; 当前持有 <span class="gr-value">${currentTotal.toLocaleString()}</span> 星琼
    <br>还需攒 <span class="gr-value">${result.remaining.toLocaleString()}</span> 星琼，预计 <span class="gr-value">${result.daysNeeded}</span> 天
    <br>预计达成日期：<span class="gr-date">${dateStr}</span>
    <br><span style="font-size:0.75rem;color:var(--text-dim);">（期间获取专票 ${result.specialPassTotal} 张 = ${(result.specialPassTotal * 160).toLocaleString()} 星琼）</span>
  `

  // Auto-select calendar to estimated date
  if (result.date && rangeManager) {
    rangeManager.select(result.date)
    emit('recalculated')
  }
}
</script>
