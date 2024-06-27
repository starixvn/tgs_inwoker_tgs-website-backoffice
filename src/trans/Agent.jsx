import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Agent = {
  zh: "代理",
  en: "Agent",
  vi: "Đại lý"
}
export const AgentTrans = () => <Trans {...Agent} />
export const useAgentTrans = () => useTrans(Agent)

const AgentUsername = {
  zh: "代理用户名",
  en: "Agent Username",
  vi: "Tài khoản đại lý"
}
export const AgentUsernameTrans = () => <Trans {...AgentUsername} />
export const useAgentUsernameTrans = () => useTrans(AgentUsername)

const Chief = {
  zh: "总代",
  en: "Chief",
  vi: "Tổng đại lý"
}
export const ChiefTrans = () => <Trans {...Chief} />
export const useChiefTrans = () => useTrans(Chief)

const MasterAgent = {
  zh: "总代理",
  en: "Master Agent"
}
export const MasterAgentTrans = () => <Trans {...MasterAgent} />

export const AgentManagement = {
  zh: "代理管理",
  en: "Agent management",
  vi: "Quản lý đại lý"
}
export const AgentManagementTrans = () => <Trans {...AgentManagement} />

export const Agents = {
  zh: "代理列表",
  en: "Agents",
  vi: "Báo biểu đại lý"
}
export const AgentsTrans = () => <Trans {...Agents} />

const AgentListStatusInfo = {
  zh: "當進入此頁面時，預設顯示狀態為【正常】的代理清單，且所有狀態都會依照用戶名(A-Z)排序",
  en: "When entering this table, the data with status: enable will show first, and all of status will be ordered by first letter (A-Z)",
  vi: "Khi vào trang này, trạng thái hiển thị đặt trước là danh sách đại lý [Bình thường] và tất cả các trạng thái sẽ được sắp xếp theo tên người dùng (A-Z)"
}
export const AgentListStatusInfoTrans = () => <Trans {...AgentListStatusInfo} />

const AgentListRemarkInfo = {
  zh: "【備註】欄位會顯示在代理信息頁面中，此欄位能夠被修改，但只會儲存並顯示最新一次的修改內容",
  en: "Remark will show in agent info page, and you can edit it. Please be aware that only the latest remark will be stored in our database.",
  vi: "【Ghi chú】 khung sẽ xuất hiện trên trang thông tin đại lý.khung này có thể được sửa đổi, nhưng chỉ lưu và hiển thị nội dung sửa đổi mới nhất."
}
export const AgentListRemarkInfoTrans = () => <Trans {...AgentListRemarkInfo} />

const AgentTeamInfo = {
  zh: "团队人数和直属玩家人数不计算状态”注册中”的玩家",
  en: `The number of team members and the number of direct players do not include players with the status "registering".`
}
export const AgentTeamInfoTrans = () => <Trans {...AgentTeamInfo} />

const UpperLevelAgent = {
  zh: "上级代理",
  en: "Upper Level Agent",
  vi: "Đại lý cấp trên"
}
export const useUpperLevelAgentTrans = () => useTrans(UpperLevelAgent)
export const UpperLevelAgentTrans = () => <Trans {...UpperLevelAgent} />

const AgentType = {
  zh: "代理类型",
  en: "Agent Type",
  vi: "Loại đại lý"
}
export const AgentTypeTrans = () => <Trans {...AgentType} />
export const useAgentTypeTrans = () => useTrans(AgentType)

const AgentLevel = {
  zh: "代理种类",
  en: "Level Type",
  vi: "Danh mục đại lý"
}
export const AgentLevelTrans = () => <Trans {...AgentLevel} />
export const useAgentLevelTrans = () => useTrans(AgentLevel)

export const AgentContributionReport = {
  zh: "代理贡献报表",
  en: "Agent Contribution Report",
  vi: "Hiệu suất đại lý"
}
export const AgentContributionReportTrans = () => (
  <Trans {...AgentContributionReport} />
)

export const AgentProfitSharingReport = {
  zh: "代理分红报表",
  en: "Agent Profit Sharing Report",
  vi: "Báo cáo hoa hồng đại lý"
}
export const AgentProfitSharingReportTrans = () => (
  <Trans {...AgentProfitSharingReport} />
)

