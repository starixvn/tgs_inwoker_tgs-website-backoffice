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
import { useBalanceAdjustList, exportBalanceAdjustListPath } from "./client"
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
import { AgentAdjustTrans } from "../../trans/Action"
import { CurrencyTrans } from "../../trans/Payment"
import {
  CompanyTrans,
  LicenseeTrans,
  PlatformTrans
} from "../../trans/Platform"
import { AgentTrans } from "../../trans/Agent"

let isNilOrEmpty = either(isNil, isEmpty)

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export const BalanceAdjustReport = ({ resellerId }) => {
  let dateRange = today()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    resellerId,
    from: dateRange.start,
    to: dateRange.end
  })

  let { isLoading, data, error, mutate, deleteCache } = useBalanceAdjustList(
    toApiParams(state)
  )

  useEffect(() => {
    if (resellerId != state.resellerId) {
      setState({ resellerId, pageIndex: 0 })
    }
  }, [resellerId])

  let columns = useColumns({
    items: data,
    resellerId,
    from: state?.from,
    to: state?.to
  })

  let pageWidth = useResellerPageContentWidth()
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          from={state?.from}
          to={state?.to}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
        />
        {data?.length > 0 && (
          <Box>
            <DownloadButton
              id="export-report"
              href={exportBalanceAdjustListPath(resellerId, {
                from: state.from,
                to: state.to
              })}
            />
          </Box>
        )}
      </Level>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                id="balance-adjust"
                columns={columns}
                data={data}
                initialState={state}
                controlledState={state}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                hasCellDividers
                stickyHead
                getRowId={(row) => row.brandId}
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

const useColumns = ({ items = [], resellerId, from, to }) => {
  return useMemo(
    () => [
      {
        id: "info",
        Header: "",
        columns: [
          textColumn({
            accessor: "licensee",
            Header: <LicenseeTrans />,
            disableSortBy: true
          }),
          textColumn({
            accessor: "brand",
            Header: <PlatformTrans />,
            disableSortBy: true
          }),
          textColumn({
            accessor: "currency",
            Header: <CurrencyTrans />,
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
            Header: <CompanyTrans />,
            disableSortBy: true
          }),
          numberColumn({
            accessor: "agent",
            Header: <AgentTrans />,
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
            Header: <AgentAdjustTrans />,
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
              return (
                <AdjustListDialogDisclosure
                  dialogId={`${record?.brand}-player-adjust-dialog`}
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
            Header: <AgentAdjustTrans />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              return (
                <AdjustListDialogDisclosure
                  dialogId={`${record?.brand}-agent-adjust-dialog`}
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
