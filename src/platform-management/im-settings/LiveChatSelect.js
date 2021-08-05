import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useTrans, Trans } from "../../i18n"
import { useFormContext } from "react-hook-form"
import { Select, SelectField } from "../../select/Select"

const LiveChat = "LiveChat"
const LiveChatTrans = {
  zh: "LiveChat",
  en: "LiveChat"
}

const Zendesk = "Zendesk"
const ZendeskTrans = {
  zh: "Zendesk",
  en: "Zendesk"
}

export const LiveChatSelect = ({ placeholder, ...props }) => {
  let defaultPlaceHolder = useTrans({
    zh: "即时客服厂商",
    en: "Live Customer Service Provider"
  })
  placeholder = placeholder ?? defaultPlaceHolder

  let options = [
    {
      label: useTrans(LiveChatTrans),
      value: LiveChat
    },
    {
      label: useTrans(ZendeskTrans),
      value: Zendesk
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const LiveChatLabel = ({ value = "" }) => {
  switch (value) {
    case LiveChat:
      return <Trans {...LiveChatTrans} />
    case Zendesk:
      return <Trans {...ZendeskTrans} />

    default:
      return value
  }
}
