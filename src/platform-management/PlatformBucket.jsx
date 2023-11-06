import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useLocale, useTrans } from "../i18n"
import { Select, SelectField } from "../select/Select"
import { MultiSelect } from "../select/MultiSelect"
import { usePlatformBucketList } from "./client"

const MainTrans = {
  zh: "全部",
  en: "All"
}

const LiveDealerTrans = {
  zh: "真人",
  en: "Live Dealer"
}

const SportsTrans = {
  zh: "体育",
  en: "Sports"
}

const EGameTrans = {
  zh: "电子",
  en: "EGame"
}

const CardGameTrans = {
  zh: "棋牌",
  en: "Card Game"
}

const VirtualSportsTrans = {
  zh: "虚拟体育",
  en: "Virtual Sports"
}

const LotteryTrans = {
  zh: "彩票",
  en: "Lottery"
}

const AllTrans = [
  ["", MainTrans],
  ["LiveDealer", LiveDealerTrans],
  ["Sportsbook", SportsTrans],
  ["Slot", EGameTrans],
  ["CardGame", CardGameTrans],
  ["VirtualSports", VirtualSportsTrans],
  ["Lottery", LotteryTrans]
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
  return trans?.[locale] ?? type
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
  let defaultPlaceholder = useTrans(MainTrans)
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data: items, error } = usePlatformBucketList(platformId)

  let options = items
    ?.map((type) => {
      let trans = findTrans(type)
      return {
        value: type,
        label: trans[locale] ?? type
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

export const PlatformBucketSelectField = (props) => (
  <PlatformBucketSelect as={SelectField} {...props} />
)

/*
export const PlatformBucketMultiSelect = (props) => (
  <PlatformBucketSelect as={MultiSelect} isMulti={true} {...props} />
)
*/
