import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

export const Players = {
  zh: "玩家列表",
  en: "Players",
  vi: "Danh sách người chơi"
}
export const PlayersTrans = () => <Trans {...Players} />
export const usePlayersTrans = () => useTrans(Players)

const PlayerCode = {
  zh: "玩家代碼",
  en: "Player Code",
  vi: "Mã người chơi"
}
export const usePlayerCodeTrans = () => useTrans(PlayerCode)
export const PlayerCodeTrans = () => <Trans {...PlayerCode} />

const RegistrationDomain = {
  zh: "注册域名",
  en: "Registration Domain",
  vi: "Link đăng ký  / Trang web đăng kí"
}
export const useRegistrationDomainTrans = () => useTrans(RegistrationDomain)
export const RegistrationDomainTrans = () => <Trans {...RegistrationDomain} />

const WageringRequirement = {
  zh: "流水需求",
  en: "Wagering Requirement",
  vi: "vòng cược yêu cầu"
}
export const WageringRequirementTrans = () => <Trans {...WageringRequirement} />
export const useWageringRequirementTrans = () => useTrans(WageringRequirement)

const PlayerWinLoss = {
  zh: "玩家输赢金额",
  en: "Player Win Loss",
  vi: "Thắng thua của người chơi"
}
export const PlayerWinLossTrans = () => <Trans {...PlayerWinLoss} />
export const usePlayerWinLossTrans = () => useTrans(PlayerWinLoss)

export const PlayerIdVerification = {
  zh: "玩家身分审核列表",
  en: "Player ID Verification",
  vi: "Danh sách xác minh danh tính của người chơi"
}
export const PlayerIdVerificationTrans = () => (
  <Trans {...PlayerIdVerification} />
)

const PlayerIdVerificationInfo = {
  zh: "請注意，此頁面僅會顯示已上傳身分證資料之玩家。",
  en: "Please be aware that this page will show the players who have uploaded ID verification materials ONLY.",
  vi: "Cảnh báo, chỉ hiển thị người chơi đã tải lên thông tin chứng minh nhân dân"
}
export const PlayerIdVerificationInfoTrans = () => (
  <Trans {...PlayerIdVerificationInfo} />
)

const PlayerIdVerificationStatus = {
  zh: "实名认证状态",
  en: "Review Identity Status",
  vi: "Trạng thái xác minh danh tính"
}
export const PlayerIdVerificationStatusTrans = () => (
  <Trans {...PlayerIdVerificationStatus} />
)
export const usePlayerIdVerificationStatusTrans = () =>
  useTrans(PlayerIdVerificationStatus)

export const OnlinePlayers = {
  zh: "在线玩家列表",
  en: "Online Players",
  vi: "Danh sách người chơi trực tuyến"
}
export const OnlinePlayersTrans = () => <Trans {...OnlinePlayers} />

export const PlayerBalanceAdjustment = {
  zh: "玩家调账",
  en: "Balance Adjustment",
  vi: "Điều chỉnh người chơi"
}
export const PlayerBalanceAdjustmentTrans = () => (
  <Trans {...PlayerBalanceAdjustment} />
)

const PlayerInfo = {
  zh: "玩家信息",
  en: "Player",
  vi: "Thông tin người chơi"
}
export const PlayerInfoTrans = () => <Trans {...PlayerInfo} />

const BatchAddBalance = {
  zh: "批量加钱",
  en: "Batch Add Balance",
  vi: "Nạp tiền hàng loạt"
}
export const BatchAddBalanceTrans = () => <Trans {...BatchAddBalance} />

const BatchAddBalanceTitle = {
  zh: "批量余额加分",
  en: "Batch Add Balance",
  vi: "Cộng điểm vào số dư hàng loạt"
}
export const BatchAddBalanceTitleTrans = () => (
  <Trans {...BatchAddBalanceTitle} />
)
export const useBatchAddBalanceTitleTrans = () => useTrans(BatchAddBalanceTitle)

const BatchAddBalanceAlert = {
  zh: "請注意，若輸入小於0的流水金額，將視為0。",
  en: "Please note that any wagering requirement amount below 0 will be considered as 0.",
  vi: "Cảnh báo: Nếu nhập số tiền doanh số nhỏ hơn 0, nó sẽ được coi là 0"
}
export const BatchAddBalanceAlertTrans = () => (
  <Trans {...BatchAddBalanceAlert} />
)

const TotalOnlinePlayers = {
  zh: "在线玩家总数：",
  en: "Total Online Players：",
  vi: "Tổng số người chơi trực tuyến/Số lượng người chơi đang online："
}
export const TotalOnlinePlayersTrans = () => <Trans {...TotalOnlinePlayers} />

const PlayerStatusRegisterUndone = {
  zh: "注册中",
  en: "Under Registration",
  vi: "Đang đăng ký"
}
export const PlayerStatusRegisterUndoneTrans = () => (
  <Trans {...PlayerStatusRegisterUndone} />
)
export const usePlayerStatusRegisterUndoneTrans = () =>
  useTrans(PlayerStatusRegisterUndone)