const AgentProfit = {
  zh: "代理总分红",
  en: "Agent Profit",
  vi: "Tổng hoa hồng đại lý"
}
export const AgentProfitTrans = () => <Trans {...AgentProfit} />
export const useAgentProfitTrans = () => useTrans(AgentProfit)

const ProfitSharingPercentage = {
  zh: "分红比例",
  en: "Profit Sharing Percentage",
  vi: "Phần trăm hoa hồng"
}
export const ProfitSharingPercentageTrans = () => (
  <Trans {...ProfitSharingPercentage} />
)

const TeamNumber = {
  zh: "团队人数",
  en: "Team Number",
  vi: "Số  thành viên"
}
export const TeamNumberTrans = () => <Trans {...TeamNumber} />

const DirectPlayers = {
  zh: "直属玩家人数",
  en: "Direct Players",
  vi: "Số thành viên trực thuộc"
}
export const DirectPlayersTrans = () => <Trans {...DirectPlayers} />

export const AgentMarketingReport = {
  zh: "代理市場報表",
  en: "Agent Marketing Report",
  vi: "Báo cáo thị trường đại lý"
}
export const AgentMarketingReportTrans = () => (
  <Trans {...AgentMarketingReport} />
)

const AgentProfitSharingInterval = {
  zh: "代理分红周期",
  en: "Agent Profit Sharing Interval",
  vi: "chu kỳ hoa hồng của đại lý"
}
export const AgentProfitSharingIntervalTrans = () => (
  <Trans {...AgentProfitSharingInterval} />
)
export const useAgentProfitSharingIntervalTrans = () =>
  useTrans(AgentProfitSharingInterval)

export const AllAgentDividendSetting = {
  zh: "全民代理分紅設置",
  en: "All Agent Dividend Setting"
}
export const AllAgentDividendSettingTrans = () => (
  <Trans {...AllAgentDividendSetting} />
)

const AgentContractName = {
  zh: "名稱",
  en: "Contract name"
}
export const AgentContractNameTrans = () => <Trans {...AgentContractName} />

export const UpgradeToAgent = {
  zh: "升级代理",
  en: "Upgrade to agent",
  vi: "thăng cấp dại lý"
}
export const UpgradeToAgentTrans = () => <Trans {...UpgradeToAgent} />
export const useUpgradeToAgentTrans = () => useTrans(UpgradeToAgent)

const PlayerUpgradesToAgent = {
  zh: "玩家升级成代理",
  en: "Player upgrades to agent",
  vi: "người chơi thăng cấp thành đại lý"
}
export const PlayerUpgradesToAgentTrans = () => (
  <Trans {...PlayerUpgradesToAgent} />
)

const ConfirmUpgradeToAgent = {
  zh: "确定升级为代理?",
  en: "Are you sure to upgrade to agent?",
  vi: "xác định muốn thăng cấp thành đại lý?"
}
export const ConfirmUpgradeToAgentTrans = () => (
  <Trans {...ConfirmUpgradeToAgent} />
)

/*
TODO: rm
const ConfirmUpgradeToMasterAgent = {
  zh: "确定升级为总代?",
  en: "Are you sure to upgrade to master agent?",
  vi: "xác định muốn thăng cấp thành tổng đại lý?"
}
export const ConfirmUpgradeToMasterAgentTrans = () => (
  <Trans {...ConfirmUpgradeToMasterAgent} />
)
*/

const NegativeDividend = {
  zh: "负分红",
  en: "Negative Dividend",
  vi: "hoa hồng âm"
}
export const NegativeDividendTrans = () => <Trans {...NegativeDividend} />
export const useNegativeDividendTrans = () => useTrans(NegativeDividend)

const CumulativeNegativeDividendAmount = {
  zh: "累计负分红金额",
  en: "Cumulative negative dividend amount",
  vi: "số hoa hồng âm tích lũy"
}
export const CumulativeNegativeDividendAmountTrans = () => (
  <Trans {...CumulativeNegativeDividendAmount} />
)

const DividendAmount = {
  zh: "实际分红金额",
  en: "Dividend amount",
  vi: "số hoa hồng thực tế"
}
export const DividendAmountTrans = () => <Trans {...DividendAmount} />

const AgentBalanceAdjustment = {
  zh: "代理调账",
  en: "Agent Balance Adjustment"
}
export const AgentBalanceAdjustmentTrans = () => (
  <Trans {...AgentBalanceAdjustment} />
)
