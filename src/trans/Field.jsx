import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const NetProfit = {
  zh: "淨盈利",
  en: "Net Profit",
  vi: "Lợi nhuận ròng"
}
export const useNetProfitTrans = () => useTrans(NetProfit)
export const NetProfitTrans = (props) => <Trans {...NetProfit} {...props} />

const SettleAmount = {
  zh: "结算金额",
  en: "Settle Amount",
  vi: "Thanh toán"
}
export const SettleAmountTrans = () => <Trans {...SettleAmount} />

export const TransactionAmount = {
  zh: "交易金额",
  en: "Amount",
  vi: "Số tiền giao dịch"
}
export const TransactionAmountTrans = () => <Trans {...TransactionAmount} />

const TransactionId = {
  zh: "交易单号",
  en: "Transaction ID",
  vi: "Mã giao dịch"
}
export const TransactionIdTrans = () => <Trans {...TransactionId} />

const Sequence = {
  zh: "序",
  en: "Sequence",
  vi: "Số thứ tự"
}
export const SequenceTrans = () => <Trans {...Sequence} />

const Subject = {
  zh: "主题",
  en: "Subject",
  vi: "Chủ đề"
}
export const SubjectTrans = () => <Trans {...Subject} />

const TotalDepositAmount = {
  zh: "总存款",
  en: "Total Deposit Amount",
  vi: "Tổng nạp"
}
export const TotalDepositAmountTrans = () => <Trans {...TotalDepositAmount} />
export const useTotalDepositAmountTrans = () => useTrans(TotalDepositAmount)

const TotalWithdrawAmount = {
  zh: "总提款",
  en: "Total Withdraw Amount",
  vi: "Tổng rút"
}
export const TotalWithdrawAmountTrans = () => <Trans {...TotalWithdrawAmount} />
export const useTotalWithdrawAmountTrans = () => useTrans(TotalWithdrawAmount)
