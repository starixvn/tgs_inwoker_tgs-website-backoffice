import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

export const VipLevel = {
  zh: "VIP 等级",
  en: "VIP Level",
  vi: "Cấp VIP"
}
export const VipLevelTrans = () => <Trans {...VipLevel} />
export const useVipLevelTrans = () => useTrans(VipLevel)

const VipBefore = {
  zh: "结算前等級",
  en: "Before",
  vi: "Cấp VIP trước kết toán"
}
export const VipBeforeTrans = () => <Trans {...VipBefore} />

const VipAfter = {
  zh: "结算后等級",
  en: "After",
  vi: "Cấp VIP sau kết toán"
}
export const VipAfterTrans = () => <Trans {...VipAfter} />

const VipHistoryRecord = {
  zh: "VIP升降級記錄",
  en: "VIP History Record",
  vi: "Lịch sử thăng hạng VIP"
}
export const VipHistoryRecordTrans = () => <Trans {...VipHistoryRecord} />

const Requirements = {
  zh: "需满足条件",
  en: "Requirements",
  vi: "Điều kiện nhận thưởng"
}
export const RequirementsTrans = () => <Trans {...Requirements} />

const RequiredBetAmountToLevelUp = {
  zh: "累积投注金额(即时)",
  en: "Total Bet Amount (Real-time)",
  vi: "số tiền đặt cược tích lũy( thời giac thực )"
}
export const RequiredBetAmountToLevelUpTrans = () => (
  <Trans {...RequiredBetAmountToLevelUp} />
)

const RequiredDepositAmountToLevelUp = {
  zh: "累积存款金额(即时)",
  en: "Total Deposit Amount (Real-time)",
  vi: "số tiền nạp tích lũy ( thời giac thực )"
}
export const RequiredDepositAmountToLevelUpTrans = () => (
  <Trans {...RequiredDepositAmountToLevelUp} />
)

const VipBenefits = {
  zh: "VIP福利",
  en: "VIP benefits",
  vi: "phúc lợi VIP"
}
export const VipBenefitsTrans = () => <Trans {...VipBenefits} />

const BirthdayBonus = {
  zh: "生日福利",
  en: "Birthday Bonus",
  vi: "phúc lợi sinh nhật"
}
export const BirthdayBonusTrans = () => <Trans {...BirthdayBonus} />

const PromotionBonus = {
  zh: "晋升福利",
  en: "Level Up Bonus",
  vi: "phúc lợi thăng cấp"
}
export const PromotionBonusTrans = () => <Trans {...PromotionBonus} />

const QuarterlyBonus = {
  zh: "季度福利",
  en: "Quarterly Bonus",
  vi: "phúc lợi theo quý"
}
export const QuarterlyBonusTrans = () => <Trans {...QuarterlyBonus} />

const WithdrawalPolicy = {
  zh: "提款限制",
  en: "Withdrawal Policy",
  vi: "giới hạn rút tiền"
}
export const WithdrawalPolicyTrans = () => <Trans {...WithdrawalPolicy} />

const TransactionsPerDay = {
  zh: "单日次数",
  en: "Transactions per Day",
  vi: "số lần trong ngày"
}
export const TransactionsPerDayTrans = () => <Trans {...TransactionsPerDay} />

const TotalAmountPerDay = {
  zh: "单日总额",
  en: "Total Amount per Day",
  vi: "tổng cộng trong ngày"
}
export const TotalAmountPerDayTrans = () => <Trans {...TotalAmountPerDay} />

const VipCommissionRebate = {
  zh: "VIP返水比例",
  en: "VIP Commission Rebate",
  vi: "Tỉ lệ hoàn trả VIP"
}
export const VipCommissionRebateTrans = () => <Trans {...VipCommissionRebate} />

const LiveDealerCommissionRebate = {
  zh: "真人返水比例(%)",
  en: "Live Dealer Commission Rebate",
  vi: "tỉ lệ hoàn trả casino (%)"
}
export const LiveDealerCommissionRebateTrans = () => (
  <Trans {...LiveDealerCommissionRebate} />
)

const EGameCommissionRebate = {
  zh: "电子返水比例(%)",
  en: "EGame Commission Rebate",
  vi: "tỉ lệ hoàn trả điện tử (%)"
}
export const EGameCommissionRebateTrans = () => (
  <Trans {...EGameCommissionRebate} />
)

const CardGameCommissionRebate = {
  zh: "棋牌返水比例(%)",
  en: "Card Game Commission Rebate",
  vi: "tỉ lệ hoàn trả game bài (%)"
}
export const CardGameCommissionRebateTrans = () => (
  <Trans {...CardGameCommissionRebate} />
)

const SportsbookCommissionRebate = {
  zh: "体育返水比例(%)",
  en: "Sportsbook Commission Rebate",
  vi: "tỉ lệ hoàn trả thể thao (%)"
}
export const SportsbookCommissionRebateTrans = () => (
  <Trans {...SportsbookCommissionRebate} />
)

const VirtualSportsCommissionRebate = {
  zh: "虚拟体育返水比例(%)",
  en: "VirtualSports Commission Rebate",
  vi: "tỉ lệ hoàn trả thể thao ảo (%)"
}
export const VirtualSportsCommissionRebateTrans = () => (
  <Trans {...VirtualSportsCommissionRebate} />
)

const LotteryCommissionRebate = {
  zh: "彩票返水比例(%)",
  en: "Lottery Commission Rebate",
  vi: "tỉ lệ hoàn trả sổ xố (%)"
}
export const LotteryCommissionRebateTrans = () => (
  <Trans {...LotteryCommissionRebate} />
)

const VipUpgrade = {
  zh: "VIP升级方式",
  en: "VIP Upgrade Method",
  vi: "Cách thức nâng cấp VIP"
}
export const VipUpgradeTrans = (props) => <Trans {...VipUpgrade} {...props} />

const VipAccumulationStatus = {
  zh: "VIP累积状况",
  en: "VIP Status",
  vi: "Trạng thái Tích lũy VIP"
}
export const VipAccumulationStatusTrans = () => (
  <Trans {...VipAccumulationStatus} />
)

const CurrentVipLevel = {
  zh: "当前VIP等级",
  en: "Current VIP Level",
  vi: "Cấp bậc VIP hiện tại"
}
export const CurrentVipLevelTrans = () => <Trans {...CurrentVipLevel} />

const VipTotalValidBet = {
  zh: "总投注金额",
  en: "Total Valid Bet",
  vi: "Tổng cược"
}
export const VipTotalValidBetTrans = () => <Trans {...VipTotalValidBet} />

const VipTotalDeposit = {
  zh: "总存款金额",
  en: "Total Deposit",
  vi: "Tổng tiền nạp"
}
export const VipTotalDepositTrans = () => <Trans {...VipTotalDeposit} />

export const AgentDividendDistribution = {
  zh: "代理分红派发",
  en: "Agent dividend distribution",
  vi: "phân phát hoa hồng đại lý"
}
export const AgentDividendDistributionTrans = () => (
  <Trans {...AgentDividendDistribution} />
)
