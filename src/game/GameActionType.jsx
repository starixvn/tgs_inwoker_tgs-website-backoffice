import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useLocale, useTrans } from "../i18n"

const GameBet = "GameBet"
const GameBetTrans = {
  zh: "投注",
  en: "Place Bet"
}

const GameSettleWin = "GameSettleWin"
const GameSettleWinTrans = {
  zh: "赢",
  en: "Win Bet"
}

const GameSettleLose = "GameSettleLose"
const GameSettleLoseTrans = {
  zh: "输",
  en: "Lose Bet"
}

const GameSettleFree = "GameSettleFree"
const GameSettleFreeTrans = {
  zh: "免费投注",
  en: "FreeB et"
}

const GameSettleTie = "GameSettleTie"
const GameSettleTieTrans = {
  zh: "和局",
  en: "Tie Bet"
}

const GameCancel = "GameCancel"
const GameCancelTrans = {
  zh: "取消投注",
  en: "Cancel Transaction"
}

const GameLock = "GameLock"
const GameLockTrans = {
  zh: "锁定金额",
  en: "Lock Amount"
}

const GameUnlock = "GameUnlock"
const GameUnlockTrans = {
  zh: "解锁金额",
  en: "Unlock Amount"
}

const GameWinJackpot = "GameWinJackpot"
const GameWinJackpotTrans = {
  zh: "赢 Jackpot",
  en: "Win Jackpot"
}

const GameCredit = "GameCredit"
const GameCreditTrans = {
  zh: "Game Credit",
  en: "Game Credit"
}

const GameDebit = "GameDebit"
const GameDebitTrans = {
  zh: "Game Debit",
  en: "Game Debit"
}

const GameRefund = "GameRefund"
const GameRefundTrans = {
  zh: "Game Refund",
  en: "Game Refund"
}

const GameRevision = "GameRevision"
const GameRevisionTrans = {
  zh: "Game Revision",
  en: "Game Revision"
}

const GameProviderFundRefund = "GameProviderFundRefund"
const GameProviderFundRefundTrans = {
  zh: "Game Provider Fund Refund",
  en: "Game Provider Fund Refund"
}

export const useGameActionTypeOptionList = () => {
  let options = [
    {
      label: useTrans(GameBetTrans),
      value: GameBet
    },
    {
      label: useTrans(GameSettleWinTrans),
      value: GameSettleWin
    },
    {
      label: useTrans(GameSettleLoseTrans),
      value: GameSettleLose
    },
    {
      label: useTrans(GameSettleFreeTrans),
      value: GameSettleFree
    },
    {
      label: useTrans(GameSettleTieTrans),
      value: GameSettleTie
    },
    {
      label: useTrans(GameCancelTrans),
      value: GameCancel
    },
    {
      label: useTrans(GameLockTrans),
      value: GameLock
    },
    {
      label: useTrans(GameUnlockTrans),
      value: GameUnlock
    },
    {
      label: useTrans(GameWinJackpotTrans),
      value: GameWinJackpot
    },
    {
      label: useTrans(GameDebitTrans),
      value: GameDebit
    },
    {
      label: useTrans(GameCreditTrans),
      value: GameCredit
    },
    {
      label: useTrans(GameRefundTrans),
      value: GameRefund
    },
    {
      label: useTrans(GameRevisionTrans),
      value: GameRevision
    },
    {
      label: useTrans(GameProviderFundRefundTrans),
      value: GameProviderFundRefund
    }
  ]
  return options
}

export const GameActionTypeLabel = ({ value = "" }) => {
  switch (value) {
    case GameBet:
      return <Trans {...GameBetTrans} />
    case GameSettleWin:
      return <Trans {...GameSettleWinTrans} />
    case GameSettleLose:
      return <Trans {...GameSettleLoseTrans} />
    case GameSettleFree:
      return <Trans {...GameSettleFreeTrans} />
    case GameSettleTie:
      return <Trans {...GameSettleTieTrans} />
    case GameCancel:
      return <Trans {...GameCancelTrans} />
    case GameLock:
      return <Trans {...GameLockTrans} />
    case GameUnlock:
      return <Trans {...GameUnlockTrans} />
    case GameWinJackpot:
      return <Trans {...GameWinJackpotTrans} />
    case GameCredit:
      return <Trans {...GameCreditTrans} />
    case GameDebit:
      return <Trans {...GameDebitTrans} />
    case GameRefund:
      return <Trans {...GameRefundTrans} />
    case GameRevision:
      return <Trans {...GameRevisionTrans} />
    case GameProviderFundRefund:
      return <Trans {...GameProviderFundRefundTrans} />
    default:
      return value
  }
}
