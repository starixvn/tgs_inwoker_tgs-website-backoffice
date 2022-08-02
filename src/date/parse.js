import { parse } from "date-fns"

export const parseTimeOnly = (value = "") => {
  let format = "HH:mm:ss"
  let result = parse(value, format, new Date())
  console.log("result", result)
  return result
}
