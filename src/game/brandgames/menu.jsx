import React from "react"
import { getTrans } from "../../i18n"

export const Code = "brandgames"

export const View = "view"

export const Update = "update"

export const ViewDetail = "viewdetail"

export const UpdateDetail = "updatedetail"

export const label = ({ codes, locale }) => {
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
    case ViewDetail:
      return getTrans(
        {
          zh: "查看详情",
          en: "View Details"
        },
        locale
      )
    case UpdateDetail:
      return getTrans(
        {
          zh: "编辑详情",
          en: "Edit Details"
        },
        locale
      )
    default:
      return ""
  }
}

export const codeLabelPair = [Code, label]
