import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Select, SelectField } from "../../select/Select"
import { Locales, Trans, useTrans } from "../../i18n"
import { useSubGameProviderList } from "./client"
import { useSubGameProviderTrans } from "../../trans/Game"

export const SubGameProviderSelect = ({
  placeholder,
  gameProviderId,
  valueField = "code",
  ...props
}) => {
  let defaultPlaceholder = useSubGameProviderTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { data, isLoading, error } = useSubGameProviderList({
    showAll: true,
    sortby: "code",
    gameProviderId
  })
  let options = data?.items.map((item) => ({
    label: item.name,
    value: item[valueField]
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

export const SubGameProviderSelectField = ({
  placeholder,
  gameProviderId,
  valueField = "code",
  ...props
}) => {
  let defaultPlaceholder = useSubGameProviderTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { data, isLoading, error } = useSubGameProviderList({
    showAll: true,
    sortby: "code",
    gameProviderId
  })
  let options = data?.items.map((item) => ({
    label: item.name,
    value: item[valueField]
  }))

  return (
    <SelectField
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export default SubGameProviderSelect
