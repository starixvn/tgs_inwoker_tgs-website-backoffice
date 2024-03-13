import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Player = {
  zh: "玩家",
  en: "Player",
  vi: "người chơi"
}
export const PlayerTrans = () => <Trans {...Player} />
export const usePlayerTrans = () => useTrans(Player)

export const PlayerManagement = {
  zh: "玩家管理",
  en: "Player management",
  vi: "Quản lý người chơi"
}
export const PlayerManagementTrans = () => <Trans {...PlayerManagement} />

export const Players = {
  zh: "玩家列表",
  en: "Players",
  vi: "Danh sách người chơi"
}
export const PlayersTrans = () => <Trans {...Players} />
export const usePlayersTrans = () => useTrans(Players)

const PlayerUsername = {
  zh: "玩家用户名",
  en: "Player Username",
  vi: "Tên người dùng"
}
export const PlayerUsernameTrans = () => <Trans {...PlayerUsername} />
export const usePlayerUsernameTrans = () => useTrans(PlayerUsername)

const PlayerCode = {
  zh: "玩家代碼",
  en: "Player Code",
  vi: "Mã người chơi"
}
export const usePlayerCodeTrans = () => useTrans(PlayerCode)
export const PlayerCodeTrans = () => <Trans {...PlayerCode} />

const AccountType = {
  zh: "帐号种类",
  en: "Account Type",
  vi: "các loại tài khoản"
}
export const AccountTypeTrans = () => <Trans {...AccountType} />

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

export const PlayerContributionReport = {
  zh: "玩家贡献报表",
  en: "Player Contribution Report",
  vi: "Hiệu suất người chơi "
}
export const PlayerContributionReportTrans = () => (
  <Trans {...PlayerContributionReport} />
)

export const PlayerDepositReport = {
  zh: "玩家存款报表",
  en: "Player Deposit Report",
  vi: "Báo cáo nạp tiền của người chơi"
}
export const PlayerDepositReportTrans = () => <Trans {...PlayerDepositReport} />

const LoginPlayers = {
  zh: "登入人數",
  en: "Login Players",
  vi: "Số người đăng nhập"
}
export const LoginPlayersTrans = () => <Trans {...LoginPlayers} />

const OnlinePlayerCount = {
  zh: "在線人數",
  en: "Online Players",
  vi: "Số người đang hoạt động "
}
export const OnlinePlayerCountTrans = () => <Trans {...OnlinePlayerCount} />

const Top10Players = {
  zh: "十大玩家",
  en: "Top 10 Players",
  vi: "10 người chơi hàng đầu"
}
export const Top10PlayersTrans = () => <Trans {...Top10Players} />

const PlayerNote = {
  zh: "玩家备註",
  en: "Player Note",
  vi: "ghi chú khách hàng"
}
export const PlayerNoteTrans = () => <Trans {...PlayerNote} />
export const usePlayerNoteTrans = () => useTrans(PlayerNote)
