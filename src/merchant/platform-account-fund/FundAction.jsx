import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Select } from "../../select/Select"
import { Trans, useTrans } from "../../i18n"

const Credit = "Credit"
const Debit = "Deduct"

export const FundAction = {
  Add: Credit,
  Deduct: Debit
}

export const isAddFund = (v) => v === Credit
export const isDeductFund = (v) => v === Debit

const AddFund = {
  zh: "上分",
  en: "Add Fund"
}
const AddFundTrans = () => <Trans {...AddFund} />
const useAddFundTrans = () => useTrans(AddFund)

const DeductFund = {
  zh: "下分",
  en: "Deduct Fund"
}
const DeductFundTrans = () => <Trans {...DeductFund} />
const useDeductFundTrans = () => useTrans(DeductFund)

const TypeActionField = "type"

export const useFundAction = (name = TypeActionField) => {
  let { control } = useFormContext()
  let value = useWatch({
    control,
    name
  })
  return value
}

export const FundActionSelect = ({
  name = TypeActionField,
  defaultValue = Credit,
  required = true,
  placeholder,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useAddFundTrans(),
      value: Credit
    },
    {
      label: useDeductFundTrans(),
      value: Debit
    }
  ]

  return (
    <Select
      name={name}
      options={options}
      defaultValue={defaultValue}
      required={required}
      placeholder={placeholder}
      {...props}
    />
  )
}

export const FundActionLabel = ({ value = "" }) => {
  switch (value) {
    case Credit:
      return <AddFundTrans />
    case Debit:
      return <DeductFundTrans />
    default:
      return value
  }
}
