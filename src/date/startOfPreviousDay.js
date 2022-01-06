import { isValid, subDays, parseISO, startOfDay } from "date-fns"

export const startOfPreviousDay = (value) => {
  let date = value
  if (typeof value === "string") {
    let parsed = parseISO(value)
    if (isValid(parsed)) {
      date = parsed
    }
  }

  if (isValid(date)) {
    let prevDay = subDays(value, 1)
    return startOfDay(prevDay)
  }

  return value
}
