<template>
  <div class="app-container">
    <StarBackground />
    <EventTooltip />
    <SaveFlash />

    <header class="app-header">
      <h1>崩坏：星穹铁道<br><span class="sub-h1">星琼计算器</span></h1>
    </header>

    <YearNavigation :year="year" @update:year="year = $event" @today="goToday" />

    <CalendarGrid
      :year="year"
      :rangeManager="rangeManager"
      :monthlyCardEnabled="resources.monthlyCardEnabled.value"
      :remainingCardDays="resources.remainingCardDays.value"
      @select-date="handleDateClick"
    />

    <LegendBar />

    <div class="main-layout">
      <div class="controls-panel">
        <StoryRewardPanel :versions="storyVersions" />
        <ResourcePanel :holdings="resources.holdings" @update-holdings="updateHoldings" />
        <MonthlyCardPanel
          :enabled="resources.monthlyCardEnabled.value"
          :remainingDays="resources.remainingCardDays.value"
          @toggle="resources.monthlyCardEnabled.value = !resources.monthlyCardEnabled.value"
          @update-remaining="resources.remainingCardDays.value = $event"
        />
        <RangePanel
          :rangeManager="rangeManager"
          @clear="rangeManager.clear()"
        />
        <GoalPanel
          :holdings="resources.holdings"
          :monthlyCardEnabled="resources.monthlyCardEnabled.value"
          :remainingCardDays="resources.remainingCardDays.value"
          :calculateGoal="calculation.calculateGoal"
          @recalculated="recalculate"
        />
      </div>
    </div>

    <ResultsPanel
      v-if="currentResults"
      :results="currentResults"
      :holdings="resources.holdings"
      :storyRewardTotal="storyRewardTotal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, provide, onMounted } from 'vue'
import { useVersion } from './composables/useVersion.js'
import { useRules } from './composables/useRules.js'
import { useRangeManager } from './composables/useRangeManager.js'
import { useResources } from './composables/useResources.js'
import { useCalculation } from './composables/useCalculation.js'
import { useStoryRewards } from './composables/useStoryRewards.js'
import { startOfDay, isToday, isSameDay, isPast, addDays } from './utils/date.js'
import { VERSION_DAYS } from './utils/constants.js'

import StarBackground from './components/StarBackground.vue'
import EventTooltip from './components/EventTooltip.vue'
import SaveFlash from './components/SaveFlash.vue'
import YearNavigation from './components/YearNavigation.vue'
import CalendarGrid from './components/CalendarGrid.vue'
import LegendBar from './components/LegendBar.vue'
import ResourcePanel from './components/ResourcePanel.vue'
import MonthlyCardPanel from './components/MonthlyCardPanel.vue'
import RangePanel from './components/RangePanel.vue'
import GoalPanel from './components/GoalPanel.vue'
import StoryRewardPanel from './components/StoryRewardPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'

const { getVersion, getVersionLabel, getVersionColor } = useVersion()
const rules = useRules()
const rangeManager = useRangeManager()
const resources = useResources()
const storyRewards = useStoryRewards()
const calculation = useCalculation(rules, getVersion, getVersionLabel, storyRewards.getVersionStartDate)

provide('storyRewards', storyRewards)

const year = ref(new Date().getFullYear())

provide('getVersion', getVersion)
provide('getVersionLabel', getVersionLabel)
provide('getVersionColor', getVersionColor)
provide('rules', rules)
provide('rangeManager', rangeManager)
provide('resources', resources)
provide('calculation', calculation)

// Tooltip state
const tooltip = reactive({ visible: false, x: 0, y: 0, html: '' })
provide('tooltip', tooltip)

// Current results for display
const currentResults = ref(null)
const storyVersions = ref([])
const storyRewardTotal = computed(() => storyRewards.getRewardTotal())

function goToday() {
  year.value = new Date().getFullYear()
  recalculate()
}

function handleDateClick(date) {
  if (isPast(date) && !isToday(date)) return
  const isFixed = rangeManager.fixedToday.value
  if (isFixed) {
    if (isToday(date)) return
    if (rangeManager.isSelected(date)) rangeManager.clear()
    else rangeManager.select(date)
  } else {
    if (rangeManager.pendingStart.value === null && rangeManager.selectedDate.value === null) {
      rangeManager.select(date)
    } else if (rangeManager.pendingStart.value !== null) {
      if (isSameDay(date, rangeManager.pendingStart.value)) rangeManager.clear()
      else rangeManager.select(date)
    } else {
      if (rangeManager.isSelected(date)) rangeManager.clear()
      else { rangeManager.clear(); rangeManager.select(date) }
    }
  }
  recalculate()
}

function recalculate() {
  const opts = {
    monthlyCardEnabled: resources.monthlyCardEnabled.value,
    remainingCardDays: resources.remainingCardDays.value
  }
  const selected = rangeManager.selectedDate.value
  if (selected) {
    year.value = selected.getFullYear()
    const startDate = rangeManager.effectiveStartDate.value
    const res = rules.calculateRange(startDate, selected, opts)
    
    storyVersions.value = storyRewards.update(startDate, selected)
    
    const storyTotal = storyRewards.getRewardTotal()
    if (storyTotal.stellarJade > 0 || storyTotal.specialPass > 0) {
      res.storyReward = {
        stellarJade: storyTotal.stellarJade,
        specialPass: storyTotal.specialPass,
        regularPass: 0,
        name: '剧情活动奖励',
        color: '#e09040'
      }
      res._total.stellarJade += storyTotal.stellarJade
      res._total.specialPass += storyTotal.specialPass
    } else {
      delete res.storyReward
    }
    
    currentResults.value = res
  } else {
    storyVersions.value = storyRewards.update(null, null)
    currentResults.value = null
  }
}

function updateHoldings(key, val) {
  resources.holdings[key] = Math.max(0, Math.floor(parseInt(val) || 0))
  recalculate()
}

watch(() => resources.monthlyCardEnabled.value, () => recalculate())
watch(() => resources.remainingCardDays.value, () => recalculate())

// Auto-select current version's end date on mount
onMounted(() => {
  const todayDate = startOfDay(new Date())
  const currentVer = getVersion(todayDate)
  if (currentVer) {
    const verStart = storyRewards.getVersionStartDate(currentVer)
    const verEnd = addDays(verStart, VERSION_DAYS - 1)
    if (verEnd > todayDate) {
      rangeManager.select(verEnd)
      recalculate()
    }
  }
})
</script>
