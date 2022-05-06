import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import { pastWeek } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab, TabPanel } from "../../tab"
import textColumn from "../../table/column/textColumn"
import { Descending, SortOrder } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { usePlayerPromotions } from "./client"
import { useForm, FormProvider, useFormContext } from "react-hook-form"

export const Key = "promotion"

export const PlayerPromotionTab = ({ ...props }) => {
  return (
    <Tab tabId={Key} {...props}>
      <Trans zh="活动记录" en="Promotions" />
    </Tab>
  )
}

export const PlayerPromotionPanel = ({ playerCode, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = pastWeek()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    from: dateRange.start,
    to: dateRange.end
  })

  let { isLoading, data, error, mutate, deleteCache } = usePlayerPromotions(
    playerCode,
    isActive
      ? toApiParams({
          ...state,
          sortby: "createdOn",
          orderby: SortOrder.Descending
        })
      : undefined
  )

  let columns = useColumns({ items: data?.items })
  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        <SearchBar
          start={state.from}
          end={state.to}
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

const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      textColumn({
        accessor: "promotionName",
        Header: <Trans zh="活动名称" en="Promotion" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        Header: <Trans zh="参加时间" en="Participation Time" />,
        accessor: "createdOn",
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
