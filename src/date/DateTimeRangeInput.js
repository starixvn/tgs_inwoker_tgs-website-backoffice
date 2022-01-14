import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Group,
  Input,
  Box,
  Icon,
  Button,
  useToasts,
  useModalState,
  Dialog,
  FieldWrapper,
  FieldStack,
  Checkbox
} from "bumbag"
import { useForm, useFormContext, Controller } from "react-hook-form"
import "react-datepicker/dist/react-datepicker.css"
import { Trans, useLocale, useTrans } from "../i18n"
import DateTimeInput from "./DateTimeInput"
import { toDate } from "./toDate"
import { min, max } from "date-fns"
import { isValid, differenceInDays } from "date-fns"
import { DateDropdownMenu } from "./DateDropdownMenu"
import { mapObjIndexed } from "ramda"
import { isClientTimeZoneSameAsSystemTimeZone, toSystemTime } from "./TimeZone"
import { isDev, isFeatureEnabled, Features } from "../env"

export const DateInputRange = ({
  dateFormat = "yyyy/MM/dd",
  fakeTimeLabel = false,
  startProps = {},
  endProps = {},
  ...props
}) => {
  if (fakeTimeLabel) {
    startProps = {
      addonAfter: <Button isStatic>00:00:00</Button>,
      ...startProps
    }

    endProps = {
      addonAfter: <Button isStatic>23:59:59</Button>,
      ...endProps
    }
  }

  return (
    <DateTimeRangeInput
      dateFormat={dateFormat}
      showTimeInput={false}
      startProps={startProps}
      endProps={endProps}
      {...props}
    />
  )
}

export const DateInputRangeField = ({
  label,
  startProps,
  endProps,
  ...props
}) => {
  let startFieldName = startProps?.name ?? "start"
  let endFieldName = endProps?.name ?? "end"
  let formMethods = useFormContext()
  return (
    <FieldWrapper
      label={
        <FieldStack orientation="horizontal" alignY="center">
          {label}
          {formMethods && (startFieldName || endFieldName) && (
            <Button.Close
              size="small"
              onClick={() => {
                formMethods.setValue(startFieldName, "")
                formMethods.setValue(endFieldName, "")
              }}
            />
          )}
        </FieldStack>
      }
    >
      <DateInputRange startProps={startProps} endProps={endProps} {...props} />
    </FieldWrapper>
  )
}

export const DateTimeRangeInput = ({
  startProps,
  endProps,
  minDate,
  maxDate,
  validate,
  maxRangeDays,
  dateFormat,
  showTimeZoneDropdownMenu = false,
  showTimeInput = true,
  showDateDropdownMenu = false,
  required,
  disabled
} = {}) => {
  let startName = startProps?.name ?? "start"
  let endName = endProps?.name ?? "end"

  let formMethods = useFormContext()
  let start = toDate(formMethods?.watch(startName))
  let end = toDate(formMethods?.watch(endName))

  let startRules
  let endRules
  if (typeof validate === "function") {
    startRules = {
      validate: (start) => {
        return validate?.({ start, end })
      }
    }

    endRules = {
      validate: (end) => {
        return validate?.({ start, end })
      }
    }
  } else if (typeof validate === "object") {
    startRules = mapObjIndexed(
      (fn, key) => (start) => fn({ start, end }),
      validate
    )

    endRules = mapObjIndexed((fn, key) => (end) => fn({ start, end }), validate)
  }

  const toasts = useToasts()
  const hasRangeError = (name) =>
    formMethods?.formState?.errors?.[name]?.type === "range"

  let rangeError = hasRangeError(startName) || hasRangeError(endName)
  let rangeErrorTitle = useRangeErrorTitle(maxRangeDays)
  useEffect(() => {
    if (rangeError) {
      toasts.add({
        title: rangeErrorTitle
      })
    }
  }, [rangeError])

  return (
    <>
      <Group>
        {showDateDropdownMenu && (
          <DateDropdownMenu
            onClick={({ type, start, end }) => {
              formMethods?.setValue(startName, start)
              formMethods?.setValue(endName, end)
            }}
            css={css`
              button {
                border-radius: 0px;
                border-bottom-left-radius: 6px;
                border-top-left-radius: 6px;
              }
            `}
          />
        )}
        <DateTimeInput
          id={startProps?.id}
          name={startName}
          dateFormat={dateFormat}
          showTimeInput={showTimeInput}
          minDate={minDate}
          maxDate={startMaxDate([startProps?.maxDate, maxDate, end])}
          required={required}
          disabled={disabled}
          validate={
            Number.isInteger(maxRangeDays)
              ? {
                  range: (start) => {
                    let shallValidateRange =
                      isValid(start) &&
                      isValid(end) &&
                      Number.isInteger(maxRangeDays)
                    if (shallValidateRange) {
                      let pass = validateRange(maxRangeDays, start, end)
                      if (pass) {
                        formMethods.clearErrors(endName)
                      }
                      return pass
                    }
                  },
                  ...(startRules ?? {})
                }
              : startRules
          }
        />
        {startProps?.addonAfter}
        <Button isStatic tabIndex="-1">
          -
        </Button>
        <DateTimeInput
          id={endProps?.id}
          name={endName}
          dateFormat={dateFormat}
          showTimeInput={showTimeInput}
          minDate={endMinDate([endProps?.minDate, minDate, start])}
          maxDate={maxDate}
          required={required}
          disabled={disabled}
          validate={
            Number.isInteger(maxRangeDays)
              ? {
                  range: (end) => {
                    let shallValidateRange =
                      isValid(start) &&
                      isValid(end) &&
                      Number.isInteger(maxRangeDays)
                    if (shallValidateRange) {
                      let pass = validateRange(maxRangeDays, start, end)
                      if (pass) {
                        formMethods.clearErrors(startName)
                      }
                      return pass
                    }
                  },
                  ...(endRules ?? {})
                }
              : endRules
          }
        />
        {endProps?.addonAfter}
      </Group>
    </>
  )
}

const useRangeErrorTitle = (maxRangeDays) =>
  useTrans({
    zh: `间隔需小于 ${maxRangeDays} 天`,
    en: `Interval should be less than ${maxRangeDays} days`
  })

const validateRange = (maxRangeDays, start, end) => {
  if (Number.isInteger(maxRangeDays) && isValid(start) && isValid(end)) {
    let includeStartDay = 1
    let days = differenceInDays(end, start) + includeStartDay
    let pass = days <= maxRangeDays
    return pass
  }
}

const startMaxDate = (dates = []) => {
  dates = dates.filter(isValid)
  return min(dates)

  /*
    let validMaxDate = isValid(maxDate)
    let validEnd = isValid(end)
    if (validMaxDate && validEnd) {
        return min([maxDate, end])
    }

    if (validMaxDate) {
        return maxDate
    }

    return end
    */
}

const endMinDate = (dates = []) => {
  dates = dates.filter(isValid)
  return max(dates)

  /*
    let validMinDate = isValid(minDate)
    let validStart = isValid(start)
    if (validMinDate && validStart) {
        return max([minDate, start])
    }

    if (validMinDate) {
        return minDate
    }

    return start
    */
}

export default DateTimeRangeInput
