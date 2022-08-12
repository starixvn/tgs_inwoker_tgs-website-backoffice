import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "gameproviderround"

export const View = "view"

export const Update = "update"

export const Export = "export"

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
    case Export:
      return getTrans(
        {
          zh: "匯出",
          en: "Export"
        },
        locale
      )
    default:
      return ""
  }
}
