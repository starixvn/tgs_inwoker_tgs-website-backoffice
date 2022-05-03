import React from "react"
import { getTrans } from "../../i18n"

export const Code = "platformgameprovider"

export const View = "view"

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
    default:
      return ""
  }
}

export const codeLabelPair = [Code, ({ codes, locale }) => label(codes, locale)]
