import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const GameProvider = {
  zh: "游戏厂商",
  en: "Game Provider",
  vi: "Sảnh trò chơi"
}
export const GameProviderTrans = () => <Trans {...GameProvider} />
export const useGameProviderTrans = () => useTrans(GameProvider)

const GameProviderName = {
  zh: "厂商名称",
  en: "Game Provider Name",
  vi: "Tên nhà sản xuất"
}
export const GameProviderNameTrans = () => <Trans {...GameProviderName} />
export const useGameProviderNameTrans = () => useTrans(GameProviderName)

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

const GameId = {
  zh: "游戏ID",
  en: "Game ID",
  vi: "ID trò chơi"
}
export const GameIdTrans = () => <Trans {...GameId} />
export const useGameIdTrans = () => useTrans(GameId)

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

const TurnoverPercentage = {
  zh: "流水比例",
  en: "Turnover Percentage",
  vi: "Tỷ lệ doanh số"
}
export const TurnoverPercentageTrans = () => <Trans {...TurnoverPercentage} />

const GameVipCommissionRebate = {
  zh: "VIP是否发放返水",
  en: "VIP Commission Rebate",
  vi: "VIP có phải là được phát hoàn trả không"
}
export const GameVipCommissionRebateTrans = () => (
  <Trans {...GameVipCommissionRebate} />
)

const WinLoss = {
  zh: "输赢",
  en: "Win Loss",
  vi: "Số tiền thắng thua"
}
export const WinLossTrans = () => <Trans {...WinLoss} />

const WL = {
  zh: "输赢",
  en: "W/L",
  vi: "Thắng thua"
}
export const WLTrans = () => <Trans {...WL} />

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

export const GameProviderUpdatedReport = {
  zh: "游戏商報表(即时)",
  en: "Game Provider Report(Updated)",
  vi: "Báo cáo nhà cung cấp trò chơi"
}
export const GameProviderUpdatedReportTrans = () => (
  <Trans {...GameProviderUpdatedReport} />
)

export const TransactionCount = {
  zh: "訂單笔数",
  en: "Transactions",
  vi: "Số lượng đơn"
}
export const TransactionCountTrans = () => <Trans {...TransactionCount} />

const BettingRecords = {
  zh: "投注记录",
  en: "Betting records",
  vi: "Lịch sử đặt cược"
}
export const BettingRecordsTrans = () => <Trans {...BettingRecords} />

export const GameProviderList = {
  zh: "厂商列表",
  en: "Game Provider List",
  vi: "Danh sách các nhà cung cấp"
}
export const GameProviderListTrans = () => <Trans {...GameProviderList} />

export const GameManagement = {
  zh: "游戏管理",
  en: "Game Management",
  vi: "Quản lý trò chơi"
}
export const GameManagementTrans = () => <Trans {...GameManagement} />

export const GameList = {
  zh: "游戏列表",
  en: "Game List",
  vi: "Danh sách trò chơi"
}
export const GameListTrans = () => <Trans {...GameList} />
export const useGameListTrans = () => useTrans(GameList)

const PresetMaintenance = {
  zh: "预设维护",
  en: "Preset Maintenance",
  vi: "Bảo trì theo lịch trình"
}
export const PresetMaintenanceTrans = () => <Trans {...PresetMaintenance} />
export const usePresetMaintenanceTrans = () => useTrans(PresetMaintenance)

const HotGame = {
  zh: "热门游戏",
  en: "Hot",
  vi: "Game  phổ biến"
}
export const HotGameTrans = () => <Trans {...HotGame} />

const NewGame = {
  zh: "最新游戏",
  en: "New",
  vi: "Game mới"
}
export const NewGameTrans = () => <Trans {...NewGame} />

const RecommendGame = {
  zh: "推荐游戏",
  en: "Recommend",
  vi: "Game được đề xuất"
}
export const RecommendGameTrans = () => <Trans {...RecommendGame} />

const GamingCount = {
  zh: "游戏人数",
  en: "Gaming Count",
  vi: "Số người chơi"
}
export const GamingCountTrans = () => <Trans {...GamingCount} />

const Bet = {
  zh: "投注",
  en: "Bet",
  vi: "Đặt cược"
}
export const BetTrans = () => <Trans {...Bet} />

const PlaceBet = {
  zh: "投注",
  en: "Place Bet",
  vi: "Đặt cược"
}
export const PlaceBetTrans = () => <Trans {...PlaceBet} />
export const usePlaceBetTrans = () => useTrans(PlaceBet)

const GamePayout = {
  zh: "派彩",
  en: "Payout",
  vi: "Thanh toán"
}
export const GamePayoutTrans = () => <Trans {...GamePayout} />

const Top10Games = {
  zh: "十大游戏",
  en: "Top 10 Games",
  vi: "10 trò chơi hàng đầu"
}
export const Top10GamesTrans = () => <Trans {...Top10Games} />

const GameProviderGameName = {
  zh: "游戏厂商 / 游戏名称",
  en: "Provider / Game Name",
  vi: "Sảnh trò chơi / Tên trò chơi"
}
export const GameProviderGameNameTrans = () => (
  <Trans {...GameProviderGameName} />
)
