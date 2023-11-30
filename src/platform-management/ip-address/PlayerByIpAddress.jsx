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
  Dialog,
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
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { Trans } from "../../i18n"
import { usePlayerIPAddressListByIP } from "./client"
import { useForm, useFormContext, FormProvider } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import SearchButton from "../../button/SearchButton"
import { InputField } from "../../input/Input"
import { IpAddressTypeSelect } from "./IpAddressType"
import { TimeTrans } from "../../trans/Date"

export const PlayerByIpAddressTabId = "PlayerByIpAddress"

export const PlayerByIpAddressTab = ({ ...props }) => {
  return (
    <Tab tabId={PlayerByIpAddressTabId} {...props}>
      <Trans zh="按IP 搜索玩家" en="Search Member By IP" />
    </Tab>
  )
}

export const PlayerByIpAddressTabPanel = ({ brandId, table, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === PlayerByIpAddressTabId
  return (
    <TabPanel tabId={PlayerByIpAddressTabId} {...props}>
      {isActive && <Body brandId={brandId} table={table} />}
    </TabPanel>
  )
}

const Body = ({ brandId, table = {} }) => {
  let { state, setState, setPageIndex, setSortOrder } = table
  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerIPAddressListByIP(
      state?.ipAddress
        ? {
            ...toApiParams(state),
            sortby: "createdOn",
            orderby: SortOrder.Descending
          }
        : undefined
    )

  let items = data?.items
  let columns = useColumns({ items, mutate })

  return (
    <FieldStack>
      <ActionBar
        ipType={state.ipType}
        ipAddress={state.ipAddress}
        search={(data = {}) => {
          setState({
            pageIndex: 0,
            ...data
          })
          mutate()
        }}
        isLoading={isLoading}
      />
      {state?.ipAddress && (
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

const ActionBar = ({ ipType, ipAddress, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      ipType,
      ipAddress
    }
  })

  return (
    <Level>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(search)}>
          <Set>
            <IpAddressTypeSelect required />
            <InputField
              name="ipAddress"
              required
              placeholder="IP"
              showEmptyFieldValueAddonAfter
            />
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </form>
      </FormProvider>
    </Level>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let readable = useIsDisplayMenuByRoute([View])
  return useMemo(
    () => [
      sequenceColumn(),
      textColumn({
        id: "username",
        accessor: (row) => row,
        Header: <Trans zh="玩家" en="Username" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return record.username
        }
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <TimeTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
