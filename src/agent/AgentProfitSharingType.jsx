import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../select/Select"

//TODO: move to trans/ ?
const OneLayer = "OneLayer"
const OneLayerTrans = {
  zh: "單一分紅制",
  en: "Fixed period Revshare"
}

const MultipleLayer = "MultipleLayer"
const MultipleLayerTrans = {
  zh: "階梯式分紅制",
  en: "Tiered RevShare"
}

const OnePercentage = " OnePercentage"
const OnePercentageTrans = {
  zh: "全民代理(混合式)",
  en: "All Agent-Hybrid"
}

export const isAgentProfitSharingOneLayer = (value) => value === OneLayer

export const isAgentProfitSharingMultipleLayer = (value) =>
  value === MultipleLayer

export const isAgentProfitSharingTypeGroup = (value) =>
  isAgentProfitSharingOneLayer(value) ||
  isAgentProfitSharingMultipleLayer(value)

export const isAllAgentHybrid = (value) => value === OnePercentage

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
    },
    {
      label: useTrans(OnePercentageTrans),
      value: OnePercentage
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
    case OnePercentage:
      return <Trans {...OnePercentageTrans} />
    default:
      return value
  }
}
