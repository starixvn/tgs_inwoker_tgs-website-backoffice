import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const NetProfit = {
  zh: "淨盈利",
  en: "Net Profit",
  vi: "Lợi nhuận ròng"
}
export const useNetProfitTrans = () => useTrans(NetProfit)
export const NetProfitTrans = (props) => <Trans {...NetProfit} {...props} />
