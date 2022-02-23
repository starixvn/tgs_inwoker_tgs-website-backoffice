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
import { useTrans } from "../../i18n"
import Select from "../../select/Select"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { SystemReportType } from "./menu"

const Company = "Company"
const CompanyTrans = {
  zh: "公司",
  en: "Company"
}

const Agent = "Agent"
const AgentTrans = {
  zh: "代理",
  en: "Agent"
}

const System = "System"
const SystemTrans = {
  zh: "系統",
  en: "System"
}

export const AgentAddBalanceReportTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "报表类型",
    en: "Report Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let hasSystemReportType = useIsDisplayMenuByRoute([SystemReportType])

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

  if (hasSystemReportType) {
    options.push({
      label: useTrans(SystemTrans),
      value: System
    })
  }

  return <Select placeholder={placeholder} options={options} {...props} />
}
