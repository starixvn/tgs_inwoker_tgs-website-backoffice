import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { SelectMenu } from "bumbag"
import { Select } from "../select/Select"
import { useLicensee } from "../merchant/licensees/client"
import { useFormContext, useWatch } from "react-hook-form"
import { useTrans } from "../i18n"
import { sortBy } from "lodash-es"
import { MultiSelect } from "../select/MultiSelect"

export const LicenseeMultiCurrencySelect = ({
  placeholder,
  licenseeId,
  ...props
}) => {
  let formMethods = useFormContext()
  let defaultPlaceholder = useTrans({
    zh: "选择币种",
    en: "Select Currency"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data: licensee, error } = useLicensee(licenseeId)
  let options =
    licensee?.currencies?.map(({ code, name }) => ({
      label: code,
      value: code
    })) ?? []

  options = sortBy(options, ["label"])

  return (
    <MultiSelect
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}
