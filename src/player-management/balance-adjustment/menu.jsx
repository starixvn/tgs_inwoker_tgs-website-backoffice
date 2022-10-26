import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "balanceadjustment"

export const View = "view"

export const Update = "update"

export const SystemTransactionType = "systemtransactiontype"

export const BonusAdjustTransactionType = "bonusadjusttransactiontype"

export const BatchAddBalance = "batchaddbalance"

export const codeLabelPair = [Code, ({ codes, locale }) => label(codes, locale)]

export const label = (codes = [], locale = Locales.zh) => {
  let [code = ""] = codes
  code = code.toLowerCase()

  switch (code) {
    case View:
      return getTrans(
        {
          zh: "查看",
          en: "View"
        },
        locale
      )
    case Update:
      return getTrans(
        {
          zh: "编辑",
          en: "Edit"
        },
        locale
      )
    case SystemTransactionType:
      return getTrans(
        {
          zh: "系统调帐",
          en: "System Adjust"
        },
        locale
      )
    case BonusAdjustTransactionType:
      return getTrans(
        {
          zh: "优惠调帐",
          en: "Bonus Adjust"
        },
        locale
      )
    case BatchAddBalance:
      return getTrans(
        {
          zh: "批量加钱",
          en: "Batch Add Balance"
        },
        locale
      )
    default:
      return ""
  }
}
