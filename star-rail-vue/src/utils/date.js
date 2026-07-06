/**
 * Date utility functions
 */

export function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate()
}

export function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000)
}

export function isPast(d) {
  return d < startOfDay(new Date())
}

export function isToday(d) {
  return isSameDay(d, new Date())
}

export function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function dateKey(d) {
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}
