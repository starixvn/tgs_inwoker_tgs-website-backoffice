import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { DateTimeInput } from "./DateTimeInput"
import { Format } from "./format"

export const DateInput = ({
  dateFormat = Format.Date,
  showTimeInput = false,
  ...props
}) => {
  return (
    <DateTimeInput
      dateFormat={dateFormat}
      showTimeInput={showTimeInput}
      {...props}
    />
  )
}
