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
  Flex,
  Level
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import textColumn, { ellipsisTextColumn } from "../../table/column/textColumn"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { today } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import { useApiLogList } from "./client"
import { LogDetailDialogDisclosure } from "../LogDetailDialog"
import { CopyTextBox } from "../../text/CopyTextBox"
import { SortOrder } from "../../table/order"
import { useHistory, useParams } from "react-router-dom"
import { parseJSON } from "../../text/json"
import { parseISO } from "date-fns"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const StateQueryName = "state"
const Body = ({ }) => {
  let todayRange = today()

  let {
    location: { search },
    ...history
  } = useHistory()
  let stateString = new URLSearchParams(search).get(StateQueryName)
  let initState = parseJSON(stateString) ?? {}
  if (typeof initState.from === "string") {
    initState.from = parseISO(initState.from)
  }
  if (typeof initState.to === "string") {
    initState.to = parseISO(initState.to)
  }

  let { state, setState, setPageIndex, setSortOrder } = useTable(initState)

  const syncSearchParams = record => {
    let search = `${StateQueryName}=${JSON.stringify(record)}`
    history.replace({
      search
    })
  }

  let { pageIndex, pageSize } = state
  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = useApiLogList({
    ...toApiParams(state),
    sortby: "RecordedOn",
    orderby: SortOrder.Descending
  })

  let columns = useColumns({ mutate, items: data?.items })

  return (
    <PageContent
      title={<Trans zh="API Logs" en="API Logs" />}
      actionBar={
        <SearchBar
          start={state?.from}
          end={state?.to}
          responseCode={state?.responseCode}
          trackingId={state?.trackingId}
          ip={state?.ip}
          path={state?.path}
          prefix={state?.prefix}
          serverName={state?.serverName}
          method={state?.method}
          search={({ start, end, ...data } = {}) => {
            let record = {
              pageIndex: 0,
              from: start,
              to: end,
              ...data
            }
            setState(record)
            mutate()

            syncSearchParams(record)
          }}
          isLoading={isLoading}
        />
      }
    >
      <Table
        controlledState={state}
        columns={columns}
        data={data?.items}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={(pageIndex) => {
          setPageIndex(pageIndex)

          syncSearchParams({ ...state, pageIndex })
        }}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.id}
      />
      {error && (
        <AlertDialog
          {...error}
          onClickClose={() => {
            deleteCache()
            mutate({ data: undefined }, false)
          }}
        />
      )}
    </PageContent>
  )
}

const SearchBar = ({
  start,
  end,
  responseCode,
  trackingId,
  ip,
  path,
  prefix,
  method,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end,
      responseCode,
      trackingId,
      ip,
      path,
      prefix,
      method
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput />
          <InputField
            name="responseCode"
            showEmptyFieldValueAddonAfter
            placeholder="Response Code"
          />
          <InputField
            name="trackingId"
            showEmptyFieldValueAddonAfter
            placeholder="Tracking Id"
          />
          <InputField
            name="ip"
            showEmptyFieldValueAddonAfter
            placeholder="IP"
          />
          <InputField
            name="path"
            showEmptyFieldValueAddonAfter
            placeholder="Path"
          />
          <InputField
            name="prefix"
            showEmptyFieldValueAddonAfter
            placeholder="Prefix"
          />
          <InputField
            name="serverName"
            showEmptyFieldValueAddonAfter
            placeholder="Server Name"
          />
          <InputField
            name="method"
            showEmptyFieldValueAddonAfter
            placeholder="Method"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] } = {}) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "id",
        Header: <Trans zh="Id" en="Id" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "trackingId",
        Header: <Trans zh="Tracking Id" en="Tracking Id" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "ip",
        Header: <Trans zh="Ip" en="Ip" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      ellipsisTextColumn({
        accessor: "path",
        Header: <Trans zh="Path" en="Path" />,
        disableSortBy: true,
        textAlign: "left",
        maxWidth: "20rem",
        Cell: ({ value = "" }) => (
          <CopyTextBox value={value} whiteSpace="normal" textAlign="left" />
        )
      }),
      textColumn({
        accessor: "method",
        Header: <Trans zh="Method" en="Method" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "prefix",
        Header: <Trans zh="Prefix" en="Prefix" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "serverName",
        Header: <Trans zh="Server Name" en="Server Name" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "responseCode",
        Header: <Trans zh="Response Code" en="Response Code" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "executionTimeMs",
        Header: <Trans zh="Execution Time Ms" en="Execution Time Ms" />,
        disableSortBy: true,
        Cell: ({ value }) => <FormattedNumber value={value} />
      }),
      dateTimeColumn({
        accessor: "recordedOn",
        Header: <Trans zh="Recorded On" en="Recorded On" />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <Trans zh="Actions" en="Actions" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Set alignX="center">
              <LogDetailDialogDisclosure record={value} />
            </Set>
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
