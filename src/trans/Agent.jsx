import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

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
