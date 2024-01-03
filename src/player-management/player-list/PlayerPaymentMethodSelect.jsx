import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans, useLocale } from "../../i18n"
import Select, { SelectField } from "../../select/Select"
import { paymentMethodCodeLabel } from "../../payment/method/client"
import { usePaymentMethodTrans } from "../../trans/Payment"

export const PlayerPaymentMethodSelect = ({
  placeholder,
  paymentList = [],
  ...props
}) => {
  let label = usePaymentMethodTrans()
  let defaultPlaceholder = usePaymentMethodTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()

  let options = toPaymentMethodOptions(locale, paymentList)

  return (
    <SelectField
      placeholder={placeholder}
      options={options}
      label={label}
      {...props}
    />
  )
}

const toPaymentMethodOptions = (locale, platformPaymentList = []) => {
  let methods = Object.values(
    platformPaymentList.reduce((acc, { methodCode }) => {
      acc[methodCode] = methodCode
      return acc
    }, {})
  )

  let options = methods.map((methodCode) => {
    let label = paymentMethodCodeLabel(locale, methodCode) ?? methodCode
    return {
      label,
      value: methodCode
    }
  })

  return options
}
