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
