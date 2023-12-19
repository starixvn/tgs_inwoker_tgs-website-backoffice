import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Select } from "../../select/Select"
import { Trans, useTrans } from "../../i18n"

const Add = "Add"
const Deduct = "Deduct"

export const FundAction = {
  Add,
  Deduct
}

export const isAddFund = (v) => v === Add
export const isDeductFund = (v) => v === Deduct

const AddFund = {
  zh: "上分",
  en: "Add Fund"
}
const useAddFundTrans = () => useTrans(AddFund)

const DeductFund = {
  zh: "下分",
  en: "Deduct Fund"
}
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
  defaultValue = TxType.Add,
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
      value: TxType.Add
    },
    {
      label: useDeductFundTrans(),
      value: TxType.Deduct
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
