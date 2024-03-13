import React, { useState } from "react"
import { Spinner, DropdownMenu, Button } from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../i18n"
import Select from "../select/Select"
import { usePaymentList } from "./client"
import { PaymentProviderTrans } from "../trans/Payment"

const Manual = "Manual"

export const isManualPaymentProvider = (v) => v === Manual

const defaultPredicate = () => true

export const PaymentProviderDropdownMenu = ({
  filter: predicate = defaultPredicate,
  onChange,
  children = <PaymentProviderTrans />,
  ...props
}) => {
  let { isLoading, data, error } = usePaymentList()

  let menu = data?.filter(predicate)?.map((paymentProvider) => {
    let { trans, code } = paymentProvider
    return (
      <DropdownMenu.Item
        key={code}
        onClick={() => {
          onChange(code)
        }}
      >
        {trans ? <Trans {...trans} /> : code}
      </DropdownMenu.Item>
    )
  })
  return (
    <DropdownMenu menu={menu}>
      <Button
        iconAfter="chevron-down"
        isLoading={isLoading}
        disabled={isLoading}
        {...props}
      >
        {children}
      </Button>
    </DropdownMenu>
  )
}

export const PaymentProviderSelect = ({
  placeholder,
  valueField = "id",
  filter: predicate = defaultPredicate,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "支付厂商",
    en: "Payment Provider"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data, error } = usePaymentList()

  let options = data?.filter(predicate)?.map((item) => {
    let { trans, code, id } = item
    return {
      label: trans?.[locale] ?? code,
      value: item[valueField]
    }
  })

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export const PaymentProviderLabel = ({ value, showCode = false }) => {
  let locale = useLocale()
  let { isLoading, data, error } = usePaymentList()
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
