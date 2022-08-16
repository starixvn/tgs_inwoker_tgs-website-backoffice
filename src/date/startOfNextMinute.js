import { isValid, addMinutes, parseISO, startOfMinute } from "date-fns"

export const startOfNextMinute = (value) => {
  let date = value
  if (typeof value === "string") {
    let parsed = parseISO(value)
    if (isValid(parsed)) {
      date = parsed
    }
  }

  if (isValid(date)) {
    let nextDay = addMinutes(value, 1)
    return startOfMinute(nextDay)
  }

  return value
}
