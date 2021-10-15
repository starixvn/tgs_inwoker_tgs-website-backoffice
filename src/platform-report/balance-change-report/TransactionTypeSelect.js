import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useTrans } from "../../i18n"
import { Select } from "../../select/Select"

const GameProviderDeposit = "GameProviderDeposit"
const GameProviderDepositTrans = {
  zh: "上分",
  en: "Game Deposit"
}

const GameProviderWithdrawal = "GameProviderWithdrawal"
const GameProviderWithdrawalTrans = {
  zh: "下分",
  en: "Game Withdrawal"
}

const GameProviderFundIn = "GameProviderFundIn"
const GameProviderFundInTrans = {
  zh: "游戏转入",
  en: "Game Fund In"
}

const GameProviderFundOut = "GameProviderFundOut"
const GameProviderFundOutTrans = {
  zh: "游戏转出",
  en: "Game Fund Out"
}

const Bonus = "Bonus"
const BonusTrans = {
  zh: "红利",
  en: "Bonus"
}

export const TransactionTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "交易类型",
    en: "Transaction Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(GameProviderDepositTrans),
      value: GameProviderDeposit
    },
    {
      label: useTrans(GameProviderWithdrawalTrans),
      value: GameProviderWithdrawal
    },
    /*
    TODO: check if required
    {
      label: useTrans(GameProviderFundInTrans),
      value: GameProviderFundIn
    },
    {
      label: useTrans(GameProviderFundOutTrans),
      value: GameProviderFundOut
    },
    */
    {
      label: useTrans(BonusTrans),
      value: Bonus
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const TransactionTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Bonus:
      return <Trans {...BonusTrans} />
    case GameProviderFundOut:
      return <Trans {...GameProviderFundOutTrans} />
    case GameProviderFundIn:
      return <Trans {...GameProviderFundInTrans} />
    case GameProviderDeposit:
      return <Trans {...GameProviderDepositTrans} />
    case GameProviderWithdrawal:
      return <Trans {...GameProviderWithdrawalTrans} />
    default:
      return value
  }
}
