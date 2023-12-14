import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Select } from "../../select/Select"
import { useBrandGameProviderList } from "./client"
import { useTrans } from "../../i18n"
import { useUserBrandId } from "../../user/context"
import { useGameProviderTrans } from "../../trans/Game"

export const BrandGameProviderSelect = ({ brandId, placeholder, ...props }) => {
  let defaultPlaceholder = useGameProviderTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let userBrandId = useUserBrandId()
  brandId = userBrandId ?? brandId
  let { data, isLoading } = useBrandGameProviderList({
    showAll: true,
    brandId,
    sortby: "gameProviderName"
  })

  let options = data?.items?.map((gameProvider) => ({
    label: gameProvider.gameProviderName,
    value: gameProvider.gameProviderId
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

export default BrandGameProviderSelect
