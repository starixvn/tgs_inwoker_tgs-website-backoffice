import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const VipLevel = {
  zh: "VIP 等级",
  en: "VIP Level",
  vi: "Cấp VIP"
}
export const useVipLevelTrans = () => useTrans(VipLevel)
export const VipLevelTrans = () => <Trans {...VipLevel} />
