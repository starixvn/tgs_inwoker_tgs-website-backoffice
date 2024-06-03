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

const SMSProviderManagement = {
  zh: "简讯商管理",
  en: "SMS Provider Management",
  vi: "Quản lý nhà cung cấp SMS"
}
export const SMSProviderManagementTrans = () => (
  <Trans {...SMSProviderManagement} />
)

const SMSProviderName = {
  zh: "简讯商名称",
  en: "SMS Provider Name",
  vi: "Tên nhà cung cấp SMS"
}
export const SMSProviderNameTrans = () => <Trans {...SMSProviderName} />

const SMSProviderCode = {
  zh: "简讯商代码",
  en: "SMS Provider Code",
  vi: "Mã nhà cung cấp SMS"
}
export const SMSProviderCodeTrans = () => <Trans {...SMSProviderCode} />
export const useSMSProviderCodeTrans = () => useTrans(SMSProviderCode)

const SetupSMSProviderWithPlatform = {
  zh: "设定简讯商平台",
  en: "Setup SMS Provider with Platform",
  vi: "Chỉ định nhà cung cấp SMS cho nền tảng"
}
export const SetupSMSProviderWithPlatformTrans = () => (
  <Trans {...SetupSMSProviderWithPlatform} />
)
