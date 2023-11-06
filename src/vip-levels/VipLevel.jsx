import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Dialog, Text, Box, List, Spinner } from "bumbag"
import { ViewDisclosure } from "../dialog/Disclosure"
import { Locales, Trans, useTrans } from "../i18n"
import { useVipLevelList } from "./client"
import LoadingBackdrop from "../dialog/LoadingBackdrop"
import AlertDialog from "../dialog/Alert"

export const VipLevelLabel = ({ value, placeholder = "-", ...props }) => {
  if (Number.isInteger(value)) {
    return `VIP ${value}`
  }

  return value ?? placeholder
}

export const VipLevelIdLabel = ({ value, brandId }) => {
  let { isLoading, data, error, mutate, deleteCache } = useVipLevelList({
    brandId,
    showAll: true,
    sortby: "level"
  })

  if (isLoading) {
    return <Spinner />
  }

  //TODO: fine tune find fn
  let vipLevel = data?.items?.find(({ id }) => id === value)
  return Number.isFinite(vipLevel?.level) ? `VIP ${vipLevel?.level}` : ""
}
