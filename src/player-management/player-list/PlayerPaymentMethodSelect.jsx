import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans, useLocale } from "../../i18n"
import Select, { SelectField } from "../../select/Select"
import { paymentMethodCodeLabel } from "../../payment/method/client"

export const PlayerPaymentMethodSelect = ({ paymentList = [], ...props }) => {
  let label = useTrans({
    zh: "支付方式",
    en: "Payment Method"
  })
  let defaultPlaceholder = useTrans({
    zh: "支付方式",
    en: "Payment Method"
  })

  let locale = useLocale()

  let options = toPaymentMethodOptions(locale, paymentList)

  return (
    <SelectField placeholder="" options={options} label={label} {...props} />
  )
}

const toPaymentMethodOptions = (locale, platformPaymentList = []) => {
  let methods = Object.values(
    platformPaymentList.reduce((acc, { methodcode }) => {
      acc[methodcode] = methodcode
      return acc
    }, {})
  )

  let options = methods.map((methodCode) => {
    let label = paymentMethodCodeLabel(locale, methodCode)
    return {
      label,
      value: methodCode
    }
  })

  return options
}
