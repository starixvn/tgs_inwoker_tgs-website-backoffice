import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Flex, Set, Button, Text, Stack } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { View, Update } from "./menu"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import { ConfirmDeleteDialogDisclosure } from "../../dialog/ConfirmDeleteDialog"
import { Input } from "../../input/Input"
import { useLetterList } from "./client"
import AutoSizer from "react-virtualized-auto-sizer"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  let brandId = usePlatformId()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let toSearchParams = () => ({ ...toApiParams(state) })

  let { isLoading, data, error, mutate, deleteCache } = useLetterList(
    toSearchParams()
  )

  return (
    <Set orientation="vertical" isFilled>
      <AutoSizer>
        {({ height, width }) => {
          return ""
        }}
      </AutoSizer>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = []

    return columns
  }, [JSON.stringify(items)])
}
