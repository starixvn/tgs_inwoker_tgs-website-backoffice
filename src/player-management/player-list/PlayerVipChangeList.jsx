import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import { pastWeek, today } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab, TabPanel } from "../../tab"
import textColumn from "../../table/column/textColumn"
import AlertDialog from "../../dialog/Alert"
import { usePlayerVipChangeList } from "./client"
import { subDays } from "date-fns"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { TimeTrans } from "../../trans/Date"

export const Key = "vip-change-list"

export const PlayerVipChangeListTab = ({ ...props }) => {
  return (
    <Tab tabId={Key} {...props}>
      <Trans
        zh="VIP升降級記錄"
        en="VIP History Record"
        vi="Lịch sử thăng hạng VIP"
      />
    </Tab>
  )
}

export const PlayerVipChangeListPanel = ({ brandId, playerCode, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = pastWeek()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: dateRange.end
  })

  let { isLoading, data, error, mutate, deleteCache } = usePlayerVipChangeList(
    isActive ? playerCode : "",
    isActive
      ? toApiParams({
          ...state
          /*
          sortby: "createdOn",
          orderby: SortOrder.Descending
          */
        })
      : undefined
  )

  let columns = useColumns({ items: data?.items })
  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        <SearchBar
          from={state.from}
          to={state.to}
          search={({ ...data } = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Table
          columns={columns}
          data={data?.items}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
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

const SearchBar = ({ from, to, search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const onSubmit = (data) => search(data)

  let todayRange = today()
  let DataRetentionDays = 180
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput
            minDate={minDate}
            maxDate={maxDate}
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      dateTimeColumn({
        Header: <TimeTrans />,
        accessor: "createdOn",
        disableSortBy: true
      }),
      textColumn({
        accessor: "oldLevel",
        Header: (
          <Trans zh="结算前等級" en="Before" vi="Cấp VIP trước kết toán" />
        ),
        disableSortBy: true
      }),
      textColumn({
        accessor: "newLevel",
        Header: <Trans zh="结算后等級" en="After" vi="Cấp VIP sau kết toán" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
