import React from "react"
import { Spinner } from "bumbag"
import { getTrans, Locales, Trans, useLocale, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { usePaymentMethodList } from "./client"
import { usePaymentMethodTrans } from "../../trans/Payment"

export const PaymentMethodSelect = ({ range, placeholder, ...props }) => {
  let defaultPlaceholder = usePaymentMethodTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data, error } = usePaymentMethodList()

  let DefaultLocal = Locales.en
  let options = data
    ?.filter((item) => {
      if (range) {
        return range.includes(item.id)
      }
      return true
    })
    .map(({ trans, code, id }) => ({
      label: trans?.[locale] ?? trans?.[DefaultLocal] ?? code,
      value: id
    }))

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export const PaymentMethodLabel = ({ value, showCode = false }) => {
  let locale = useLocale()
  let { isLoading, data, error } = usePaymentMethodList()
  if (isLoading) {
    return ""
  }

  let method = data?.find((item) => {
    return item.id === value
  })

  if (showCode) {
    return method?.code ?? ""
  }

  return method?.trans?.[locale] ?? method?.code ?? ""
}
