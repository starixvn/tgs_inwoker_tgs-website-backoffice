import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack
} from "bumbag"
import { useTrans } from "../i18n"
import Select from "../select/Select"
import { useIsDisplayMenuByRoute } from "../user/context"
import { SystemReportType } from "./balance-adjustment/menu"

export const Company = "Company"
const CompanyTrans = {
  zh: "公司",
  en: "Company"
}

export const Agent = "Agent"
const AgentTrans = {
  zh: "代理",
  en: "Agent"
}

export const System = "System"
const SystemTrans = {
  zh: "系統",
  en: "System"
}

export const usePlayerAdjustBalanceTypeOptionList = () => {
  let options = [
    {
      label: useTrans(CompanyTrans),
      value: Company
    },
    {
      label: useTrans(AgentTrans),
      value: Agent
    },
    {
      label: useTrans(SystemTrans),
      value: System
    }
  ]

  return options
}

export const PlayerAdjustBalanceTypeLabel = ({ value }) => {
  switch (value) {
    case Company:
      return <Trans {...CompanyTrans} />
    case Agent:
      return <Trans {...AgentTrans} />
    case System:
      return <Trans {...SystemTrans} />
    default:
      return null
  }
}

export const PlayerAdjustBalanceTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let hasSystemType = useIsDisplayMenuByRoute([SystemReportType])

  let options = [
    {
      label: useTrans(CompanyTrans),
      value: Company
    },
    {
      label: useTrans(AgentTrans),
      value: Agent
    }
  ]

  if (hasSystemType) {
    options.push({
      label: useTrans(SystemTrans),
      value: System
    })
  }

  return <Select placeholder={placeholder} options={options} {...props} />
}
