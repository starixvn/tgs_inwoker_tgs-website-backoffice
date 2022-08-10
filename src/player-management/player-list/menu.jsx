import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "playerlist"

export const View = "view"

export const Contact = "contact"

export const PhoneFilter = "phonefilter"

export const Update = "update"

export const DepositForm = "depositform"

export const WithdrawalForm = "withdrawalform"

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
    case Contact:
      return getTrans(
        {
          zh: "联系信息",
          en: "Contact Info"
        },
        locale
      )
    case PhoneFilter:
      return getTrans(
        {
          zh: "电话过滤",
          en: "Phone Filter"
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
    case DepositForm:
      return getTrans(
        {
          zh: "存款单",
          en: "Deposit Form"
        },
        locale
      )
    case WithdrawalForm:
      return getTrans(
        {
          zh: "提款单",
          en: "Withdrawal Form"
        },
        locale
      )
    default:
      return ""
  }
}
