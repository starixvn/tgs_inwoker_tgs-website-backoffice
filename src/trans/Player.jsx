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
export const useWageringRequirementsTrans = () => useTrans(WageringRequirement)
export const WageringRequirementsTrans = () => (
  <Trans {...WageringRequirement} />
)
