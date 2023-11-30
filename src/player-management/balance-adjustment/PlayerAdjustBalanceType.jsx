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
import { SystemTransactionType, BonusAdjustTransactionType } from "./menu"
import {
  AgentAdjustTrans,
  CompanyAdjustTrans,
  SystemAdjustTrans,
  useAgentAdjustTrans,
  useCompanyAdjustTrans,
  useSystemAdjustTrans
} from "../../trans/Action"

export const Bonus = "BonusAdjust"
export const BonusTrans = {
  zh: "优惠调帐",
  en: "Bonus Adjust"
}

export const Company = "CompanyAdjust"

export const Agent = "AgentAdjust"

export const System = "SystemAdjust"

export const Transfer = "TransferAdjust"
export const TransferTrans = {
  zh: "转帐",
  en: "Transfer"
}

const List = [Bonus, Company, Agent, System, Transfer]

export default {
  Bonus,
  Company,
  Agent,
  System,
  Transfer,
  List
}

export const showIncludeInNetProfitSetting = (type) =>
  type === Bonus || type === Company || type === Agent

export const isTransfer = (type) => type === Transfer

export const usePlayerAdjustBalanceTypeOptionList = () => {
  let options = [
    {
      label: useTrans(BonusTrans),
      value: Bonus
    },
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

export const PlayerAdjustBalanceTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Bonus:
      return <Trans {...BonusTrans} />
    case Company:
      return <CompanyAdjustTrans />
    case Agent:
      return <AgentAdjustTrans />
    case System:
      return <SystemAdjustTrans />
    case Transfer:
      return <Trans {...TransferTrans} />
    default:
      return value
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
  let hasBonusAdjust = useIsDisplayMenuByRoute([BonusAdjustTransactionType])

  let options = []
  if (hasBonusAdjust) {
    options.push({
      label: useTrans(BonusTrans),
      value: Bonus
    })
  }

  options.push({
    label: useCompanyAdjustTrans(),
    value: Company
  })

  options.push({
    label: useAgentAdjustTrans(),
    value: Agent
  })

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
