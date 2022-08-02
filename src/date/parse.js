import { parse } from "date-fns"

export const parseTimeOnly = (value = "") => {
  let format = "HH:mm:ss.SSSSSSS"
  let result = parse(value, format, new Date())
  return result
}
