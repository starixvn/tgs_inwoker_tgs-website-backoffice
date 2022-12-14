import React from "react"
import { css, Global } from "@emotion/react"
import { Text, Tooltip } from "bumbag"
import { FormattedNumber, FormattedNumberDecimal } from "../../i18n"
import { sumColumn, sumColumnValue } from "../sumColumn"

const DefaultNumberFormat = "0,0"

const defaultValueFn = (value) => value

export const numberColumn = ({
  Cell,
  format = DefaultNumberFormat,
  digits,
  postfix = "",
  sumColumn: sumColumnName = "",
  toValue = defaultValueFn,
  whiteSpace = "nowrap",
  tooltip,
  ...props
}) => {
  const DefaultCell = ({ value }) => (
    <FormattedNumber
      value={toValue(value)}
      format={format}
      digits={digits}
      postfix={postfix}
      title={tooltip}
    />
  )

  Cell = Cell ?? DefaultCell
  let basic = {
    Cell,
    headCell: {
      textAlign: "center"
    },
    cell: {
      textAlign: "center",
      whiteSpace
    }
  }

  if (sumColumnName) {
    basic = {
      ...basic,
      Footer: (table) => {
        return (
          <FormattedNumber
            value={sumColumnValue(sumColumnName, toValue, table.rows)}
            format={format}
            digits={digits}
          />
        )
      },
      footerCellProps: {
        textAlign: "center"
      }
    }
  }

  return {
    ...basic,
    ...props
  }
}

const DefaultNumberDecimal = "0,0.00"
export const numberDecimalColumn = ({
  format = DefaultNumberDecimal,
  digits = 2,
  ...props
}) => numberColumn({ format, digits, ...props })

export const coloredNumberDecimalColumn = ({
  value,
  format = DefaultNumberDecimal,
  digits = 2,
  postfix,
  ...props
}) =>
  numberDecimalColumn({
    format,
    Cell: ({ value }) => {
      let isPositive = value >= 0
      return (
        <Text color={isPositive ? "success" : "danger"}>
          <FormattedNumberDecimal
            value={value}
            digits={digits}
            format={format}
            postfix={postfix}
          />
        </Text>
      )
    },
    ...props
  })

export const numberDecimalPercentageColumn = ({
  format = DefaultNumberDecimal,
  digits = 2,
  postfix = "%",
  ...props
}) => numberColumn({ format, digits, postfix, ...props })

export default numberColumn
