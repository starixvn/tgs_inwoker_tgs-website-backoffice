import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useTrans, Trans } from "../../i18n"
import { useFormContext } from "react-hook-form"
import { Select, SelectField } from "../../select/Select"

export const Url = "Url"
const UrlTrans = {
  zh: "Url",
  en: "Url"
}

export const Script = "Script"
const ScriptTrans = {
  zh: "Script",
  en: "Script"
}

export default {
  Url,
  Script
}

export const LiveChatTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceHolder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceHolder

  let options = [
    {
      label: useTrans(UrlTrans),
      value: Url
    },
    {
      label: useTrans(ScriptTrans),
      value: Script
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const LiveChatTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Url:
      return <Trans {...UrlTrans} />
    case Script:
      return <Trans {...ScriptTrans} />

    default:
      return value
  }
}
