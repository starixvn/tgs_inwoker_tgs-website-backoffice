import { utcToZonedTime } from "date-fns-tz"
import { getTimeZones } from "@vvo/tzdb"
import { range } from "lodash-es"
import { Select } from "../select/Select"
import numeral from "numeral"

const SystemZoneOffset = 480

//TODO: memorize?
export const isClientTimeZoneSameAsSystemTimeZone = () => {
  let clientTimezoneOffset = -1 * new Date().getTimezoneOffset()
  return SystemZoneOffset === clientTimezoneOffset
}

export const toSystemTime = (date) => {
  let systemTimeZone = getTimeZones({
    includeUtc: true
  }).find(({ currentTimeOffsetInMinutes }) => {
    return currentTimeOffsetInMinutes == SystemZoneOffset
  })

  let systemTime = utcToZonedTime(date, systemTimeZone.name)
  return systemTime
}

export const TimeZoneSelect = (props = {}) => {
  let from = -12
  let to = 13
  let ranges = range(from, to)
  let options = ranges.map((value) => {
    let formatted = numeral(value).format("+00")
    return {
      label: formatted,
      value: formatted
    }
  })

  return <Select options={options} {...props} />
}
