import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const GameProvider = {
  zh: "游戏厂商",
  en: "Game Provider",
  vi: "Sảnh trò chơi"
}
export const useGameProviderTrans = () => useTrans(GameProvider)
export const GameProviderTrans = () => <Trans {...GameProvider} />

const GameType = {
  zh: "游戏类型",
  en: "Game Type",
  vi: "Loại trò chơi"
}
export const useGameTypeTrans = () => useTrans(GameType)
export const GameTypeTrans = () => <Trans {...GameType} />

export const LiveDealer = {
  zh: "真人",
  en: "Live Dealer",
  vi: "CASINO"
}
export const LiveDealerTrans = () => <Trans {...LiveDealer} />

export const Sportsbook = {
  zh: "体育",
  en: "Sportsbook",
  vi: "Thể thao"
}
export const SportsbookTrans = () => <Trans {...Sportsbook} />

export const Sports = {
  zh: "体育",
  en: "Sports",
  vi: "Thể thao"
}
export const SportsTrans = () => <Trans {...Sports} />

export const Slot = {
  zh: "老虎机",
  en: "Slot Game",
  vi: "Slot / Máy đánh bạc"
}
export const SlotTrans = () => <Trans {...Slot} />

export const CardGame = {
  zh: "棋牌",
  en: "Card Game",
  vi: "Game bài"
}
export const CardGameTrans = () => <Trans {...CardGame} />

export const ESports = {
  zh: "电竞",
  en: "E-sports",
  vi: "Sport"
}
export const ESportsTrans = () => <Trans {...ESports} />

export const VirtualSports = {
  zh: "虚拟体育",
  en: "Virtual Sports",
  vi: "Thể thao ảo"
}
export const VirtualSportsTrans = () => <Trans {...VirtualSports} />

export const Lottery = {
  zh: "彩票",
  en: "Lottery",
  vi: "Sổ xố"
}
export const LotteryTrans = () => <Trans {...Lottery} />

export const Fishing = {
  zh: "捕鱼",
  en: "Fishing",
  vi: "Bắn cá"
}
export const FishingTrans = () => <Trans {...Fishing} />

export const Arcade = {
  zh: "街机",
  en: "Arcade Game",
  vi: "Game thùng"
}
export const ArcadeTrans = () => <Trans {...Arcade} />

export const TableGame = {
  zh: "桌面游戏",
  en: "Table Game",
  vi: "Trò chơi bàn"
}
export const TableGameTrans = () => <Trans {...TableGame} />

const BetAmount = {
  zh: "投注金额",
  en: "Bet Amount",
  vi: "Số tiền cược"
}
export const BetAmountTrans = () => <Trans {...BetAmount} />

const ValidBetAmount = {
  zh: "有效投注金额",
  en: "Valid Bet Amount",
  vi: "Số tiền cược hợp lệ"
}
export const ValidBetAmountTrans = () => <Trans {...ValidBetAmount} />

const WinLoss = {
  zh: "输赢金额",
  en: "Win Loss",
  vi: "Số tiền thắng thua"
}
export const WinLossTrans = () => <Trans {...WinLoss} />

const GameDetail = {
  zh: "游戏详情",
  en: "Game Detail",
  vi: "Chi tiết trò chơi"
}
export const useGameDetailTrans = () => useTrans(GameDetail)
export const GameDetailTrans = () => <Trans {...GameDetail} />
