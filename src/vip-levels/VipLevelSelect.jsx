import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useVipLevelList } from "./client"
import Select from "../select/Select"
import { useTrans } from "../i18n"
import { useVipLevelTrans } from "../trans/Vip"

export const VipLevelSelect = ({
  placeholder,
  brandId,
  optionValue,
  ...props
}) => {
  let defaultPlaceholder = useVipLevelTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data, error, mutate, deleteCache } = useVipLevelList({
    brandId,
    showAll: true,
    sortby: "level"
  })

  let options = data?.items?.map((item) => {
    let value = optionValue ? optionValue(item) : item?.id
    return {
      label: item.name,
      value
    }
  })

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export default VipLevelSelect
