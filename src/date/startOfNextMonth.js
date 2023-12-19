import { isValid, addDays, parseISO, startOfDay, addMonths } from "date-fns"

export const startOfNextMonth = (value) => {
  let date = value
  if (typeof value === "string") {
    let parsed = parseISO(value)
    if (isValid(parsed)) {
      date = parsed
    }
  }

  if (isValid(date)) {
    let nextMonth = addMonths(value, 1)
    return startOfDay(nextMonth)
  }

  return value
}
