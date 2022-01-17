import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useLocale, useTrans } from "../i18n"

export const PlaceBet = "PlaceBet"
const PlaceBetTrans = {
  zh: "投注",
  en: "Place Bet"
}

export const WinBet = "WinBet"
const WinBetTrans = {
  zh: "赢",
  en: "Win Bet"
}

export const LoseBet = "LoseBet"
const LoseBetTrans = {
  zh: "输",
  en: "Lose Bet"
}

export const FreeBet = "FreeBet"
const FreeBetTrans = {
  zh: "免费投注",
  en: "FreeB et"
}

export const TieBet = "TieBet"
const TieBetTrans = {
  zh: "和局",
  en: "Tie Bet"
}

export const CancelTransaction = "CancelTransaction"
const CancelTransactionTrans = {
  zh: "取消投注",
  en: "Cancel Transaction"
}

export const LockAmount = "LockAmount"
const LockAmountTrans = {
  zh: "锁定金额",
  en: "Lock Amount"
}

export const UnlockAmount = "UnlockAmount"
const UnlockAmountTrans = {
  zh: "解锁金额",
  en: "Unlock Amount"
}

export const WinJackpot = "WinJackpot"
const WinJackpotTrans = {
  zh: "赢 Jackpot",
  en: "Win Jackpot"
}

export const useGameActionTypeOptionList = () => {
  let options = [
    {
      label: useTrans(PlaceBetTrans),
      value: PlaceBet
    },
    {
      label: useTrans(WinBetTrans),
      value: WinBet
    },
    {
      label: useTrans(LoseBetTrans),
      value: LoseBet
    },
    {
      label: useTrans(FreeBetTrans),
      value: FreeBet
    },
    {
      label: useTrans(TieBetTrans),
      value: TieBet
    },
    {
      label: useTrans(CancelTransactionTrans),
      value: CancelTransaction
    },
    {
      label: useTrans(LockAmountTrans),
      value: LockAmount
    },
    {
      label: useTrans(UnlockAmountTrans),
      value: UnlockAmount
    },
    {
      label: useTrans(WinJackpotTrans),
      value: WinJackpot
    }
  ]
  return options
}

export const GameActionTypeLabel = ({ value = "" }) => {
  switch (value) {
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
