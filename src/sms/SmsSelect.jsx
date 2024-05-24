import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useSmsList } from "./client"
import { Select } from "../select/Select"
import { useTrans } from "../i18n"
import { useSMSProviderTrans } from "../trans/Sms"

//TODO: filter fn
export const SmsSelect = ({ name = "smsSettingId", placeholder, ...props }) => {
  let defaultPlaceholder = useSMSProviderTrans()
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
