import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Input, Box, Icon, Button, FieldWrapper } from "bumbag"
import { useLocale } from "../i18n"
import { useForm, useFormContext, Controller, useWatch } from "react-hook-form"
import { isValid } from "date-fns"
import { DateTimeInput } from "./DateTimeInput"
import format, { DateTimeFormat, formatDateTime } from "./format"

export const TimeInput = ({
  timeIntervals = 15,
  timeCaption = "",
  dateFormat = "HH:mm",
  ...props
}) => {
  return (
    <DateTimeInput
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={timeIntervals}
      dateFormat={dateFormat}
      {...props}
    />
  )
}
