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
import { useTrans, Trans } from "../../i18n"
import Select from "../../select/Select"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { SystemTransactionType } from "./menu"

export const Company = "CompanyAdjust"
const CompanyTrans = {
  zh: "公司调账",
  en: "Company Adjust"
}

export const Agent = "AgentAdjust"
const AgentTrans = {
  zh: "代理调账",
  en: "Agent Adjust"
}

export const System = "SystemAdjust"
const SystemTrans = {
  zh: "系統调账",
  en: "System Adjust"
}

export const Transfer = "TransferAdjust"
const TransferTrans = {
  zh: "转帐",
  en: "Transfer"
}

export default {
  Company,
  Agent,
  System,
  Transfer
}

export const isTransfer = (type) => type === Transfer

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
    },
    {
      label: useTrans(TransferTrans),
      value: Transfer
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
    case Transfer:
      return <Trans {...TransferTrans} />
    default:
      return null
  }
}

export const PlayerAdjustBalanceTypeSelect = ({
  placeholder,
  transferable = false,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let hasSystemType = useIsDisplayMenuByRoute([SystemTransactionType])

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

  if (transferable) {
    options.push({
      label: useTrans(TransferTrans),
      value: Transfer
    })
  }

  return <Select placeholder={placeholder} options={options} {...props} />
}
