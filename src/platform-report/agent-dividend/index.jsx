import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Popover,
  Icon,
  List
} from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { AgentDividendDistributionTrans } from "../../trans/Vip"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { useAgentDividendList } from "./client"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<AgentDividendDistributionTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = ({}) => {
  let brandId = usePlatformId()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, deleteCache } = useAgentDividendList(
    toApiParams(state)
  )

  return `${JSON.stringify(data)}`
}

export const CodeContentPair = [Code, Content]
