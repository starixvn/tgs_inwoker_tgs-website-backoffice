import { isValid, addHours, parseISO, startOfHour } from "date-fns"

export const startOfNextHour = (value) => {
  let date = value
  if (typeof value === "string") {
    let parsed = parseISO(value)
    if (isValid(parsed)) {
      date = parsed
    }
  }

  if (isValid(date)) {
    let nextDay = addHours(value, 1)
    return startOfHour(nextDay)
  }

  return value
}
