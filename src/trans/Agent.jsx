import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const UpperLevelAgent = {
  zh: "上级代理",
  en: "Upper Level Agent",
  vi: "Đại lý cấp trên"
}
export const useUpperLevelAgentTrans = () => useTrans(UpperLevelAgent)
export const UpperLevelAgentTrans = () => <Trans {...UpperLevelAgent} />
