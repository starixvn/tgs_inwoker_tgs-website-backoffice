import {
  startOfYesterday,
  endOfYesterday,
  subWeeks,
  startOfToday,
  endOfToday
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
  let start = subWeeks(1, end)

  return {
    start,
    end
  }
}
