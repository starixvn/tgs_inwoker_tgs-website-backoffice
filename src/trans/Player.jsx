import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

export const Players = {
  zh: "玩家列表",
  en: "Players",
  vi: "Danh sách người chơi"
}
export const usePlayersTrans = () => useTrans(Players)
export const PlayersTrans = () => <Trans {...Players} />

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

const PlayerSettleAmount = {
  zh: "派彩",
  en: "Settle Amount",
  vi: "Thanh toán"
}
export const PlayerSettleAmountTrans = () => <Trans {...PlayerSettleAmount} />

const PlayerWinLoss = {
  zh: "玩家输赢金额",
  en: "Player Win Loss",
  vi: "Thắng thua của người chơi"
}
export const PlayerWinLossTrans = () => <Trans {...PlayerWinLoss} />
export const usePlayerWinLossTrans = () => useTrans(PlayerWinLoss)
