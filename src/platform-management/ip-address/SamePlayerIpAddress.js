import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  Flex,
  Button,
  Text,
  Switch,
  Input,
  Stack,
  Level,
  FieldStack,
  Link
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { View } from "./menu"
import BrandBar from "../../report/BrandBar"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { Trans } from "../../i18n"
import { useSamePlayerIPAddressList } from "./client"
import { useForm, useFormContext, FormProvider } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import SearchButton from "../../button/SearchButton"
import { InputField } from "../../input/Input"
import { IpAddressTypeSelect, IpAddressTypeLabel } from "./IpAddressType"

export const SamePlayerIpAddressTabId = "SamePlayerIpAddress"

export const SamePlayerIpAddressTab = ({ ...props }) => {
  return (
    <Tab tabId={SamePlayerIpAddressTabId} {...props}>
      <Trans zh="搜索重複IP地址" en="Search Duplicate IP" />
    </Tab>
  )
}

export const SamePlayerIpAddressTabPanel = ({
  brandId,
  table,
  onClickIpAddress,
  ...props
}) => {
  let { selectedId } = props
  let isActive = selectedId === SamePlayerIpAddressTabId
  return (
    <TabPanel tabId={SamePlayerIpAddressTabId} {...props}>
      {isActive && (
        <Body
          brandId={brandId}
          table={table}
          onClickIpAddress={onClickIpAddress}
        />
      )}
    </TabPanel>
  )
}

const Body = ({ brandId, table = {}, onClickIpAddress }) => {
  let { state, setState, setPageIndex, setSortOrder } = table

  let { isLoading, data, error, mutate, deleteCache } =
    useSamePlayerIPAddressList(
      state?.ipType
        ? {
            ...toApiParams(state),
            sortby: "memberCount",
            orderby: SortOrder.Descending
          }
        : undefined
    )

  let items = data?.items
  let columns = useColumns({
    items,
    mutate,
    ipType: state?.ipType,
    onClickIpAddress
  })

  return (
    <FieldStack>
      <ActionBar
        ipType={state.ipType}
        search={(data = {}) => {
          setState({
            pageIndex: 0,
            ...data
          })
          mutate()
        }}
        isLoading={isLoading}
      />
      {state?.ipType && (
        <Table
          columns={columns}
          data={items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </FieldStack>
  )
}

const ActionBar = ({ ipType, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      ipType
    }
  })

  return (
    <Level>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(search)}>
          <Set>
            <IpAddressTypeSelect required />
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </form>
      </FormProvider>
    </Level>
  )
}

const useColumns = ({ items = [], mutate, onClickIpAddress, ipType }) => {
  let readable = useIsDisplayMenuByRoute([View])
  return useMemo(
    () => [
      sequenceColumn(),
      textColumn({
        accessor: "ipAddress",
        Header: <IpAddressTypeLabel />,
        disableSortBy: true,
        Cell: ({ value: ipAddress }) => {
          return (
            <Link
              onClick={() => {
                onClickIpAddress?.(ipAddress)
              }}
            >
              {ipAddress}
            </Link>
          )
        }
      }),
      textColumn({
        accessor: "memberCount",
        Header: <Trans zh="玩家总数" en="Member Count" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
