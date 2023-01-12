import React from "react"
import { getTrans, Locales } from "../../i18n"

export const Code = "promotionlist"

export const View = "view"

export const Update = "update"

export const ChangeLog = "changelog"

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
    case ChangeLog:
      return getTrans(
        {
          zh: "变更纪录",
          en: "Change Log"
        },
        locale
      )
    default:
      return ""
  }
}

export const codeLabelPair = [Code, ({ codes, locale }) => label(codes, locale)]
