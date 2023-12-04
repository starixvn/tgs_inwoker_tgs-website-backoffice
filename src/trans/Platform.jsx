import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const ThirdPartyId = {
  zh: "三方单号",
  en: "3rd Party Id",
  vi: "Mã đơn bên thứ ba"
}
export const ThirdPartyIdTrans = () => <Trans {...ThirdPartyId} />
export const useThirdPartyIdTrans = () => useTrans(ThirdPartyId)

const GmsId = {
  zh: "GMS订单号",
  en: "GMS Id",
  vi: "Mã đơn GMS"
}
export const GmsIdTrans = () => <Trans {...GmsId} />
export const useGmsIdTrans = () => useTrans(GmsId)

const SystemId = {
  zh: "系统订单编号",
  en: "System Id",
  vi: "Mã đơn hệ thống"
}
export const SystemIdTrans = () => <Trans {...SystemId} />
export const useSystemIdTrans = () => useTrans(SystemId)

export const BalanceChangeReport = {
  zh: "帳變報表",
  en: "Balance Change Report",
  vi: "Báo cáo biến động giao dịch"
}
export const BalanceChangeReportTrans = () => <Trans {...BalanceChangeReport} />

export const PlatformManagement = {
  zh: "平台管理",
  en: "Platform",
  vi: "Quản lý nền tảng"
}
export const PlatformManagementTrans = () => <Trans {...PlatformManagement} />

export const CheckIP = {
  zh: "檢核IP地址",
  en: "Check IP",
  vi: "Xét duyệt địa chỉ IP"
}
export const CheckIPTrans = () => <Trans {...CheckIP} />

const SearchDuplicateIP = {
  zh: "搜索重複IP地址",
  en: "Search Duplicate IP",
  vi: "Tìm kiếm địa chỉ IP trùng lặp"
}
export const SearchDuplicateIPTrans = () => <Trans {...SearchDuplicateIP} />

const SearchIPByAccountID = {
  zh: "按玩家帳號搜索IP",
  en: "Search IP By Account ID",
  vi: "Nhấn tài khoản người chơi tìm kiếm IP"
}
export const SearchIPByAccountIDTrans = () => <Trans {...SearchIPByAccountID} />

const SearchMemberByIP = {
  zh: "按IP 搜索玩家",
  en: "Search Member By IP",
  vi: "Nhấn IP tìm kiếm người chơi"
}
export const SearchMemberByIPTrans = () => <Trans {...SearchMemberByIP} />

export const StationLetter = {
  zh: "站内信",
  en: "Station Letter",
  vi: "Thư nội bộ"
}
export const StationLetterTrans = () => <Trans {...StationLetter} />
