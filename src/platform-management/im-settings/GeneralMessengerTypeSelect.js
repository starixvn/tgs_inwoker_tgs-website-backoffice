import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useTrans, Trans } from "../../i18n"
import { useFormContext } from "react-hook-form"
import { Select } from "../../select/Select"

const WeChat = "WeChat"
const WeChatTrans = {
  zh: "微信",
  en: "WeChat"
}

const WhatsApp = "WhatsApp"
const WhatsAppTrans = {
  zh: "WhatsApp",
  en: "WhatsApp"
}

const Telegram = "Telegram"
const TelegramTrans = {
  zh: "Telegram",
  en: "Telegram"
}

const KakaoTalk = "KakaoTalk"
const KakaoTalkTrans = {
  zh: "KakaoTalk",
  en: "KakaoTalk"
}

const Line = "Line"
const LineTrans = {
  zh: "LINE",
  en: "LINE"
}

const Skype = "Skype"
const SkypeTrans = {
  zh: "Skype",
  en: "Skype"
}

const Viber = "Viber"
const ViberTrans = {
  zh: "Viber",
  en: "Viber"
}

const Zalo = "Zalo"
const ZaloTrans = {
  zh: "Zalo",
  en: "Zalo"
}

const GeneralMessengerList = [
  WeChat,
  WhatsApp,
  Telegram,
  KakaoTalk,
  Line,
  Skype,
  Viber,
  Zalo
]

export const isGeneralMessengerType = (value = "") => {
  return GeneralMessengerList.includes(value)
}

export const GeneralMessengerTypeSelect = ({ ...props }) => {
  let placeholder = useTrans({
    zh: "通讯软体",
    en: "Messenger"
  })
  let options = [
    {
      label: useTrans(WeChatTrans),
      value: WeChat
    },
    {
      label: useTrans(WhatsAppTrans),
      value: WhatsApp
    },
    {
      label: useTrans(TelegramTrans),
      value: Telegram
    },
    {
      label: useTrans(KakaoTalkTrans),
      value: KakaoTalk
    },
    {
      label: useTrans(LineTrans),
      value: Line
    },
    {
      label: useTrans(SkypeTrans),
      value: Skype
    },
    {
      label: useTrans(ViberTrans),
      value: Viber
    },
    {
      label: useTrans(ZaloTrans),
      value: Zalo
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const GeneralMessengerTypeLabel = ({ value = "" }) => {
  switch (value) {
    case WeChat:
      return <Trans {...WeChatTrans} />
    case WhatsApp:
      return <Trans {...WhatsAppTrans} />
    case Telegram:
      return <Trans {...TelegramTrans} />
    case KakaoTalk:
      return <Trans {...KakaoTalkTrans} />
    case Line:
      return <Trans {...LineTrans} />
    case Skype:
      return <Trans {...SkypeTrans} />
    case Viber:
      return <Trans {...ViberTrans} />
    case Zalo:
      return <Trans {...ZaloTrans} />
    default:
      return value
  }
}
