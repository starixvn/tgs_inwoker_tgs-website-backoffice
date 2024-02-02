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
import {
  AgentContractNameTrans,
  AllAgentDividendSettingTrans
} from "../../trans/Agent"
import { usePlatformContracts } from "./client"
import AutoSizer from "react-virtualized-auto-sizer"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import textColumn from "../../table/column/textColumn"
import { AddContractDialogDisclosure } from "./AddContractDialog"

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

  let { isLoading, data, error, mutate, deleteCache } = usePlatformContracts(
    toApiParams({
      ...state,
      brandId
    })
  )

  const reset = () => {
    mutate(null)
    deleteCache()
  }

  useEffect(() => {
    reset()
    setState({ pageIndex: 0, brandId })
  }, [brandId, brandId])
  //TODO: fetch api

  let items = data?.items
  let columns = useColumns({
    items
  })

  let pageWidth = usePlatformPageContentWidth()

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate(null, true)
          }}
        />
        <Box>
          <AddContractDialogDisclosure brandId={brandId} onSubmitted={reset} />
        </Box>
      </Level>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={items}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(state?.pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                stickyHead
              />
            )
          }}
        </AutoSizer>
      </Box>
    </Set>
  )
}

//TODO: filters
const SearchBar = ({ search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {}
  })

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          {/*
          TODO: filters
           <InputField name=""/> 
           */}
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "name",
        Header: <AgentContractNameTrans />,
        disableSortBy: true
      })
    ]
    return columns
  })
}
