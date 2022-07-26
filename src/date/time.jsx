import React, { useState, useEffect, useMemo, useRef } from "react"
import { useLocale, Locales } from "../i18n"
import { SelectField, DropdownMenu, Button, Icon } from "bumbag"
import {
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  format,
  addMinutes,
  setHours,
  setMinutes,
  parse,
  isDate,
  isValid
} from "date-fns"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { SelectField as _SelectField, Select } from "../select/Select"
import { useForm, useFormContext } from "react-hook-form"
import { isValidDate } from "./isValidDate"

export const TimeIcon = () => <Icon icon={faClock} type="font-awesome" />

//TODO: rename file to TimeSelect.jsx
//TODO: replaced by TimeSelectField2
export const TimeSelectField = ({
  name,
  selectRef,
  required,
  min,
  max,
  addonBefore = (
    <Button isStatic>
      <TimeIcon />
    </Button>
  ),
  ...props
}) => {
  let minDate = hourMinuteToDate(min, startOfDay(new Date()))
  let maxDate = hourMinuteToDate(max, endOfDay(new Date()))
  let options = rangeOptions() //rangeOptions(minDate, maxDate)

  let { register, formState } = useFormContext()

  const validate = (value) => {
    if (value && minDate && !isAfter(hourMinuteToDate(value), minDate)) {
      return "min"
    }

    if (value && maxDate && !isBefore(hourMinuteToDate(value), maxDate)) {
      return "max"
    }
  }

  let formProps = {}
  if (!selectRef) {
    let { ref, ...rest } = register(name, { required, validate })
    formProps = rest
    selectRef = ref
  }

  let error = formState?.errors?.[name]
  let state = error && "danger"
  return (
    <SelectField
      options={options}
      addonBefore={addonBefore}
      state={state}
      selectRef={selectRef}
      {...formProps}
    />
  )
}

export const TimeSelectField2 = ({
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
  let options = rangeOptions({ min, max })

  return (
    <_SelectField
      options={options}
      validate={{
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
          value = parse(value, "HH:mm", new Date())
          return value
        },
        ...registerOptions
      }}
      addonBefore={addonBefore}
      {...props}
    />
  )
}

export const hourMinuteToDate = (value = "", defaultValue) => {
  if (value) {
    let [hours, minutes] = value.split(":")
    value = setHours(new Date(), parseInt(hours))
    value = setMinutes(value, parseInt(minutes))
    return value
  }
  return defaultValue
}

export const formatHourMinute = (date) => format(date, "HH:mm")

const rangeOptions = ({
  start = startOfDay(new Date()),
  end = endOfDay(new Date()),
  minutes = 30,
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

    start = addMinutes(start, minutes)
  }

  return options
}
