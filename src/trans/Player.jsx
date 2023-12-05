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
  vi: "Danh sách xem xét danh tính người chơi"
}
export const PlayerIdVerificationTrans = () => (
  <Trans {...PlayerIdVerification} />
)

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
