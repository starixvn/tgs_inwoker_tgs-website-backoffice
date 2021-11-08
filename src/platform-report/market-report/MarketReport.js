import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, useModalState, Level } from "bumbag"
import PageContent from "../../page/Content"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { yesterday } from "../../date/range"
import dateTimeColumn from "../../table/column/dateTime"
import subDays from "date-fns/subDays"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import startOfToday from "date-fns/startOfToday"
import AlertDialog from "../../dialog/Alert"
import { urlWith } from "../../client/index"
import { isDev } from "../../env"

export const MarketReport = ({ brandId, useFetch, exportUrl }) => {
  let dateRange = yesterday()
  let QueryMaxRangeDays = 31
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    pageSize: QueryMaxRangeDays,
    brandId,
    from: dateRange.start,
    to: dateRange.end
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageIndex, pageSize, from, to } = state

  let culture = useLangCode()

  let toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "reportDate",
    from,
    to: startOfNextDay(to),
    culture
  })

  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useFetch(toSearchParams())

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  let columns = useColumns({ items: data?.items })
  let maxDate = startOfToday()

  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            start={from}
            end={to}
            minDate={minDate}
            maxDate={maxDate}
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
          {data?.items?.length > 0 && (
            <Box>
              {exportUrl && (
                <Button
                  id="export-report"
                  disabled={isLoading}
                  use="a"
                  href={urlWith(toSearchParams(), exportUrl)}
                  download
                >
                  <Trans zh="汇出" en="Export" />
                </Button>
              )}
            </Box>
          )}
        </Level>
      }
      title={<Trans zh="市场报表" en="Market Report" />}
      paddingTop="1em"
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        foot={data?.items?.length > 0}
        isSticky={isDev() ? true : false}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  start,
  end,
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
      end
    }
  })

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateInputRange
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            required
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      dateTimeColumn({
        Header: <Trans zh="日期" en="Date" />,
        accessor: "reportDate",
        dateFormat: "dd/MM/yyyy",
        timeFormat: false,
        disableSortBy: true,
        Footer: () => <Trans zh="共计" en="Total" />,
        footerCellProps: {
          textAlign: "center"
        }
      }),
      numberColumn({
        accessor: "registeredCount",
        sumColumn: "registeredCount",
        Header: <Trans zh="注册人数" en="Registered Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "firstFundInCount",
        sumColumn: "firstFundInCount",
        Header: <Trans zh="首充人数" en="First Fund In Count" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "depositAmount",
        sumColumn: "depositAmount",
        Header: <Trans zh="存款金额" en="Deposit Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "withdrawalAmount",
        sumColumn: "withdrawalAmount",
        Header: <Trans zh="提款金额" en="Withdrawal Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "adjustmentAmount",
        sumColumn: "adjustmentAmount",
        Header: <Trans zh="调账" en="Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAmount",
        sumColumn: "bonusAmount",
        Header: <Trans zh="红利金额" en="Bonus Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        sumColumn: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        sumColumn: "validBetAmount",
        Header: <Trans zh="有效投注" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLossAmount",
        sumColumn: "winLossAmount",
        Header: <Trans zh="输赢金额" en="Win Loss Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <Trans zh="净盈利" en="NetProfit" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}

export default MarketReport
