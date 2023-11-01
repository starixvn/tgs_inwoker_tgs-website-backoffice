import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  Text,
  Link,
  FieldStack,
  Alert,
  List,
  Icon,
  Breadcrumb
} from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  Trans,
  useTrans,
  FormattedNumberDecimal,
  useLangCode
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import {
  DateInputRange,
  DateInputRangeField
} from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import AutoSizer from "react-virtualized-auto-sizer"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { useTableColumnHiddenLocalStorage } from "../../table/ActionBar"
import { isNil, isEmpty, either } from "ramda"
import { usePlatformPageContentWidth } from "../../page/PlatformPageContent"
import dateTimeColumn from "../../table/column/dateTime"
import { AllAgentRebateDialogDisclosure } from "./AllAgentRebateDialog"
import { parseISO } from "date-fns"
import { toDate } from "../../date/toDate"
import { useAllAgentRebateList, useAllAgentRebateTotalAmount } from "./client"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

const useAllAgentRebateData = (searchParams) => {
  let {
    isLoading: isLoadingRebateList,
    data: rebateList,
    error: rebateListError,
    mutate: mutateRebateList,
    deleteCache: deleteRebateListCache
  } = useAllAgentRebateList(searchParams)
  let {
    isLoading: isLoadingTotalAmount,
    data: rebateTotalAmount,
    error: rebateTotalAmountError,
    mutate: mutateRebateTotalAmount,
    deleteCache: deleteRebateTotalAmountCache
  } = useAllAgentRebateTotalAmount(searchParams)

  let isLoading = isLoadingRebateList || isLoadingTotalAmount
  let error = rebateListError || rebateTotalAmountError
  let data =
    rebateList && rebateTotalAmount
      ? {
          items: rebateList,
          total: rebateTotalAmount,
          totalCount: rebateTotalAmount.totalCount
        }
      : undefined
  return {
    isLoading,
    data,
    error,
    mutate: (_, shouldRevalidate) => {
      mutateRebateList(_, shouldRevalidate)
      mutateRebateTotalAmount(_, shouldRevalidate)
    },
    deleteCache: () => {
      deleteRebateListCache()
      deleteRebateTotalAmountCache()
    }
  }
}

export const AllAgentRebateReport = ({ brandId }) => {
  let dateRange = yesterday()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    username: "",
    from: dateRange.start,
    to: dateRange.end,
    sortBy: [{ id: "settleDateTime", desc: true }]
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  const toSearchParams = () => ({
    ...toApiParams(state),
    to: startOfNextDay(state.to)
  })
  let { isLoading, data, error, mutate, deleteCache } = useAllAgentRebateData(
    toSearchParams()
  )

  let columns = useColumns({
    items: data?.items,
    brandId
  })

  let pageWidth = usePlatformPageContentWidth()

  return (
    <Set orientation="vertical" isFilled height="100%" spacing="major-2">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          username={state?.username}
          from={state?.from}
          to={state?.to}
          isLoading={isLoading}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            deleteCache()
            mutate(null)
          }}
        />
      </Level>
      <Box>
        <Alert variant="bordered" type="info" accent>
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <Trans
                zh="最大活跃人数：各游戏类型活跃人数之最大值。"
                en="Max. Active Player: the highest number of active players recorded among different game types."
              />
            </List.Item>
          </List>
        </Alert>
      </Box>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={data?.items}
                total={data?.items?.length > 0 && data?.total}
                isTotalFooter={true}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(state.pageSize, data?.totalCount)}
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
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const SearchBar = ({ username, from, to, search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      from,
      to
    }
  })

  let usernamePlaceholder = useTrans({
    zh: "全民代理上級",
    en: "All Agent Username"
  })

  const onSubmit = (data) => search?.(data)

  let QueryMaxRangeDays = 14
  let todayRange = today()
  let DataRetentionDays = 90
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <DateInputRangeField
            label={<Trans zh="結算日期" en="Settlement Date" />}
            showDateDropdownMenu
            maxRangeDays={QueryMaxRangeDays}
            minDate={minDate}
            maxDate={maxDate}
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
            dateDropdownMenuProps={{
              thisWeekProps: {
                end: maxDate
              },
              thisMonthProps: {
                end: maxDate
              }
            }}
            fakeTimeLabel
            required
          />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernamePlaceholder}
            autoFocus
          />

          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], brandId }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "username",
        Header: <Trans zh="全民代理上級" en="All Agent Username" />,
        disableSortBy: true,
        TotalCell: () => <Trans zh="总计" en="Total" />
      }),
      dateTimeColumn({
        id: "settleDateTime",
        accessor: "settleDateTime",
        dateFormat: "dd/MM/yyyy",
        timeFormat: false,
        Header: <Trans zh="結算日期" en="Settlement Date" />
      }),
      numberColumn({
        id: "maxActivePlayerNumber",
        accessor: (row) => row,
        Header: <Trans zh="最大活跃人数" en="Max. Active Player" />,
        Cell: ({ value: record }) => {
          return (
            <AllAgentRebateDialogDisclosure
              brandId={brandId}
              value={record?.maxActivePlayerNumber}
              username={record?.username}
              playerCode={record?.playerCode}
              settleDateTime={toDate(record?.settleDateTime)}
            />
          )
        }
      }),
      numberDecimalColumn({
        accessor: "validBet",
        Header: <Trans zh="团队有效投注" en="Total Valid Bet" />
      }),
      numberDecimalColumn({
        accessor: "rebate",
        Header: <Trans zh="返水金额" en="Total Rebates" />
      }),
      dateTimeColumn({
        accessor: "sentOn",
        Header: <Trans zh="派发时间" en="Sent On" />,
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
