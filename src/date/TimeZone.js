import { utcToZonedTime } from "date-fns-tz"
import { getTimeZones } from "@vvo/tzdb"

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

//TODO: toggle system time zone <-> client time zone
export const TimeZoneDropdownMenu = () => {}
