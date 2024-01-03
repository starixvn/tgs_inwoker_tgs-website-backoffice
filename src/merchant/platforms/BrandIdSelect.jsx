import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import Select from "../../select/Select"
import { useBrandList } from "./client"
import { useTrans } from "../../i18n"
import { usePlatformTrans } from "../../trans/Platform"

//TODO: rename to BrandSelect and add valueField prop?
export const BrandIdSelect = ({ placeholder, licenseeId, ...props }) => {
  let defaultPlaceholder = usePlatformTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data, error } = useBrandList({
    showAll: true,
    licenseeId,
    sortby: "code"
  })
  let options = data?.items.map((brand) => ({
    label: brand.code,
    value: brand.id
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

export default BrandIdSelect
