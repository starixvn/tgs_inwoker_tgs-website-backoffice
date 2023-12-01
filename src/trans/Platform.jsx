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
