import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, useModalState, Level } from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import AlertDialog from "../../dialog/Alert"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import { useGameProviderReportList } from "./client"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { GameTypeSelect } from "../../game/GameType"
import { GameProviderSelect } from "../../game/providers/GameProviderSelect"
import { today, lastMonth } from "../../date/range"
import { subDays } from "date-fns"
import { startOfNextDay } from "../../date/startOfNextDay"
import AutoSizer from "react-virtualized-auto-sizer"
import textColumn from "../../table/column/textColumn"
import {
  numberColumn,
  numberDecimalColumn
} from "../../table/column/numberColumn"
import {
  BetAmountTrans,
  GameProviderTrans,
  GameProviderUpdatedReportTrans,
  GamingCountTrans,
  TransactionCountTrans,
  TurnoverTrans,
  ValidBetAmountTrans
} from "../../trans/Game"
import { CurrencyTrans } from "../../trans/Payment"
import {
  CompanyWinLossTrans,
  PlatformSettlementTimeTrans
} from "../../trans/Platform"
import { TotalTrans } from "../../trans/Field"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<GameProviderUpdatedReportTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = ({}) => {
  let brandId = usePlatformId()

  let dateRange = lastMonth()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: dateRange.end,
    gameProviderCode: "",
    gameType: "",
    sortBy: [{ id: "validBetAmount", desc: true }]
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let culture = useLangCode()

  let toSearchParams = () => ({
    ...toApiParams(state),
    to: startOfNextDay(state.to),
    culture
  })

  let { isLoading, data, error, mutate, emptyData } = useGameProviderReportList(
    toSearchParams()
  )

  let columns = useColumns({
    items: data?.items
  })

  let pageWidth = usePlatformPageContentWidth()
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          from={state.from}
          to={state.to}
          gameProviderCode={state.gameProviderCode}
          gameType={state.gameType}
          isLoading={isLoading}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate(undefined, true)
          }}
        />
      </Level>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={data?.items}
                total={data?.items?.length > 0 && data?.total}
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
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const SearchBar = ({
  from,
  to,
  gameProviderCode,
  gameType,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      from,
      to,
      gameProviderCode,
      gameType
    }
  })

  const onSubmit = (data) => search?.(data)

  let todayRange = today()

  let DataRetentionDays = 180
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  let QueryMaxRangeDays = 31

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <DateInputRangeField
            label={<PlatformSettlementTimeTrans />}
            id="date-range"
            showDateDropdownMenu
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={QueryMaxRangeDays}
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
        accessor: "gameProviderName",
        Header: <GameProviderTrans />,
        disableSortBy: true,
        TotalCell: () => <TotalTrans />
      }),
      textColumn({
        accessor: "currencyCode",
        Header: <CurrencyTrans />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "transactionCount",
        Header: <TransactionCountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <BetAmountTrans />
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <TurnoverTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <ValidBetAmountTrans />
      }),
      numberColumn({
        accessor: "playerCount",
        Header: <GamingCountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyWinLoss",
        Header: <CompanyWinLossTrans />
      })
    ],
    [JSON.stringify(items)]
  )
}
