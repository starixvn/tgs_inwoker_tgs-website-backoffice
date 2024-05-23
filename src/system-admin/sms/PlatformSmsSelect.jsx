import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { usePlatformSmsList } from "./client"
import Select from "../../select/Select"

//TODO: placeholder?
export const PlatformSmsSelect = ({ brandId, ...props }) => {
  let { isLoading, data: items = [], error } = usePlatformSmsList(brandId)

  let options = items?.map(({ name, smsSettingId }) => ({
    label: name,
    value: smsSettingId
  }))
  return <Select isLoading={isLoading} options={options} {...props} />
}
