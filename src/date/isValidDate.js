import { isDate, isValid } from "date-fns"

export const isValidDate = (value) => isDate(value) && isValid(value)
