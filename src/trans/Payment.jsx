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

const PaymentName = {
  zh: "通道名称",
  en: "Payment Name",
  vi: "Tên kênh"
}
export const PaymentNameTrans = () => <Trans {...PaymentName} />

const DepositAmount = {
  zh: "存款金额",
  en: "Deposit Amount",
  vi: "Số tiền gửi"
}
export const DepositAmountTrans = () => <Trans {...DepositAmount} />
export const useDepositAmountTrans = () => useTrans(DepositAmount)

const ActualDepositAmount = {
  zh: "实际存款金额",
  en: "Actual Amount",
  vi: "Số tiền gửi thực tế"
}
export const ActualDepositAmountTrans = () => <Trans {...ActualDepositAmount} />

const TransferFee = {
  zh: "手续费",
  en: "Transfer Fee",
  vi: "Phí xử lý"
}
export const TransferFeeTrans = () => <Trans {...TransferFee} />

const WaitingPayment = {
  zh: "待支付",
  en: "Waiting Payment",
  vi: "Đang chờ thanh toán"
}
export const WaitingPaymentTrans = (props) => (
  <Trans {...WaitingPayment} {...props} />
)
export const useWaitingPaymentTrans = () => useTrans(WaitingPayment)

const PaidTime = {
  zh: "已支付时间",
  en: "Paid Time",
  vi: "Thời gian thanh toán"
}
export const PaidTimeTrans = () => <Trans {...PaidTime} />

const WithdrawAmount = {
  zh: "提款金额",
  en: "Amount",
  vi: "Số tiền rút"
}
export const WithdrawAmountTrans = () => <Trans {...WithdrawAmount} />
