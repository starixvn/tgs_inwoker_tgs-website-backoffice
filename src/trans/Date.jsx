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

const CreatedTime = {
  zh: "创建时间",
  en: "Created Time",
  vi: "Thời gian lập"
}
export const CreatedTimeTrans = () => <Trans {...CreatedTime} />

const UpdatedTime = {
  zh: "更新时间",
  en: "Updated Time",
  vi: "Thời gian cập nhật"
}
export const UpdatedTimeTrans = () => <Trans {...UpdatedTime} />

const SentOn = {
  zh: "派发时间",
  en: "Sent On",
  vi: "Thời gian phân phát"
}
export const SentOnTrans = () => <Trans {...SentOn} />

const ParticipationTime = {
  zh: "参加时间",
  en: "Participation Time",
  vi: "Thời gian tham gia"
}
export const ParticipationTimeTrans = () => <Trans {...ParticipationTime} />

const VerifyTime = {
  zh: "审核时间",
  en: "Verify Time",
  vi: "Thời gian kiểm tra/xem xét"
}
export const VerifyTimeTrans = () => <Trans {...VerifyTime} />

const PeriodicMaintenanceTime = {
  zh: "定期维护时间",
  en: "Periodic Maintenance Time",
  vi: "Thời gian bảo trì định kỳ"
}
export const PeriodicMaintenanceTimeTrans = () => (
  <Trans {...PeriodicMaintenanceTime} />
)

const StartTime = {
  zh: "开始时间",
  en: "Start Time",
  vi: "Thời gian bắt đầu"
}
export const StartTimeTrans = () => <Trans {...StartTime} />

const EndTime = {
  zh: "结束时间",
  en: "End Time",
  vi: "Thời gian kết thúc"
}
export const EndTimeTrans = () => <Trans {...EndTime} />
