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
import { Trans, useTrans } from "../../i18n"
import { usePlayerIPAddressListByUsername } from "./client"
import { useForm, useFormContext, FormProvider } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import SearchButton from "../../button/SearchButton"
import { InputField } from "../../input/Input"
import IpAddressType, { setLoginIpType } from "./IpAddressType"
import { TimeTrans } from "../../trans/Date"

export const PlayerIPAddressByUsernameTabId = "PlayerIPAddressByUsername"

export const PlayerIPAddressByUsernameTab = ({ ...props }) => {
  return (
    <Tab tabId={PlayerIPAddressByUsernameTabId} {...props}>
      <Trans zh="按玩家帳號搜索IP" en="Search IP By Account ID" />
    </Tab>
  )
}

export const PlayerIPAddressByUsernameTabPanel = ({
  brandId,
  table,
  onClickIpAddress,
  ...props
}) => {
  let { selectedId } = props
  let isActive = selectedId === PlayerIPAddressByUsernameTabId
  return (
    <TabPanel tabId={PlayerIPAddressByUsernameTabId} {...props}>
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
    usePlayerIPAddressListByUsername(
      state?.userName
        ? {
            ...toApiParams(state),
            sortby: "createdOn",
            orderby: SortOrder.Descending
          }
        : undefined
    )

  let items = data?.items
  let columns = useColumns({
    items,
    mutate,
    onClickIpAddress,
    ipType: state.ipType
  })

  return (
    <FieldStack>
      <ActionBar
        userName={state.userName}
        search={(data = {}) => {
          let state = setLoginIpType({
            pageIndex: 0,
            ...data
          })
          setState(state)
          mutate()
        }}
        isLoading={isLoading}
      />
      {state?.userName && (
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

const ActionBar = ({ userName, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      userName
    }
  })

  let usernamePlaceholder = useTrans({
    zh: "用户名",
    en: "Username"
  })

  return (
    <Level>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(search)}>
          <Set>
            <InputField
              name="userName"
              required
              placeholder={usernamePlaceholder}
              showEmptyFieldValueAddonAfter
            />
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </form>
      </FormProvider>
    </Level>
  )
}

const useColumns = ({ items = [], mutate, onClickIpAddress }) => {
  let readable = useIsDisplayMenuByRoute([View])
  return useMemo(
    () => [
      sequenceColumn(),
      textColumn({
        accessor: "ipAddress",
        Header: <Trans zh="登錄IP地址" en="Login IP" />,
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
      dateTimeColumn({
        accessor: "createdOn",
        Header: <TimeTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
