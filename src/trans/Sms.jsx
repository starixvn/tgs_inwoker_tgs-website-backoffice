import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const SMSProvider = {
  zh: "简讯商",
  en: "SMS Provider",
  vi: "Nhà cung cấp tin nhắn SMS"
}
export const SMSProviderTrans = () => <Trans {...SMSProvider} />
export const useSMSProviderTrans = () => useTrans(SMSProvider)

//TODO: rm
/*
const SMSVerification = {
  zh: "简讯验证",
  en: "SMS Verification",
  vi: "Xác minh qua SMS"
}
export const SMSVerificationTrans = () => <Trans {...SMSVerification} />
export const useSMSVerificationTrans = () => useTrans(SMSVerification)
*/

export const SMSProviderManagement = {
  zh: "简讯商管理",
  en: "SMS Provider Management"
}
export const SMSProviderManagementTrans = () => (
  <Trans {...SMSProviderManagement} />
)

const SMSProviderName = {
  zh: "简讯商名称",
  en: "SMS Provider Name"
}
export const SMSProviderNameTrans = () => <Trans {...SMSProviderName} />

const SMSProviderCode = {
  zh: "简讯商代码",
  en: "SMS Provider Code"
}
export const SMSProviderCodeTrans = () => <Trans {...SMSProviderCode} />
export const useSMSProviderCodeTrans = () => useTrans(SMSProviderCode)

const CurrentSMSProvider = {
  zh: "目前使用的简讯商",
  en: "Current SMS Provider"
}
export const useCurrentSMSProviderTrans = () => useTrans(CurrentSMSProvider)

const ChangeSMSProvider = {
  zh: "切换简讯商",
  en: "Change SMS Provider"
}
export const useChangeSMSProviderTrans = () => useTrans(ChangeSMSProvider)

const SetupSMSProviderWithPlatform = {
  zh: "设定简讯商平台",
  en: "Setup SMS Provider with Platform"
}
export const SetupSMSProviderWithPlatformTrans = () => (
  <Trans {...SetupSMSProviderWithPlatform} />
)
export const useSetupSMSProviderWithPlatformTrans = () =>
  useTrans(SetupSMSProviderWithPlatform)
