import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code, View } from "./menu"
import { Box, Set, Button, Text, Switch, Stack, Level } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import { AllAgentDividendSettingTrans } from "../../trans/Agent"
import { usePlatformContracts } from "./client"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<AllAgentDividendSettingTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()

  let { state, setState, setPageIndex, setSortOrder } = useTable()
  //TODO: required brandId?
  let { isLoading, data, error, mutate, deleteCache } = usePlatformContracts({
    brandId
  })

  const reset = () => {
    mutate(null)
    deleteCache()
  }

  useEffect(() => {
    reset()
    setState({ pageIndex: 0, brandId })
  }, [brandId, brand])
  //TODO: fetch api

  let pageWidth = usePlatformPageContentWidth()

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return "TODO: contracts & contract table"
          }}
        </AutoSizer>
      </Box>
    </Set>
  )
}

const useColumns = ({ items = [] }) => {}
