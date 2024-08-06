import React from "react"
import { Locales, getTrans } from "../../i18n"

export const Code = "imsettings"

export const Update = "update"

export const View = "view"

export const UpdateLiveChat = "updatelivechat"

export const ViewLiveChat = "viewlivechat"

export const UpdateAllAgent = "updateallagent"

export const ViewAllAgent = "viewallagent"

export const ViewSms = "viewsms"

export const UpdateSms = "updatesms"

export const ViewContactField = "viewcontactfield"

export const UpdateContactField = "updatecontactfield"

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
      return getTrans(
        {
          zh: "查看即时客服",
          en: "View Live Chat"
        },
        locale
      )
    case UpdateLiveChat:
      return getTrans(
        {
          zh: "编辑即时客服",
          en: "Edit Live Chat"
        },
        locale
      )
    case ViewAllAgent:
      return getTrans(
        {
          zh: "查看全民代理",
          en: "View All Agent"
        },
        locale
      )
    case UpdateAllAgent:
      return getTrans(
        {
          zh: "编辑全民代理",
          en: "Edit All Agent"
        },
        locale
      )
    case ViewSms:
      return getTrans(
        {
          zh: "查看简讯验证",
          en: "View SMS Verification"
        },
        locale
      )
    case UpdateSms:
      return getTrans(
        {
          zh: "编辑简讯验证",
          en: "Edit SMS Verification"
        },
        locale
      )
    case ViewContactField:
      return getTrans(
        {
          zh: "查看联系信息",
          en: "View Contact Info"
        },
        locale
      )
    case UpdateContactField:
      return getTrans(
        {
          zh: "编辑联系信息",
          en: "Edit Contact Info"
        },
        locale
      )
    default:
      return ""
  }
}

export const codeLabelPair = [Code, label]
