import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Input, Box, Icon, Button, FieldWrapper } from "bumbag"
import DatePicker from "react-datepicker"
import { useLocale } from "../i18n"
import { useForm, useFormContext, Controller, useWatch } from "react-hook-form"
import format, { DateTimeFormat, formatDateTime } from "./format"
import { isValid } from "date-fns"
import { zhCN } from "date-fns/locale"
import "./react-datepicker.css"

//TODO: test dateFormat
export const DateMonthInput = ({
  id,
  name,
  dateFormat = "yyyy/MM",
  minDate,
  maxDate,
  placeholder,
  disabled,
  required,
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
          <Box>
            <DatePicker
              showMonthYearPicker
              selected={isValid(value) && value}
              dateFormat={dateFormat}
              onChange={onChange}
              onBlur={onBlur}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText={placeholder}
              locale={locale}
              customInput={
                <Input id={id} name={name} inputRef={ref} state={state} />
              }
              timeInputLabel=""
              {...props}
            />
          </Box>
        )
      }}
    />
  )
}
