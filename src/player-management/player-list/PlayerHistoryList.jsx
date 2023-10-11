import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, useModalState, Set } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { usePlayerHistoryList, usePlayerHistory } from "./client"
import { Trans, useTrans } from "../../i18n"
import { pastWeek } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab as _Tab, TabPanel } from "../../tab"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { isDev } from "../../env"
import { DetailDisclosure } from "../../dialog/Disclosure"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Modal from "../../dialog/Modal"

export const Key = "history"

export const PlayerHistoryListTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="操作记录" en="Operating records" />
    </_Tab>
  )
}

export const PlayerHistoryListPanel = ({ playerCode, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = pastWeek()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    from: dateRange.start,
    to: dateRange.end
  })

  let { pageSize, from, to } = state
  let { isLoading, data, error, mutate, deleteCache } = usePlayerHistoryList(
    isActive ? playerCode : undefined,
    toApiParams({ ...state, sortby: "createdOn", orderby: Descending })
  )

  let columns = useColumns({ items: data?.items })
  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        <SearchBar
          start={from}
          end={to}
          search={({ start, end, ...data } = {}) => {
            setState({
              pageIndex: 0,
              from: start,
              to: end,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Table
          columns={columns}
          data={data?.items}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          initialState={state}
          controlledState={state}
          isLoading={isLoading}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </TabPanel>
  )
}

const SearchBar = ({ start, end, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const Create = "Create"
const CreateTrans = {
  zh: "新增",
  en: "Create"
}

const Update = "Update"
const UpdateTrans = {
  zh: "更新",
  en: "Update"
}
const ActionTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Create:
      return <Trans {...CreateTrans} />
    case Update:
      return <Trans {...UpdateTrans} />
    default:
      return value
  }
}

const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      dateTimeColumn({
        Header: <Trans zh="操作时间" en="Operation Time" />,
        accessor: "createdOn",
        disableSortBy: true
      }),
      textColumn({
        accessor: "action",
        Header: <Trans zh="操作项" en="Operation Item" />,
        disableSortBy: true,
        Cell: ActionTypeLabel
      }),
      textColumn({
        accessor: "createdByUsername",
        Header: <Trans zh="操作者" en="Operator" />,
        disableSortBy: true
      }),
      textColumn({
        id: "detail",
        accessor: (row) => row,
        Header: <Trans zh="详情" en="Detail" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <PlayerHistoryDialogDisclosure eventId={record?.eventId} />
            </Set>
          )
        }
      })
    ],
    [JSON.stringify(items)]
  )

const PlayerHistoryDialogDisclosure = ({ eventId }) => {
  let dialog = useModalState()

  return (
    <>
      <DetailDisclosure {...dialog} />
      {dialog.visible && (
        <PlayerHistoryDialog eventId={eventId} dialog={dialog} />
      )}
    </>
  )
}

//TODO: "add", value: json?
//TODO: detail table
const PlayerHistoryDialog = ({ eventId, dialog, ...props }) => {
  let { isLoading, data: detail, error } = usePlayerHistory(eventId)

  let columns = usePlayerHistoryColumns({})
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...dialog} onClickClose={dialog.hide} />
  }

  return (
    <Modal title=" " {...dialog}>
      {JSON.stringify(detail)}
    </Modal>
  )
}

//TODO
const Replace = "replace"
const Add = "add"
const OperationLabel = ({ value = "" }) => {
  switch (value) {
    case Replace:
      return <Trans {...Update} />
    case Add:
      return <Trans {...CreateTrans} />
    default:
      return value
  }
}
const usePlayerHistoryColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "op",
        Header: <Trans zh="操作" en="Operation" />,
        disableSortBy: true,
        Cell: OperationLabel
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
