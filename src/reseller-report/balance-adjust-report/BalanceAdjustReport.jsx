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
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { useBalanceAdjustReportList } from "./client"
import { isDev } from "../../env"
import { urlWith } from "../../client"
import DownloadButton from "../../button/DownloadButton"
import headOf from "../../list/head"
import { isLastIndex, last } from "../../list/last"
import {
  faAngleDown,
  faAngleRight,
  faCaretRight,
  faCaretDown,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons"
import AutoSizer from "react-virtualized-auto-sizer"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { useTableColumnHiddenLocalStorage } from "../../table/ActionBar"
import { isNil, isEmpty, either } from "ramda"
import { isArray } from "lodash-es"
import { useMeasure } from "react-use"
import { useResellerPageContentWidth } from "../../page/ResellerPageContent"
import { AdjustListDialogDisclosure } from "./AdjustListDialog"
import { UserType } from "./UserType"

let isNilOrEmpty = either(isNil, isEmpty)

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export const BalanceAdjustReport = ({ resellerId, from, to }) => {
  //TODO:
  // 4. dialogs
  let dateRange = today()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    resellerId,
    from: dateRange.start,
    to: dateRange.end
  })

  //TODO: pagination?
  //TODO: from & to -> date string
  let { isLoading, data, error, mutate, deleteCache } =
    useBalanceAdjustReportList(toApiParams(state))

  useEffect(() => {
    if (resellerId != state.resellerId) {
      setState({ resellerId, pageIndex: 0 })
    }
  }, [resellerId])

  let columns = useColumns({
    items: data?.items,
    resellerId,
    from: state?.from,
    to: state?.to
  })

  //TODO: SearchBar search fn
  let pageWidth = useResellerPageContentWidth()
  return (
    <Set orientation="vertical" isFilled height="100%" spacing="major-2">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar from={state?.from} to={state?.to} />
      </Level>
      <Box flex="1">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={data}
                initialState={state}
                controlledState={state}
                // pageCount={pageCount(pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                hasCellDividers
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

const SearchBar = ({ from, to, search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const onSubmit = (data) => search?.(data)

  let QueryMaxRangeDays = 31
  let todayRange = today()
  let DataRetentionDays = 180
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateInputRange
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
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

//TODO: dialog disclosures
const useColumns = ({ items = [], resellerId, from, to }) => {
  return useMemo(
    () => [
      {
        id: "info",
        Header: "",
        columns: [
          textColumn({
            accessor: "licensee",
            Header: <Trans zh="公司" en="Licensee" />,
            disableSortBy: true
          }),
          textColumn({
            accessor: "brand",
            Header: <Trans zh="平台" en="Platform" />,
            disableSortBy: true
          }),
          textColumn({
            accessor: "currencyCode",
            Header: <Trans zh="币种" en="Currency" />,
            disableSortBy: true
          })
        ]
      },
      {
        id: "playerAdjustCount",
        Header: <Trans zh="玩家调帐次数" en="Player Adjust Count" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberColumn({
            accessor: "company",
            Header: <Trans zh="公司" en="Company" />,
            disableSortBy: true
          }),
          numberColumn({
            accessor: "agent",
            Header: <Trans zh="代理" en="Agent" />,
            disableSortBy: true
          }),
          numberColumn({
            accessor: "bonus",
            Header: <Trans zh="优惠" en="Bonus" />,
            disableSortBy: true
          }),
          numberColumn({
            accessor: "system",
            Header: <Trans zh="系統" en="System" />,
            disableSortBy: true
          }),
          numberColumn({
            accessor: "transfer",
            Header: <Trans zh="转帐" en="Transfer" />,
            disableSortBy: true
          })
        ]
      },
      {
        id: "agentAdjustCount",
        Header: <Trans zh="代理调帐次数" en="Agent Adjust Count" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberColumn({
            accessor: "agentOther",
            Header: <Trans zh="代理调帐" en="Agent Adjust" />,
            disableSortBy: true
          })
        ]
      },
      {
        id: "adjustAmount",
        Header: <Trans zh="金額" en="Amount" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            id: "playerAdjustAmount",
            accessor: (row) => row,
            Header: <Trans zh="玩家调帐" en="Player Adjust" />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              //TODO: params: brandId
              return (
                <AdjustListDialogDisclosure
                  brandId={record?.brandId}
                  userType={UserType.Player}
                  value={record?.playerAdjustAmount}
                  from={from}
                  to={to}
                />
              )
            }
          }),
          numberDecimalColumn({
            id: "agentAdjustAmount",
            accessor: (row) => row,
            Header: <Trans zh="代理调帐" en="Agent Adjust" />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              //TODO: params brandId
              return (
                <AdjustListDialogDisclosure
                  brandId={record?.brandId}
                  userType={UserType.Agent}
                  value={record?.agentAdjustAmount}
                  from={from}
                  to={to}
                />
              )
            }
          })
        ]
      }
    ],
    [JSON.stringify(items), resellerId, from, to]
  )
}
