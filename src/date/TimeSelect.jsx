import React, { useState, useEffect, useMemo, useRef } from "react"
import { useLocale, Locales } from "../i18n"
import { Button, Icon } from "bumbag"
import {
  startOfDay,
  endOfDay,
  isBefore,
  addMinutes,
  getHours,
  getMinutes,
  setHours,
  setMinutes
} from "date-fns"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { SelectField, Select } from "../select/Select"
import { isValidDate } from "./isValidDate"
import { parseHourMinute } from "./parse"
import { formatHourMinute } from "./format"
import { useFormContext, useWatch } from "react-hook-form"

export const TimeIcon = () => <Icon icon={faClock} type="font-awesome" />

export const TimeSelectField = ({
  interval,
  required,
  min,
  max,
  registerOptions = {},
  addonBefore = (
    <Button isStatic>
      <TimeIcon />
    </Button>
  ),
  ...props
}) => {
  min = normalizeDate(min)
  max = normalizeDate(max)
  let options = rangeOptions({ interval, min, max })

  return (
    <SelectField
      options={options}
      validate={{
        required: (value) => {
          if (required) {
            let pass = isValidDate(value)
            return pass
          }
          return true //pass
        },
        min: (value) => {
          if (isValidDate(value) && isValidDate(min)) {
            let pass = isBefore(min, value)
            return pass
          }
          return true //pass
        },
        max: (value) => {
          if (isValidDate(value) && isValidDate(max)) {
            let pass = isBefore(value, max)
            return pass
          }
          return true //pass
        }
      }}
      registerOptions={{
        setValueAs: (value = "") => {
          value = parseHourMinute(value)
          return value
        },
        ...registerOptions
      }}
      addonBefore={addonBefore}
      {...props}
    />
  )
}

const normalizeDate = (value) => {
  value = typeof value === "string" ? parseHourMinute(value) : value
  if (isValidDate(value)) {
    let hours = getHours(value)
    let minutes = getMinutes(value)

    let date = setHours(new Date(), hours)
    date = setMinutes(date, minutes)
    return date
  }
  return value
}

const rangeOptions = ({
  start = startOfDay(new Date()),
  end = endOfDay(new Date()),
  interval = 30,
  min,
  max
} = {}) => {
  let options = []
  while (isBefore(start, end)) {
    let time = formatHourMinute(start)
    let option = {
      label: time,
      value: time
    }

    if (isValidDate(min) && isBefore(start, min)) {
      option.disabled = true
    }

    if (isValidDate(max) && isBefore(max, start)) {
      option.disabled = true
    }

    options.push(option)

    start = addMinutes(start, interval)
  }

  return options
}
