import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import Select from "../../select/Select"
import { useLicenseeList } from "./client"
import { useTrans } from "../../i18n"
import { useLicenseeTrans } from "../../trans/Platform"

export const LicenseeIdSelect = ({ placeholder, resellerId, ...props }) => {
  let defaultPlaceholder = useLicenseeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data, error } = useLicenseeList({
    showAll: true,
    resellerId,
    sortby: "code"
  })
  let options = data?.items.map((licensee) => ({
    label: licensee.code,
    value: licensee.id
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

export default LicenseeIdSelect
