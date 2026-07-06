<template>
  <div class="card results-panel">
    <div class="panel-section">
      <div class="panel-section-title">收益总计</div>
      <div class="results-body">
        <div class="results-totals">
          <div class="results-total">
            <div class="total-card gold-border">
              <div class="total-label">🌟 星琼</div>
              <div class="total-value jade">{{ totalJade.toLocaleString() }}</div>
              <div class="total-sub">持有 {{ holdings.stellarJade.toLocaleString() }} + 获取 {{ gainJade.toLocaleString() }}</div>
            </div>
            <div class="total-card">
              <div class="total-label">🎫 专票</div>
              <div class="total-value special">{{ totalSpecial.toLocaleString() }}</div>
              <div class="total-sub">持有 {{ holdings.specialPass.toLocaleString() }} + 获取 {{ gainSpecial.toLocaleString() }}</div>
            </div>
            <div class="total-card">
              <div class="total-label">🎟 通票</div>
              <div class="total-value regular">{{ totalRegular.toLocaleString() }}</div>
              <div class="total-sub">持有 {{ holdings.regularPass.toLocaleString() }} + 获取 {{ gainRegular.toLocaleString() }}</div>
            </div>
          </div>
        </div>
        <div class="results-breakdown">
          <table class="breakdown-table">
            <thead>
              <tr><th>来源</th><th style="text-align:right">星琼</th><th style="text-align:right">专票</th><th style="text-align:right">通票</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in breakdownRows" :key="row.id">
                <td><span class="bd-name"><span class="bd-color" :style="{ background: row.color }"></span>{{ row.name }}</span></td>
                <td class="bd-value">{{ row.jade > 0 ? row.jade.toLocaleString() : '-' }}</td>
                <td class="bd-value">{{ row.sp > 0 ? row.sp.toLocaleString() : '-' }}</td>
                <td class="bd-value">{{ row.rp > 0 ? row.rp.toLocaleString() : '-' }}</td>
              </tr>
              <tr v-if="storyRewardRow">
                <td><span class="bd-name"><span class="bd-color" style="background:#e09040"></span>{{ storyRewardRow.name }}</span></td>
                <td class="bd-value">{{ storyRewardRow.jade > 0 ? storyRewardRow.jade.toLocaleString() : '-' }}</td>
                <td class="bd-value">{{ storyRewardRow.sp > 0 ? storyRewardRow.sp.toLocaleString() : '-' }}</td>
                <td class="bd-value">-</td>
              </tr>
              <tr v-if="breakdownRows.length === 0 && !storyRewardRow">
                <td class="bd-empty" colspan="4">请选择未来日期区间开始计算</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { inject } from 'vue'

const props = defineProps({ results: Object, holdings: Object, storyRewardTotal: Object })
const rules = inject('rules')

const total = computed(() => props.results._total)

const totalJade = computed(() => props.holdings.stellarJade + total.value.stellarJade)
const totalSpecial = computed(() => props.holdings.specialPass + total.value.specialPass)
const totalRegular = computed(() => props.holdings.regularPass + total.value.regularPass)

const gainJade = computed(() => total.value.stellarJade)
const gainSpecial = computed(() => total.value.specialPass)
const gainRegular = computed(() => total.value.regularPass)

const storyRewardRow = computed(() => {
  const srt = props.storyRewardTotal
  if (!srt || (srt.stellarJade === 0 && srt.specialPass === 0)) return null
  return { name: '剧情活动奖励', jade: srt.stellarJade, sp: srt.specialPass }
})

const breakdownRows = computed(() => {
  const rows = []
  for (const rule of rules.RULES) {
    const d = props.results[rule.id]
    if (d.stellarJade === 0 && d.specialPass === 0 && d.regularPass === 0) continue
    rows.push({ id: rule.id, name: rule.name, color: rule.color, jade: d.stellarJade, sp: d.specialPass, rp: d.regularPass })
  }
  return rows
})
</script>
