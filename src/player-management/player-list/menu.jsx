import React from "react"
import { Locales, getTrans } from "../../i18n"
import {
  DepositForm as DepositFormMsg,
  WithdrawForm as WithdrawFormMsg
} from "../../trans/User"
import { UpgradeToAgent } from "../../trans/Agent"

export const Code = "playerlist"

export const View = "view"

export const Contact = "contact"

export const PhoneFilter = "phonefilter"

export const Update = "update"

export const DepositForm = "depositform"

export const WithdrawalForm = "withdrawalform"

export const BalanceChangeUnsaved = "balancechangeunsaved"

export const EditIdNumber = "editidnumber"

export const UpgradePlayerToAgent = "upgradetoagent"

const Bank = "bank"

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
      return getTrans(DepositFormMsg, locale)
    case WithdrawalForm:
      return getTrans(WithdrawFormMsg, locale)
    case BalanceChangeUnsaved:
      return getTrans(
        {
          zh: "未寫入資料",
          en: "Unsaved Data"
        },
        locale
      )
    case EditIdNumber:
      return getTrans(
        {
          zh: "修改身分证",
          en: "Edit IC Number"
        },
        locale
      )
    case UpgradePlayerToAgent:
      return getTrans(UpgradeToAgent, locale)
    default:
      return ""
  }
}
