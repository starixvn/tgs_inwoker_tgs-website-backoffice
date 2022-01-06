import { isValid, addDays, parseISO, startOfDay } from "date-fns"

export const startOfNextDay = (value) => {
  let date = value
  if (typeof value === "string") {
    let parsed = parseISO(value)
    if (isValid(parsed)) {
      date = parsed
    }
  }

  if (isValid(date)) {
    let nextDay = addDays(value, 1)
    return startOfDay(nextDay)
  }

  return value
}
