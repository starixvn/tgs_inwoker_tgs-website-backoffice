import {
  startOfYesterday,
  endOfYesterday,
  subWeeks,
  startOfToday,
  endOfToday,
  subMonths,
  startOfMonth,
  endOfMonth
} from "date-fns"

export const yesterday = () => {
  return {
    start: startOfYesterday(),
    end: endOfYesterday()
  }
}

export const today = () => {
  return {
    start: startOfToday(),
    end: endOfToday()
  }
}

export const pastWeek = () => {
  let end = new Date()
  let start = subWeeks(end, 1)

  return {
    start,
    end
  }
}

export const lastMonth = () => {
  let lastMonth = subMonths(new Date(), 1)
  let start = startOfMonth(lastMonth)
  let end = endOfMonth(lastMonth)

  return {
    start,
    end
  }
}
