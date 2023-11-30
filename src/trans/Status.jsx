import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Status = {
  zh: "状态",
  en: "Status",
  vi: "Trạng thái"
}
export const useStatusTrans = () => useTrans(Status)
export const StatusTrans = () => <Trans {...Status} />

const InBlacklist = {
  zh: "黑名单",
  en: "In Blacklist",
  vi: "Danh sách đen"
}
export const useInBlacklistTrans = () => useTrans(InBlacklist)
export const InBlacklistTrans = () => <Trans {...InBlacklist} />
