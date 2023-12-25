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
import { useTransactionTypeTrans } from "../../trans/Action"
import { useDepositTrans } from "../../trans/Payment"

export const Bonus = "Bonus"
const BonusTrans = {
  zh: "红利",
  en: "Bonus"
}

export const Deposit = "Recharge"

export const Dividend = "Dividend"
const DividendTrans = {
  zh: "分紅",
  en: "Profit Sharing"
}

export const Transfer = "Transfer"
const TransferTrans = {
  zh: "转账",
  en: "Transfer"
}

export const Other = "Other"
const OtherTrans = {
  zh: "其他",
  en: "Other"
}

export const AgentDeductBalanceTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTransactionTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(BonusTrans),
      value: Bonus
    },
    {
      label: useDepositTrans(),
      value: Deposit
    },
    {
      label: useTrans(DividendTrans),
      value: Dividend
    },
    {
      label: useTrans(TransferTrans),
      value: Transfer
    },
    {
      label: useTrans(OtherTrans),
      value: Other
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export default {
  Bonus,
  Deposit,
  Dividend,
  Transfer,
  Other
}
