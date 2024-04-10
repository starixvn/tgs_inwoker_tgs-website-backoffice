import React from "react"
import { css, Global } from "@emotion/react"
import { Text, Set } from "bumbag"

import { formatDateTime } from "../../date/format"
import textColumn from "./textColumn"

const DefaultDateFormat = "yyyy/MM/dd"
const DefaultTimeFormat = "HH:mm:ss"

export const dateTimeColumn = ({
  dateFormat = DefaultDateFormat,
  timeFormat = DefaultTimeFormat,
  whiteSpace = "nowrap",
  placeholder = "",
  toValue,
  ...props
}) =>
  textColumn({
    Cell: ({ value = "" } = {}) => {
      value = toValue ? toValue(value) : value
      let formattedDate = dateFormat ? formatDateTime(dateFormat, value) : ""
      let formattedTime = timeFormat ? formatDateTime(timeFormat, value) : ""
      return (
        <Set orientation="vertical" alignX="center" spacing="minor-1">
          {formattedDate && (
            <Text.Block data-type="date" fontSize={{ default: "14px" }}>
              {formattedDate}
            </Text.Block>
          )}
          {formattedTime && (
            <Text.Block data-type="time" fontSize={{ default: "14px" }}>
              {formattedTime}
            </Text.Block>
          )}
          {!formattedDate && !formattedTime && placeholder}
        </Set>
      )
    },
    whiteSpace,
    ...props
  })

export default dateTimeColumn
