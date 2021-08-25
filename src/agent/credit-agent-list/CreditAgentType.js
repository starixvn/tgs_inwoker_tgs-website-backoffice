import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../../select/Select"

export const Company = "Company"
const CompanyTrans = {
  zh: "公司",
  en: "Company"
}

export const Shareholder = "Shareholder"
const ShareholderTrans = {
  zh: "股东",
  en: "Shareholder"
}

export const Agent = "Agent"
const AgentTrans = {
  zh: "代理",
  en: "Agent"
}

const parentRequiredList = [Shareholder, Agent]
export const isAgentParentRequired = (
  type = "",
  parentRequired = parentRequiredList
) => {
  return parentRequired.includes(type)
}

export const CreditAgentTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "代理类型",
    en: "Agent Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(CompanyTrans),
      value: Company
    },
    {
      label: useTrans(ShareholderTrans),
      value: Shareholder
    },
    {
      label: useTrans(AgentTrans),
      value: Agent
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const CreditAgentTypeLabel = ({ value = "" }) => {
  let code = value
  switch (code) {
    case Company:
      return <Trans {...CompanyTrans} />
    case Shareholder:
      return <Trans {...ShareholderTrans} />
    case Agent:
      return <Trans {...AgentTrans} />
    default:
      return value
  }
}
