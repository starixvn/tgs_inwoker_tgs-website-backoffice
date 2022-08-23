import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans, useLocale } from "../../i18n"
import Select, { SelectField } from "../../select/Select"
import { usePlayerPromotionList } from "./client"

export const PlayerPromotionSelect = ({
  name = "promotionId",
  brandId,
  playerCode,
  ...props
}) => {
  let label = useTrans({
    zh: "活动",
    en: "Promotion"
  })
  let defaultPlaceholder = useTrans({
    zh: "活动",
    en: "Promotion"
  })

  let {
    isLoading,
    data: promotionList,
    error
  } = usePlayerPromotionList({
    brandId,
    playerCode
  })

  let options = promotionList?.map(({ id, name }) => {
    return {
      label: name,
      value: id
    }
  })

  return (
    <SelectField
      name={name}
      placeholder=""
      isLoading={isLoading}
      options={options}
      label={label}
      {...props}
    />
  )
}
