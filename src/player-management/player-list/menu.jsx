import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "playerlist"

export const View = "view"

export const PhoneFilter = "phonefilter"

//TODO: rm, check not used
export const RealnameFilter = "realnamefilter"

export const Update = "update"

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
    case RealnameFilter:
      return getTrans(
        {
          zh: "真实姓名过滤",
          en: "Real Name Filter"
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
    default:
      return ""
  }
}
