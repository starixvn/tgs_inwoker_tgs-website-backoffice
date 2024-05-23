import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useSmsList } from "./client"
import { Select } from "../../select/Select"
import { useTrans } from "../../i18n"

//TODO: filter fn?
export const SmsSelect = ({ name = "smsSettingId", placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "簡訊商",
    en: "SMS Provider"
  })
  placeholder = placeholder ?? defaultPlaceholder
  let { isLoading, data: items = [], error } = useSmsList()

  let options = items?.map(({ name, smsSettingId }) => ({
    label: name,
    value: smsSettingId
  }))
  return (
    <Select
      name={name}
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}
