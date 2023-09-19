import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "platform"

export const View = "view"

export const label = ({ codes = [], locale = Locales.zh }) => {
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

export const codeLabelPair = [Code, label]
