import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "agentlist"

export const View = "view"

export const Update = "update"

export const UpdateIngress = "updateingress"

export const UpdateDnsZone = "updatednszone"

export const UpdateDomain = "updatedomain"

//TODO: required?
export const LookupWhois = "lookupwhois"

export const ClearProfitSharing = "clearprofitshare"

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
    case ClearProfitSharing:
      return getTrans(
        {
          zh: "清除累計結算分紅",
          en: "Clear Accumulated Profit Share"
        },
        locale
      )
    case LookupWhois:
      return "Lookup Whois"
    default:
      return ""
  }
}
