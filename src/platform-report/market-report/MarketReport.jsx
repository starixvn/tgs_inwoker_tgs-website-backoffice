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
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client/index"
import { isDev } from "../../env"
import { usePlatformMarketReportAdditionalExpenseList } from "./client"
import { AdditionalExpenseDialogDisclosure } from "../AdditionalExpense"
import { parseISO } from "date-fns"

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

  let columns = useColumns({ items: data?.items, brandId })
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
                <DownloadButton
                  id="export-report"
                  isLoading={isLoading}
                  href={urlWith(toSearchParams(), exportUrl)}
                />
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
        total={data?.items?.length > 0 && data?.total}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        foot={data?.items?.length > 0}
        stickyHead
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
            showDateDropdownMenu
            minDate={minDate}
            maxRangeDays={maxRangeDays}
            fakeTimeLabel
            required
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, items = [] }) => {
  let additionalExpenseTooltip = useTrans({
    zh: "此栏位仅供参考，不会计入净盈利中。",
    en: "This is for reference only and will NOT be included in the Net Profit calculation."
  })
  return useMemo(
    () => [
      dateTimeColumn({
        Header: <Trans zh="日期" en="Date" />,
        accessor: "reportDate",
        TotalCell: () => <Trans zh="总计" en="Total" />,
        dateFormat: "dd/MM/yyyy",
        timeFormat: false,
        disableSortBy: true,
        Footer: () => <Trans zh="页总计" en="Page Total" />,
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
        accessor: "depositCount",
        sumColumn: "depositCount",
        Header: <Trans zh="存款人数" en="Deposit Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "activePlayer",
        sumColumn: "activePlayer",
        Header: <Trans zh="活跃玩家" en="Active Player" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "loginPlayer",
        sumColumn: "loginPlayer",
        Header: <Trans zh="登入玩家" en="Login Player" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "firstFundInCount",
        sumColumn: "firstFundInCount",
        Header: <Trans zh="首存人数" en="First Fund In Count" />,
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
        accessor: "companyAdjustAmount",
        sumColumn: "companyAdjustAmount",
        Header: <Trans zh="公司调账" en="Co. Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAdjustAmount",
        sumColumn: "bonusAdjustAmount",
        Header: <Trans zh="优惠调帐" en="Bonus Adjustment Amount" />,
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
        Header: <Trans zh="有效投注" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        sumColumn: "turnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLossAmount",
        sumColumn: "winLossAmount",
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "additionalExpenses",
        accessor: (row) => row,
        sumColumn: "additionalExpenses",
        Header: (
          <Trans
            zh="额外支出"
            en="Additional Expenses"
            title={additionalExpenseTooltip}
          />
        ),
        disableSortBy: true,
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        Cell: ({ value: record }) => {
          let value = record?.additionalExpenses
          let reportDateString = record?.reportDate
          let reportDate = parseISO(reportDateString)
          return (
            <AdditionalExpenseDialogDisclosure
              value={value}
              useFetch={usePlatformMarketReportAdditionalExpenseList}
              searchParams={{
                brandId,
                reportDate
              }}
            />
          )
        }
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <Trans zh="净盈利" en="NetProfit" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items), brandId]
  )
}

export default MarketReport
