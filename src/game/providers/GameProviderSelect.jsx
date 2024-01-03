import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import Select from "../../select/Select"
import { Locales, Trans, useTrans } from "../../i18n"
import { useGameProviderList } from "./client"
import { useGameProviderTrans } from "../../trans/Game"

export const GameProviderSelect = ({
  placeholder,
  valueField = "id",
  ...props
}) => {
  let defaultPlaceholder = useGameProviderTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { data, isLoading, error } = useGameProviderList({
    showAll: true,
    sortby: "name"
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

export default GameProviderSelect
