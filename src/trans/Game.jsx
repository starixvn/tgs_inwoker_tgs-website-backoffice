import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const GameProvider = {
  zh: "游戏厂商",
  en: "Game Provider",
  vi: "Sảnh trò chơi"
}
export const GameProviderTrans = () => <Trans {...GameProvider} />
export const useGameProviderTrans = () => useTrans(GameProvider)

const SubGameProvider = {
  zh: "子游戏厂商",
  en: "Sub Game Provider",
  vi: "Nhà sản xuất trò chơi phụ"
}
export const SubGameProviderTrans = () => <Trans {...SubGameProvider} />
export const useSubGameProviderTrans = () => useTrans(SubGameProvider)

const GameName = {
  zh: "游戏名称",
  en: "Game Name",
  vi: "Tên trò chơi"
}
export const GameNameTrans = () => <Trans {...GameName} />

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

//TODO: rm
/*
export const Sports = {
  zh: "体育",
  en: "Sports",
  vi: "Thể thao"
}
export const SportsTrans = () => <Trans {...Sports} />
*/

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
  zh: "有效投注",
  en: "Valid Bet Amount",
  vi: "Số tiền cược hợp lệ"
}
export const ValidBetAmountTrans = () => <Trans {...ValidBetAmount} />
export const useValidBetAmountTrans = () => useTrans(ValidBetAmount)

export const Turnover = {
  zh: "流水",
  en: "Turnover",
  vi: "Vòng cược"
}
export const TurnoverTrans = () => <Trans {...Turnover} />

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

export const OrderTracking = {
  zh: "订单查询",
  en: "Order Tracking",
  vi: "Tìm kiếm mã đơn"
}
export const OrderTrackingTrans = () => <Trans {...OrderTracking} />

const BetTime = {
  zh: "投注时间",
  en: "Created On",
  vi: "Thời gian đặt cược"
}
export const BetTimeTrans = () => <Trans {...BetTime} />

const ExternalBetTime = {
  zh: "三方投注时间",
  en: "External Created On",
  vi: "Thời gian đặt cược"
}
export const ExternalBetTimeTrans = () => <Trans {...ExternalBetTime} />

const SettleTime = {
  zh: "结算时间",
  en: "Closed On",
  vi: "Thời gian kết toán"
}
export const SettleTimeTrans = () => <Trans {...SettleTime} />

const ExternalRoundId = {
  zh: "三方订单ID",
  en: "External ID",
  vi: "Mã đơn ID bên thú ba"
}
export const ExternalRoundIdTrans = () => <Trans {...ExternalRoundId} />
export const useExternalRoundIdTrans = () => useTrans(ExternalRoundId)

const RoundId = {
  zh: "订单ID",
  en: "Id",
  vi: "Mã đơn ID"
}
export const RoundIdTrans = () => <Trans {...RoundId} />
export const useRoundIdTrans = () => useTrans(RoundId)

export const UnsettledBet = {
  zh: "未结算订单查询",
  en: "Unsettled Bet",
  vi: "Truy vấn đơn hàng chưa kết toán"
}
export const UnsettledBetTrans = () => <Trans {...UnsettledBet} />

export const GameProviderReport = {
  zh: "游戏商報表",
  en: "Game Provider Report",
  vi: "Báo cáo nhà cung cấp trò chơi"
}
export const GameProviderReportTrans = () => <Trans {...GameProviderReport} />

export const TransactionCount = {
  zh: "訂單筆數",
  en: "Transactions",
  vi: "Số lượng đơn"
}
export const TransactionCountTrans = () => <Trans {...TransactionCount} />
