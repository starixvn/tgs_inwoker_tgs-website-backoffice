import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../select/Select"

const OneLayer = "OneLayer"
const OneLayerTrans = {
  zh: "單一分紅制",
  en: "Dividend"
}

const MultipleLayer = "MultipleLayer"
const MultipleLayerTrans = {
  zh: "階梯式分紅制",
  en: "Tier-based Dividend"
}

export const AgentProfitSharingTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "分紅模式",
    en: "Profit Sharing Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(OneLayerTrans),
      value: OneLayer
    },
    {
      label: useTrans(MultipleLayerTrans),
      value: MultipleLayer
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const AgentProfitSharingTypeLabel = ({ value = "" }) => {
  switch (value) {
    case OneLayer:
      return <Trans {...OneLayerTrans} />
    case MultipleLayer:
      return <Trans {...MultipleLayerTrans} />
    default:
      return value
  }
}

export const isAgentProfitSharingOneLayer = (value) => value === OneLayer

export const isAgentProfitSharingMultipleLayer = (value) =>
  value === MultipleLayer
