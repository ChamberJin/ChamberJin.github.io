function calculateGoal(targetJade, opts) {
  const today = startOfDay(new Date());
  const start = new Date(today);

  let cumulative = 0;
  let specialPassTotal = 0;
  let cur = new Date(start);
  const maxDays = 730; // 2 years max
  const dailyBreakdown = [];

  // Pre-compute future unstarted versions for story rewards
  const futureVersions = [];
  const farEnd = addDays(today, 730);
  const firstVer = getVersion(today);
  if (firstVer) {
    let vStart = getVersionStartDate(firstVer);
    let vLabel = getVersionLabel(firstVer);
    while (vStart <= farEnd) {
      if (vStart > today && !futureVersions.some(v => v.label === vLabel)) {
        futureVersions.push({ label: vLabel, startDate: vStart });
      }
      vStart = addDays(vStart, VERSION_DAYS);
      vLabel = getVersionLabel(getVersion(vStart));
    }
  }

  for (let i = 0; i < maxDays; i++) {
    let dayTotal = 0;
    // Add one-time story rewards for future versions
    for (const fv of futureVersions) {
      if (isSameDay(cur, fv.startDate)) {
        dayTotal += 4000 + 10 * 160;
        specialPassTotal += 10;
      }
    }
    for (const rule of RULES) {
      if (rule.check(cur, opts)) {
        const reward = rule.getReward(cur, opts);
        dayTotal += reward.stellarJade + reward.specialPass * 160;
        specialPassTotal += reward.specialPass;
      }
    }
    cumulative += dayTotal;
    dailyBreakdown.push({ date: new Date(cur), jade: dayTotal, cumulative });

    if (cumulative >= remaining) {
      return {
        reached: true,
        date: cur,
        daysNeeded: i + 1,
        totalJade: currentTotal + cumulative,
        specialPassTotal,
        remaining,
        dailyBreakdown
      };
    }
    cur = addDays(cur, 1);
  }

  return {
    reached: false,
    date: null,
    daysNeeded: maxDays,
    totalJade: currentTotal + cumulative,
    specialPassTotal,
    remaining,
    dailyBreakdown
  };
}
