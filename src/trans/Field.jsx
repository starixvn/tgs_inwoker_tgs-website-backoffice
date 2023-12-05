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
