import React from "react"
import { Locales, getTrans } from "../../i18n"
import { View as ViewMsg } from "../../trans/Action"

export const Code = "agentlist"

export const View = "view"

export const Update = "update"

export const UpdateIngress = "updateingress"

export const UpdateDnsZone = "updatednszone"

export const UpdateDomain = "updatedomain"

//TODO: required?
export const LookupWhois = "lookupwhois"

export const ClearProfitShare = "clearprofitshare"

export const ChangeWithdrawalPassword = "changewithdrawalpassword"

export const GameTypeFee = "gametypefee"

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
    case UpdateDomain:
      return getTrans(
        {
          zh: "编辑代理连结",
          en: "Edit Agent Link"
        },
        locale
      )
    case UpdateIngress:
      return "Edit Ingress"
    case UpdateDnsZone:
      return "Edit DNS Zone"
    case ClearProfitShare:
      return getTrans(
        {
          zh: "清除累計結算分紅",
          en: "Clear Accumulated Profit Share"
        },
        locale
      )
    case ChangeWithdrawalPassword:
      return getTrans(
        {
          zh: "修改提款密码",
          en: "Change Withdrawal Password"
        },
        locale
      )
    case LookupWhois:
      return "Lookup Whois"
    //TODO: trans
    case GameTypeFee:
      return "Game Type Fee"
    default:
      return ""
  }
}
