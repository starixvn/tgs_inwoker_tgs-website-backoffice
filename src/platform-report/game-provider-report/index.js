import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Level, Text, Link } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import {
  DateInputRange,
  DateInputRangeField
} from "../../date/DateTimeRangeInput"
import { lastMonth } from "../../date/range"
import { useGameProviderReportList } from "./client"
import { subDays } from "date-fns"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { urlWith } from "../../client"
import { isDev } from "../../env"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { GameTypeSelect } from "../../game/GameType"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import DownloadButton from "../../button/DownloadButton"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

export const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <ReportContent brandId={brandId} />}
    </Set>
  )
}

const ReportContent = ({ brandId }) => {
  let dateRange = lastMonth()
  let QueryMaxRangeDays = 31
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    pageSize: QueryMaxRangeDays,
    brandId,
    from: dateRange.start,
    to: dateRange.end,
    gameProviderCode: "",
    gameType: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { from, to } = state

  let culture = useLangCode()
  let toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "gameProviderName",
    from,
    to: startOfNextDay(to),
    culture
  })

  let { isLoading, data, error, mutate, deleteCache } =
    useGameProviderReportList(toSearchParams())

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  let columns = useColumns({
    items: data?.items
  })

  return (
    <PageContent
      actionBar={
        <SearchBar
          start={from}
          end={to}
          gameProviderCode={state.gameProviderCode}
          gameType={state.gameType}
          minDate={minDate}
          maxDate={dateRange.end}
          maxRangeDays={QueryMaxRangeDays}
          isLoading={isLoading}
          search={({ start, end, ...rest }) => {
            setState({
              pageIndex: 0,
              from: start,
              to: end,
              ...rest
            })
            mutate()
          }}
        />
      }
      title={<Trans zh="游戏商報表" en="Game Provider Report" />}
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        // getTableHeadProps={() => {
        //   return {
        //     zIndex: state.pageSize
        //   }
        // }}
        getRowId={(row, index) => row.gameProviderId ?? index}
        getRowProps={({ original: { isTotal }, index } = {}) => {
          if (isTotal) {
            return {
              "data-row-type": "total",
              backgroundColor: "white600",
              fontWeight: "bold"
              /*
              position: "sticky",
              bottom: "0",
              zIndex: state.pageSize - index
              */
            }
          }
          return {}
        }}
        stickyHead
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  brandId,
  start,
  end,
  gameProviderCode,
  gameType,
  minDate,
  maxDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end,
      gameProviderCode,
      gameType
    }
  })
  let { control, getValues, setValue, clearErrors } = formMethods

  const onSubmit = (data) => search?.(data)

  const StartField = "start"
  const EndField = "end"

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <DateInputRangeField
            label={<Trans zh="平台结算时间" en="Platform Settlement Time" />}
            id="date-range"
            showDateDropdownMenu
            minDate={minDate}
            maxRangeDays={maxRangeDays}
            fakeTimeLabel
            startProps={{
              name: StartField
            }}
            endProps={{
              name: EndField
            }}
            required
          />
          <GameProviderSelect name="gameProviderCode" valueField="code" />
          <GameTypeSelect name="gameType" />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      textColumn({
        id: "gameProviderName",
        accessor: (row) => row,
        Header: <Trans zh="游戏商" en="Game Provider" />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, gameProviderName } }) => {
          return isTotal ? <Trans zh="共计" en="Total" /> : gameProviderName
        }
      }),
      textColumn({
        id: "currencyCode",
        accessor: (row) => row,
        Header: <Trans zh="币种" en="Currency" />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, currencyCode = "" } }) => {
          return currencyCode
          // return isTotal ? <Trans zh="共计" en="Total" /> : currencyCode
        }
      }),
      numberColumn({
        accessor: "transactionCount",
        Header: <Trans zh="訂單筆數" en="Transactions" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "originalTurnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid Bet" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyWinLoss",
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
