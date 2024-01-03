import { parseISO, format, isValid } from "date-fns"
import { useLocale, Locales } from "../i18n"

export const DateFormat = {
  Date: "yyyy/MM/dd",
  Time: "HH:mm:ss",
  YearMonth: "yyyy/MM"
}

export const DateTimeFormat = `${DateFormat.Date} ${DateFormat.Time}`

export const useFormattedTimeString = (value) => {
  let date = new Date(value)
  return isValid(date) ? format(date, `HH:mm`) : ""
}

const DefaultDateTimeFormat = `${DateFormat.Date} ${DateFormat.Time}`
export const formatDateTime = (dateFormat = DefaultDateTimeFormat, value) => {
  if (!value) {
    return ""
  }

  let date = typeof value == "string" ? parseISO(value) : value

  return isValid(date) ? format(date, dateFormat) : ""
}

export const defaultFormatDateTime = (value) =>
  formatDateTime(DefaultDateTimeFormat, value)

export const defaultFormatDate = (value) =>
  formatDateTime(DateFormat.Date, value)

export const formatYearMonthDay = (value) =>
  formatDateTime(DateFormat.Date, value)

//TODO: move to DateFormat
export const DayMonthYearFormat = "dd/MM/yyyy"

export const formatDayMonthYear = (value) =>
  formatDateTime(DayMonthYearFormat, value)

export const HourMinuteSecondDayMonthYear = `${DateFormat.Time} ${DayMonthYearFormat}`
export const formatHourMinuteSecondDayMonthYear = (value) =>
  formatDateTime(HourMinuteSecondDayMonthYear, value)

//TODO: mv to DateFormat
export const HourMinute = "HH:mm"
export const formatHourMinute = (value) => formatDateTime(HourMinute, value)

//TODO: mv to DateFormat
const DateOnlyFormat = "yyyy-MM-dd"
export const formatDateOnly = (value) => formatDateTime(DateOnlyFormat, value)

export default defaultFormatDateTime
