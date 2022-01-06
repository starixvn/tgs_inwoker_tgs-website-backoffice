import { parseISO, isValid, toDate as dateOf } from "date-fns"

export const toDate = (value) => {
  let date = undefined
  if (typeof value === "string") {
    date = parseISO(value)
  } else {
    date = dateOf(value)
  }

  if (isValid(date)) {
    return date
  }

  return undefined
}
