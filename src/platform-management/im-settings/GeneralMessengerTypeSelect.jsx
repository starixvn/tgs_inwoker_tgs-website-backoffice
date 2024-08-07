import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useTrans, Trans } from "../../i18n"
import { useFormContext } from "react-hook-form"
import { Select } from "../../select/Select"
import {
  LineTrans,
  SkypeTrans,
  TelegramTrans,
  ViberTrans,
  WeChatTrans,
  WhatsAppTrans,
  ZaloTrans,
  useLineTrans,
  useSkypeTrans,
  useTelegramTrans,
  useViberTrans,
  useWeChatTrans,
  useWhatsAppTrans,
  useZaloTrans
} from "../../trans/User"

const WeChat = "WeChat"

const WhatsApp = "WhatsApp"

const Telegram = "Telegram"

const KakaoTalk = "KakaoTalk"
const KakaoTalkTrans = {
  zh: "KakaoTalk",
  en: "KakaoTalk"
}

const Line = "Line"

const Skype = "Skype"

const Viber = "Viber"

const Zalo = "Zalo"

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
      label: useWeChatTrans(),
      value: WeChat
    },
    {
      label: useWhatsAppTrans(),
      value: WhatsApp
    },
    {
      label: useTelegramTrans(),
      value: Telegram
    },
    {
      label: useTrans(KakaoTalkTrans),
      value: KakaoTalk
    },
    {
      label: useLineTrans(),
      value: Line
    },
    {
      label: useSkypeTrans(),
      value: Skype
    },
    {
      label: useViberTrans(),
      value: Viber
    },
    {
      label: useZaloTrans(),
      value: Zalo
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const GeneralMessengerTypeLabel = ({ value = "" }) => {
  switch (value) {
    case WeChat:
      return <WeChatTrans />
    case WhatsApp:
      return <WhatsAppTrans />
    case Telegram:
      return <TelegramTrans />
    case KakaoTalk:
      return <Trans {...KakaoTalkTrans} />
    case Line:
      return <LineTrans />
    case Skype:
      return <SkypeTrans />
    case Viber:
      return <ViberTrans />
    case Zalo:
      return <ZaloTrans />
    default:
      return value
  }
}
