import { parse } from "date-fns"

export const parseHourMinute = (value = "") => {
  let format = "HH:mm"
  let result = parse(value, format, new Date())
  return result
}

export const parseTimeOnly = (value = "") => {
  let format = "HH:mm:ss.SSSSSSS"
  let result = parse(value, format, new Date())
  return result
}
