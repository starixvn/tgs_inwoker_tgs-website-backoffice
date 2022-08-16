import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import Select from "../../select/Select"
import { Locales, Trans, useTrans } from "../../i18n"
import { useGameProviderGameList } from "./client"

//TODO: use react-select + virtual list?
export const GameSelect = ({
  gameProviderId,
  placeholder,
  valueField = "id",
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "游戏",
    en: "Game"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data, error } = useGameProviderGameList(
    gameProviderId
      ? {
          gameProviderId,
          showAll: true,
          sortby: "code"
        }
      : undefined
  )

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
