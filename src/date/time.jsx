import React, { useState, useEffect, useMemo, useRef } from "react"
import { useLocale, Locales } from "../i18n"
import { Select, SelectField, DropdownMenu, Button, Icon } from "bumbag"
import {
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  format,
  addMinutes,
  setHours,
  setMinutes
} from "date-fns"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { useForm, useFormContext } from "react-hook-form"

export const TimeIcon = () => <Icon icon={faClock} type="font-awesome" />

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

const rangeOptions = (
  start = startOfDay(new Date()),
  end = endOfDay(new Date()),
  minutes = 30
) => {
  let options = []
  while (isBefore(start, end)) {
    let time = formatHourMinute(start)
    options.push({
      label: time,
      value: time
    })

    start = addMinutes(start, minutes)
  }

  return options
}
