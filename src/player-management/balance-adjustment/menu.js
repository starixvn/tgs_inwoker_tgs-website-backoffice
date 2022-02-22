import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "balanceadjustment"

export const View = "view"

export const Update = "update"

export const SystemReportType = "systemreporttype"

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
    case SystemReportType:
      return getTrans(
        {
          zh: "系统报表类型",
          en: "System Report Type"
        },
        locale
      )
    default:
      return ""
  }
}
