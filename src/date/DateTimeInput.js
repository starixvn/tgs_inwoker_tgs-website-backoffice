import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Input, Box, Icon, Button, FieldWrapper } from "bumbag"
import DatePicker from "react-datepicker"
import { useLocale } from "../i18n"
import { useForm, useFormContext, Controller, useWatch } from "react-hook-form"
import format, { DateTimeFormat, formatDateTime } from "./format"
import { registerLocale, setDefaultLocale } from "react-datepicker"
import { isValid } from "date-fns"
import { zhCN } from "date-fns/locale"
import "./react-datepicker.css"

registerLocale("zh", zhCN)

export const DateTimeInput = ({
  id,
  name,
  required,
  value,
  dateFormat = DateTimeFormat,
  showTimeInput = true,
  disabled,
  minDate,
  maxDate,
  validate,
  ...props
}) => {
  let locale = useLocale()

  let formMethods = useFormContext()
  let {
    control,
    formState: { errors }
  } = formMethods

  const validDateRequired = (value) => {
    if (required) {
      return isValid(value)
    }
    return true
  }

  if (!validate) {
    validate = validDateRequired
  } else if (typeof validate === "object") {
    validate = {
      validDateRequired,
      ...validate
    }
  } else if (typeof validate === "function") {
    validate = {
      validDateRequired,
      validate
    }
  }

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={props?.defaultValue}
      rules={{
        required,
        validate
      }}
      shouldUnregister={true}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { invalid, isTouched, isDirty }
      }) => {
        if (disabled) {
          return (
            <Input
              defaultValue={formatDateTime(dateFormat, value)}
              disabled={disabled}
            />
          )
        }

        let error = errors[name]
        let state = error && "danger"
        return (
          <DatePicker
            selected={isValid(value) && value}
            dateFormat={dateFormat}
            onChange={onChange}
            onBlur={onBlur}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            customInput={
              <Input id={id} name={name} inputRef={ref} state={state} />
            }
            showTimeInput={showTimeInput}
            timeInputLabel=""
            {...props}
          />
        )
      }}
    />
  )
}

export default DateTimeInput
