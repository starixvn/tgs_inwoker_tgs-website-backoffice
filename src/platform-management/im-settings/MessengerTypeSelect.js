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

export const MessengerTypeSelect = ({ ...props }) => {
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
    }
  ]

  return <Select options={options} {...props} />
}

export const MessengerTypeLabel = ({ value = "" }) => {
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
    default:
      return value
  }
}
