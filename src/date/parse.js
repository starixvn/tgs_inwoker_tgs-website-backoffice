import { parse } from "date-fns"

export const parseTimeOnly = (value = "") => {
  let format = "HH:mm:ss.SSSS"
  let result = parse(value, format, new Date())
  return result
}
