import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Time = {
  zh: "时间",
  en: "Time",
  vi: "Thời gian"
}
export const TimeTrans = () => <Trans {...Time} />

const Yesterday = {
  zh: "昨日",
  en: "Yesterday",
  vi: "Hôm qua"
}
export const useYesterdayTrans = () => useTrans(Yesterday)
export const YesterdayTrans = () => <Trans {...Yesterday} />

const Today = {
  zh: "今日",
  en: "Today",
  vi: "Hôm nay"
}
export const useTodayTrans = () => useTrans(Today)
export const TodayTrans = () => <Trans {...Today} />

const LastWeek = {
  zh: "上周",
  en: "Last Week",
  vi: "Tuần trước"
}
export const useLastWeekTrans = () => useTrans(LastWeek)
export const LastWeekTrans = () => <Trans {...LastWeek} />

const ThisWeek = {
  zh: "本周",
  en: "This Week",
  vi: "Tuần này"
}
export const useThisWeekTrans = () => useTrans(ThisWeek)
export const ThisWeekTrans = () => <Trans {...ThisWeek} />

const LastMonth = {
  zh: "上月",
  en: "Last Month",
  vi: "Tháng trước"
}
export const useLastMonthTrans = () => useTrans(LastMonth)
export const LastMonthTrans = () => <Trans {...LastMonth} />

const ThisMonth = {
  zh: "本月",
  en: "This Month",
  vi: "Tháng này"
}
export const useThisMonthTrans = () => useTrans(ThisMonth)
export const ThisMonthTrans = () => <Trans {...ThisMonth} />

const ApplicationTime = {
  zh: "申请时间",
  en: "Application Time",
  vi: "Thời gian nộp đơn"
}
export const ApplicationTimeTrans = () => <Trans {...ApplicationTime} />

const UpdatedTime = {
  zh: "更新时间",
  en: "Updated Time",
  vi: "Thời gian cập nhật"
}
export const UpdatedTimeTrans = () => <Trans {...UpdatedTime} />
