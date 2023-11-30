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
import { SystemTransactionType } from "./menu"
import {
  AgentAdjustTrans,
  CompanyAdjustTrans,
  SystemAdjustTrans,
  useAgentAdjustTrans,
  useCompanyAdjustTrans,
  useSystemAdjustTrans
} from "../../trans/Action"

export const Company = "CompanyAdjust"

export const Agent = "AgentAdjust"

export const System = "SystemAdjust"

export const Transfer = "TransferAdjust"
const TransferTrans = {
  zh: "轉帳",
  en: "Transfer"
}

export const isTransfer = (type) => type === Transfer

export const useAgentAdjustBalanceTypeOptionList = () => {
  let options = [
    {
      label: useCompanyAdjustTrans(),
      value: Company
    },
    {
      label: useAgentAdjustTrans(),
      value: Agent
    },
    {
      label: useSystemAdjustTrans(),
      value: System
    },
    {
      label: useTrans(TransferTrans),
      value: Transfer
    }
  ]

  return options
}

export const AgentAdjustBalanceTypeLabel = ({ value }) => {
  switch (value) {
    case Company:
      return <CompanyAdjustTrans />
    case Agent:
      return <AgentAdjustTrans />
    case System:
      return <SystemAdjustTrans />
    case Transfer:
      return <Trans {...TransferTrans} />
    default:
      return null
  }
}

export const AgentAdjustBalanceTypeSelect = ({
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
      label: useCompanyAdjustTrans(),
      value: Company
    },
    {
      label: useAgentAdjustTrans(),
      value: Agent
    }
  ]

  if (hasSystemType) {
    options.push({
      label: useSystemAdjustTrans(),
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
