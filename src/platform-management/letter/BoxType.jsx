import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, OptionButtons } from "bumbag"
import { useTrans } from "../../i18n"

const Inbox = "Inbox"
const InboxTrans = {
  zh: "收件匣",
  en: "Inbox"
}

const Sent = "Sent"
const SentTrans = {
  zh: "寄件匣",
  en: "Sent"
}

export const BoxType = {
  Inbox,
  Sent
}

export const isInbox = (value) => value === Inbox

export const isSentBox = (value) => value === Sent

export const BoxTypeButtons = ({
  type = "radio",
  defaultValue = Inbox,
  onChange,
  ...props
}) => {
  let [value, setValue] = useState(defaultValue)
  let options = [
    {
      label: useTrans(InboxTrans),
      value: Inbox
    },
    {
      label: useTrans(SentTrans),
      value: Sent
    }
  ]

  return (
    <OptionButtons
      type={type}
      palette="info"
      options={options}
      value={value}
      onChange={(val) => {
        setValue(val)
        onChange?.(val)
      }}
    />
  )
}
