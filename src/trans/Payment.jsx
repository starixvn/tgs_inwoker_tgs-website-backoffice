import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

export const DepositList = {
  zh: "存款列表",
  en: "Deposit List",
  vi: "Lịch sử nạp"
}
export const DepositListTrans = () => <Trans {...DepositList} />

//TODO: vi trans
export const WithdrawList = {
  zh: "提款列表",
  en: "Withdraw List"
}
export const WithdrawListTrans = () => <Trans {...WithdrawList} />

const ChannelName = {
  zh: "通道名称",
  en: "Channel Name",
  vi: "Tên kênh"
}
export const ChannelNameTrans = () => <Trans {...ChannelName} />
export const useChannelNameTrans = () => useTrans(ChannelName)

const PaymentProvider = {
  zh: "金流商",
  en: "Payment Provider",
  vi: "Tên kênh"
}
export const PaymentProviderTrans = () => <Trans {...PaymentProvider} />
export const usePaymentProviderTrans = () => useTrans(PaymentProvider)

//TODO: vi trans
const PaymentMethod = {
  zh: "支付方式",
  en: "Payment Method"
}
export const PaymentMethodTrans = () => <Trans {...PaymentMethod} />
export const usePaymentMethodTrans = () => useTrans(PaymentMethod)

const DepositPaymentMethod = {
  zh: "存款类型",
  en: "Payment Method",
  vi: "Loại tiền gửi"
}
export const DepositPaymentMethodTrans = () => (
  <Trans {...DepositPaymentMethod} />
)
export const useDepositPaymentMethodTrans = () => useTrans(DepositPaymentMethod)
