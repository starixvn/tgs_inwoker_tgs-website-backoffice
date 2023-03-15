import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Stack, Box, Button, Set, Level, Alert, List } from "bumbag"
import PageContent from "../../page/Content"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useLangCode,
  useTrans
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
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
import Big from "big.js"

export const MarketReport = ({ brandId, useFetch, exportUrl }) => {
  let dateRange = yesterday()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: dateRange.end,
    pageSize: 31
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageSize, from, to } = state
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

  let columns = useColumns({ items: data?.items, brandId })
  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            from={state.from}
            to={state.to}
            isLoading={isLoading}
            search={(data) => {
              setState({
                pageIndex: 0,
                ...data
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
      <Stack>
        <Alert variant="bordered" type="info" accent marginBottom="1rem">
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <Trans
                zh="存款金额: 为已扣除手续费之金额。"
                en="Deposit Amount: The amount after deducting the transfer fee."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="平台承担红利 = 红利金额 * (100% - 总代分红比例)。"
                en="Platform-Covered Bonus = Bonus Amount * (100% - Chief Agent Profit Sharing Percentage)."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="平台承担优惠调帐 = 优惠调帐 * (100% - 总代分红比例)。"
                en="Platform-Covered Bonus Adjust = Bonus Adjust * (100% - Chief Agent Profit Sharing Percentage)."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="净盈利 = 公司输赢金额 - 平台承担红利 - 平台承担优惠调帐 - 公司调帐。"
                en="Net Profit = CO. W/L - Platform-Covered Bonus - Platform-Covered Bonus Adjust - C.O Adjustment Amount."
              />
            </List.Item>
          </List>
        </Alert>
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
          stickyHead
          toggleColumnHidden={true}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ from, to, search, isLoading, ...props }) => {
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
        footerCellProps: {
          textAlign: "center"
        }
      }),
      numberColumn({
        accessor: "registeredCount",
        Header: <Trans zh="注册人数" en="Registered Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "depositCount",
        Header: <Trans zh="存款人数" en="Deposit Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "activePlayer",
        Header: <Trans zh="活跃玩家" en="Active Player" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "loginPlayer",
        Header: <Trans zh="登入玩家" en="Login Player" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "firstFundInCount",
        Header: <Trans zh="首存人数" en="First Fund In Count" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "depositAmount",
        accessor: (row) => row,
        Header: <Trans zh="存款金额" en="Deposit Amount" />,
        disableSortBy: true,
        toValue: ({ depositAmount, depositHandlingFee = 0 } = {}) => {
          let value = Number.isFinite(depositAmount)
            ? new Big(depositAmount).minus(depositHandlingFee).toNumber()
            : depositAmount
          return value
        },
        /*
        toTotal: ({ depositAmount, depositHandlingFee = 0 } = {}) => {
          let value = Number.isFinite(depositAmount)
            ? new Big(depositAmount).minus(depositHandlingFee).toNumber()
            : depositAmount
          return value
        },
        */
        TotalCell: ({ value }) => <FormattedNumberDecimal value={value} />
      }),
      numberDecimalColumn({
        accessor: "withdrawalAmount",
        Header: <Trans zh="提款金额" en="Withdrawal Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyAdjustAmount",
        Header: <Trans zh="公司调账" en="Co. Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAdjustAmount",
        Header: <Trans zh="优惠调帐" en="Bonus Adjust" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "platformCoveredBonusAdjust",
        Header: (
          <Trans zh="平台承担优惠调帐" en="Platform-Covered Bonus Adjust" />
        ),
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAmount",
        Header: <Trans zh="红利金额" en="Bonus Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "platformCoveredBonus",
        Header: <Trans zh="平台承担红利" en="Platform-Covered Bonus" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLossAmount",
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "additionalExpenses",
        accessor: (row) => row,
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
        Header: <Trans zh="净盈利" en="NetProfit" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items), brandId]
  )
}

export default MarketReport
