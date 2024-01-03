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
