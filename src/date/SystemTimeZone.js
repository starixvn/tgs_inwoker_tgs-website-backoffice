import { utcToZonedTime } from "date-fns-tz"
import { getTimeZones } from "@vvo/tzdb"

const SystemZoneOffset = 480

export const isClientTimeZoneSameAsSystemTimeZone = () => {
  let clientTimezoneOffset = -1 * new Date().getTimezoneOffset()
  return SystemZoneOffset === clientTimezoneOffset
}

//TODO: memorize
export const toSystemTimeZone = (date) => {
  let systemTimeZone = getTimeZones({
    includeUtc: true
  }).find(({ currentTimeOffsetInMinutes }) => {
    return currentTimeOffsetInMinutes == SystemZoneOffset
  })

  let systemTime = utcToZonedTime(date, systemTimeZone.name)
  return systemTime
}

//TODO: toggle system time zone <-> client time zone
export const SystemTimeZoneDropdownMenu = () => {}
