import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Button, Input } from "bumbag"
import { Select, SelectField } from "../../select/Select"
import { Locales, Trans, useTrans } from "../../i18n"
import { useGameProviderGameList } from "./client"
import { useFormContext } from "react-hook-form"

//TODO: use react-select + virtual list?
export const GameSelectField = ({
  name,
  gameProviderId,
  placeholder,
  valueField = "id",
  filter: predicate = (game) => true,
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

  let options = data?.items?.filter(predicate).map((item) => ({
    label: item.name,
    value: item[valueField]
  }))

  return (
    <SelectField
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      name={name}
      {...props}
    />
  )
}
