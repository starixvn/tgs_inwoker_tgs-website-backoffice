import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { SelectMenu } from "bumbag"
import { Select } from "../select/Select"
import { useReseller } from "../merchant/resellers/client"
import { useFormContext, useWatch } from "react-hook-form"
import { useTrans } from "../i18n"
import { sortBy } from "lodash-es"

export const ResellerCurrencySelect = ({
  placeholder,
  resellerId,
  ...props
}) => {
  let formMethods = useFormContext()
  let defaultPlaceholder = useTrans({
    zh: "选择币种",
    en: "Select Currency"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data: reseller, error } = useReseller(resellerId)
  let options =
    reseller?.currencies?.map(({ code, name }) => ({
      key: code,
      label: code,
      value: code
    })) ?? []

  options = sortBy(options, ["label"])

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}
