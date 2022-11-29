import { isAfter as _isAfter } from "date-fns"
import { isValidDate } from "./isValidDate"
import { toDate } from "./toDate"

export const isAfter = (date, dateToCompare) => {
  date = toDate(date)
  if (!isValidDate(date)) {
    return false
  }

  dateToCompare = toDate(dateToCompare)
  if (!isValidDate(dateToCompare)) {
    return false
  }

  return _isAfter(date, dateToCompare)
}
