import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { usePlatformSmsList } from "./client"
import { Select, SelectField } from "../select/Select"
import { useSMSProviderTrans } from "../trans/Sms"

export const PlatformSmsSelect = ({ brandId, placeholder, ...props }) => {
  let defaultPlaceholder = useSMSProviderTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data: items = [], error } = usePlatformSmsList(brandId)

  let options = items?.map(({ name, smsSettingId }) => ({
    label: name,
    value: smsSettingId
  }))

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}
