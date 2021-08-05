import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "imsettings"

export const Update = "update"

export const View = "view"

export const UpdateLiveChat = "updatelivechat"

export const ViewLiveChat = "viewlivechat"

export const label = ({ codes = [], locale = Locales.zh }) => {
  let [code = ""] = codes
  code = code.toLowerCase()

  switch (code) {
    case Update:
      return getTrans(
        {
          zh: "编辑",
          en: "Edit"
        },
        locale
      )
    case View:
      return getTrans(
        {
          zh: "查看",
          en: "View"
        },
        locale
      )
    case ViewLiveChat:
      return getTrans({
        zh: "查看即时客服",
        en: "View Live Chat"
      })
    case UpdateLiveChat:
      return getTrans({
        zh: "编辑即时客服",
        en: "Edit Live Chat"
      })
    default:
      return ""
  }
}

export const codeLabelPair = [Code, label]
