import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useLocale, useTrans } from "../i18n"
import { Select } from "../select/Select"
import { usePlatformBucketList } from "./client"
import {
  LiveDealer,
  Sportsbook,
  CardGame,
  VirtualSports,
  Lottery,
  EGame
} from "../trans/Game"
import { Default } from "../trans/Field"

const AllTrans = [
  ["", Default],
  ["LiveDealer", LiveDealer],
  ["Sportsbook", Sportsbook],
  ["Slot", EGame],
  ["CardGame", CardGame],
  ["VirtualSports", VirtualSports],
  ["Lottery", Lottery]
]

const findTrans = (value = "") => {
  let [_, trans] =
    AllTrans.find(([key, trans]) => {
      if (key === value) {
        return true
      }
    }) ?? []
  return trans
}

export const usePlatformBucketLabel = (type = "") => {
  let locale = useLocale()
  let trans = findTrans(type)
  let DefaultLocale = Locales.en
  return trans?.[locale] ?? trans?.[DefaultLocale] ?? type
}

export const PlatformBucketLabel = ({ value = "" }) => {
  let label = usePlatformBucketLabel(value)
  return label ?? value
}

const DefaultFilter = () => true

export const PlatformBucketSelect = ({
  platformId,
  as: As = Select,
  placeholder,
  filter: predicate = DefaultFilter,
  ...props
}) => {
  let defaultPlaceholder = useTrans(Default)
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data: items, error } = usePlatformBucketList(platformId)

  let DefaultLocale = Locales.en
  let options = items
    ?.map((type) => {
      let trans = findTrans(type)
      return {
        value: type,
        label: trans[locale] ?? trans[DefaultLocale] ?? type
      }
    })
    .filter(predicate)

  return (
    <As
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

/*
TODO
export const PlatformBucketMultiSelect = (props) => (
  <PlatformBucketSelect as={MultiSelect} isMulti={true} {...props} />
)
*/

//TODO: test
/*
export const PlatformBucketMultiSelect = (props) => {
  let options = [
    {
      label: "不指定",
      value: ""
    },
    {
      label: "真人",
      value: "LiveDealer"
    },
    {
      label: "老虎機",
      value: "Slot"
    }
  ]

  return <SelectField defaultValue="" options={options} {...props} />
}
*/
