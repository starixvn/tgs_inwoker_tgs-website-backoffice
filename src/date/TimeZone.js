import { utcToZonedTime } from "date-fns-tz"
import { Button } from "bumbag"
import { getTimeZones } from "@vvo/tzdb"
import { range } from "lodash-es"
import { SelectField } from "../select/Select"
import numeral from "numeral"
import { isValid } from "date-fns"
import { Trans } from "../i18n"

const SystemZoneOffset = 480

//TODO: memorize?
export const isClientTimeZoneSameAsSystemTimeZone = () => {
  let clientTimezoneOffset = -1 * new Date().getTimezoneOffset()
  return SystemZoneOffset === clientTimezoneOffset
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

  return utcToZonedTime(date, timeZone.name)
}

export const localTimeOffset = () => -1 * new Date().getTimezoneOffset()

export const TimezoneSelectField = ({
  name = "timezoneOffset",
  defaultValue = localTimeOffset(),
  ...props
} = {}) => {
  let from = -12
  let to = 13
  let ranges = range(from, to)
  let options = ranges.map((value) => {
    let formatted = numeral(value).format("+00")
    return {
      label: formatted,
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
