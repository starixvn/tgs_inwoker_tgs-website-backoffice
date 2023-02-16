import React from "react"
import { Spinner } from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { usePaymentMethodList } from "./client"

export const PaymentMethodBankTypeSelect = ({
  placeholder,
  brandId,
  range = [],
  isLoading,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "支付类型",
    en: "Payment Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let {
    isLoading: isLoadingPaymentMethodList,
    data,
    error
  } = usePaymentMethodList()

  let options = data
    ?.filter((item) => {
      if (range?.length > 0) {
        return range.includes(item.id)
      }
      return true
    })
    ?.map(({ trans, code, bankType }) => ({
      label: trans?.[locale] ?? code,
      value: bankType
    }))

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading || isLoadingPaymentMethodList}
      options={options}
      {...props}
    />
  )
}
