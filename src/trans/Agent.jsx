import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

export const AgentManagement = {
  zh: "代理管理",
  en: "Agent management",
  vi: "Quản lý đại lý"
}
export const AgentManagementTrans = () => <Trans {...AgentManagement} />

const UpperLevelAgent = {
  zh: "上级代理",
  en: "Upper Level Agent",
  vi: "Đại lý cấp trên"
}
export const useUpperLevelAgentTrans = () => useTrans(UpperLevelAgent)
export const UpperLevelAgentTrans = () => <Trans {...UpperLevelAgent} />
