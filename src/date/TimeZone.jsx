import {
  utcToZonedTime,
  zonedTimeToUtc as _zonedTimeToUtc,
  formatInTimeZone as _formatInTimeZone
} from "date-fns-tz/esm"
import { Button } from "bumbag"
import { getTimeZones } from "@vvo/tzdb"
import { range } from "lodash-es"
import { SelectField, Select } from "../select/Select"
import numeral from "numeral"
import { isValid } from "date-fns"
import { Trans } from "../i18n"
import { isValidDate } from "./isValidDate"

export const SystemZoneOffset = 480

//TODO: memorize?
export const isClientTimeZoneSameAsSystemTimeZone = () => {
  let clientTimezoneOffset = -1 * new Date().getTimezoneOffset()
  return SystemZoneOffset === clientTimezoneOffset
}

export const zonedTimeToUtc = (date, offset = SystemZoneOffset) => {
  if (!isValid(date)) {
    return date
  }

  let timeZone = getTimeZones({
    includeUtc: true
  }).find(({ currentTimeOffsetInMinutes, ...rest }) => {
    return currentTimeOffsetInMinutes == offset
  })

  let result = _zonedTimeToUtc(date, timeZone.name)
  return isValidDate(result) ? result : date
}

export const toZonedTime = (date, offset = SystemZoneOffset) => {
  if (!isValid(date)) {
    return date
  }

  let timeZone = getTimeZones({
    includeUtc: true
  }).find(({ currentTimeOffsetInMinutes, ...rest }) => {
    return currentTimeOffsetInMinutes == offset
  })

  let result = utcToZonedTime(date, timeZone.name)

  return isValidDate(result) ? result : date
}

export const formatInTimeZone = () => {}

export const localTimeOffset = () => -1 * new Date().getTimezoneOffset()

const timezoneOptions = () => {
  let timezones = getTimeZones({
    includeUtc: true
  }).reduce((accum, timezone) => {
    let timezoneIndex = accum.findIndex(
      (item) =>
        item.currentTimeOffsetInMinutes == timezone.currentTimeOffsetInMinutes
    )
    if (timezoneIndex < 0) {
      //not inside
      accum.push(timezone)
    }

    return accum
  }, [])

  return timezones.map((timezone) => {
    let label = timezone.currentTimeFormat.split(" ")[0]
    return {
      label,
      value: timezone.currentTimeOffsetInMinutes
    }
  })
}

const timezoneRange = (start, end) => {
  let ranges = range(start, end)

  if (end >= 6) {
    let index = ranges.findIndex((value) => value === 6)
    ranges.splice(index, 0, 5.5)
  }

  return ranges
}

const TimezoneNumberFormat = "+0[.]0"

export const TimezoneSelectField = ({
  name = "timezoneOffset",
  defaultValue = localTimeOffset(),
  prefix = "",
  rangeStart = -11,
  rangeEnd = 15,
  ...props
} = {}) => {
  let ranges = timezoneRange(rangeStart, rangeEnd)

  let options = ranges.map((value) => {
    let formatted = numeral(value).format(TimezoneNumberFormat)
    return {
      label: `${prefix}${formatted}`,
      value: value * 60
    }
  })

  return (
    <SelectField
      addonBefore={
        <Button isStatic>
          <Trans zh="時區" en="Timezone" />
        </Button>
      }
      name={name}
      options={options}
      defaultValue={defaultValue}
      {...props}
    />
  )
}

export const TimezoneSelect = ({
  prefix = "GMT",
  rangeStart = -11,
  rangeEnd = 14,
  ...props
} = {}) => {
  let ranges = timezoneRange(rangeStart, rangeEnd)

  let options = ranges.map((value) => {
    let formatted = numeral(value).format(TimezoneNumberFormat)
    return {
      label: `${prefix}${formatted}`,
      value: value * 60
    }
  })

  return <Select options={options} {...props} />
}
