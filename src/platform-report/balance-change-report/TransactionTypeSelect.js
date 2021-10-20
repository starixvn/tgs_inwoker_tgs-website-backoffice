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

const Deposit = "Deposit"
const DepositTrans = {
  zh: "存款",
  en: "Deposit"
}

const Withdrawal = "Withdrawal"
const WithdrawalTrans = {
  zh: "提款",
  en: "Withdrawal"
}
const Adjust = "Adjust"
const AdjustTrans = {
  zh: "调账",
  en: "Balance Adjustment"
}

const Rebate = "Rebate"
const RebateTrans = {
  zh: "返水",
  en: "Commission Rebate"
}

const Dividend = "Dividend"
const DividendTrans = {
  zh: "分紅",
  en: "Profit Sharing"
}

const Promotion = "Promotion"
const PromotionTrans = {
  zh: "活动",
  en: "Promotion"
}

const CancelWithdrawal = "CancelWithdrawal"
const CancelWithdrawalTrans = {
  zh: "取消提款",
  en: "Cancel Withdrawal"
}

const PlaceBet = "PlaceBet"
const PlaceBetTrans = {
  zh: "投注",
  en: "Place Bet"
}

const WinBet = "WinBet"
const WinBetTrans = {
  zh: "赢",
  en: "Win Bet"
}

const LoseBet = "LoseBet"
const LoseBetTrans = {
  zh: "输",
  en: "Lose Bet"
}

const FreeBet = "FreeBet"
const FreeBetTrans = {
  zh: "免费投注",
  en: "FreeB et"
}

const TieBet = "TieBet"
const TieBetTrans = {
  zh: "和局",
  en: "Tie Bet"
}

const CancelTransaction = "CancelTransaction"
const CancelTransactionTrans = {
  zh: "取消投注",
  en: "Cancel Transaction"
}
const LockAmount = "LockAmount"
const LockAmountTrans = {
  zh: "锁定金额",
  en: "Lock Amount"
}

const UnlockAmount = "UnlockAmount"
const UnlockAmountTrans = {
  zh: "解锁金额",
  en: "Unlock Amount"
}

const WinJackpot = "WinJackpot"
const WinJackpotTrans = {
  zh: "赢 Jackpot",
  en: "Win Jackpot"
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
    case GameProviderDeposit:
      return <Trans {...GameProviderDepositTrans} />
    case GameProviderWithdrawal:
      return <Trans {...GameProviderWithdrawalTrans} />

    //TODO: able to remve the following?
    case Deposit:
      return <Trans {...DepositTrans} />
    case Withdrawal:
      return <Trans {...WithdrawalTrans} />
    case Adjust:
      return <Trans {...AdjustTrans} />
    case Rebate:
      return <Trans {...RebateTrans} />
    case Dividend:
      return <Trans {...DividendTrans} />
    case Promotion:
      return <Trans {...PromotionTrans} />
    case GameProviderFundIn:
      return <Trans {...GameProviderFundInTrans} />
    case GameProviderFundOut:
      return <Trans {...GameProviderFundOutTrans} />
    case CancelWithdrawal:
      return <Trans {...CancelWithdrawalTrans} />
    case PlaceBet:
      return <Trans {...PlaceBetTrans} />
    case WinBet:
      return <Trans {...WinBetTrans} />
    case LoseBet:
      return <Trans {...LoseBetTrans} />
    case FreeBet:
      return <Trans {...FreeBetTrans} />
    case TieBet:
      return <Trans {...TieBetTrans} />
    case CancelTransaction:
      return <Trans {...CancelTransactionTrans} />
    case LockAmount:
      return <Trans {...LockAmountTrans} />
    case UnlockAmount:
      return <Trans {...UnlockAmountTrans} />
    case WinJackpot:
      return <Trans {...WinJackpotTrans} />
    default:
      return value
  }
}
