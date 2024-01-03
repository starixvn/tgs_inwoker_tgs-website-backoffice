import React from "react"
import { Spinner } from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { usePaymentChannelList } from "./client"
import { usePaymentChannelTrans } from "../../trans/Payment"

export const PaymentChannelSelect = ({
  placeholder,
  isLoadingRange,
  range,
  ...props
}) => {
  let defaultPlaceholder = usePaymentChannelTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let {
    isLoading: isLoadingPaymentChannelList,
    data,
    error
  } = usePaymentChannelList()

  let options = data
    ?.filter((item) => {
      if (range) {
        return range.includes(item.id)
      }
      return true
    })
    ?.map?.(({ trans, code, id }) => ({
      label: trans?.[locale] ?? code,
      value: id
    }))

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoadingPaymentChannelList || isLoadingRange}
      options={options}
      {...props}
    />
  )
}

export const PaymentChannelLabel = ({ value, showCode = false }) => {
  let locale = useLocale()
  let { isLoading, data, error } = usePaymentChannelList()
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
