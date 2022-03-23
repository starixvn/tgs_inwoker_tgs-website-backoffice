import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Level } from "bumbag"
import PageContent from "../../page/Content"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserLicenseeId,
  useUserResellerId
} from "../../user/context"
import { yesterday } from "../../date/range"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import { useResellerMarketReportList, API } from "./client"
import { Reseller } from "../../merchant/resellers"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { subDays, startOfToday } from "date-fns"
import { isDev } from "../../env"
import textColumn, { wrapTextColumn } from "../../table/column/textColumn"
import { ResellerCurrencySelect } from "../ResellerCurrencySelect"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client/index"

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
  let userResellerId = useUserResellerId()
  let [resellerId, setResellerId] = useState(userResellerId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar end={Reseller} onResellerChange={setResellerId} />
      {resellerId && <ReportContent resellerId={resellerId} />}
    </Set>
  )
}

const ReportContent = ({ resellerId }) => {
  let dateRange = yesterday()
  let QueryMaxRangeDays = 31
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    resellerId,
    currencyCode: undefined,
    from: dateRange.start,
    to: dateRange.end
  })

  useEffect(() => {
    setState({ pageIndex: 0, resellerId })
  }, [resellerId])

  let culture = useLangCode()

  let { pageIndex, pageSize, from, to } = state

  let toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "currencyCode",
    from,
    to: startOfNextDay(to),
    culture
  })

  let { isLoading, data, error, mutate, deleteCache } =
    useResellerMarketReportList(toSearchParams())

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  let columns = useColumns({ items: data?.items })
  let maxDate = startOfToday()

  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            resellerId={resellerId}
            currencyCode={state?.currencyCode}
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
          {/* 
          {data?.items?.length > 0 && (
            <Box>
              <DownloadButton
                id="export-report"
                isLoading={isLoading}
                href={urlWith(toSearchParams(), `${API}/exportResellerMarkets`)}
              />
            </Box>
          )} 
          */}
        </Level>
      }
      title={<Trans zh="市场报表 - 总公司" en="Market Report - Reseller" />}
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
        getRowProps={({ original: { isTotal } } = {}) => {
          if (isTotal) {
            return {
              backgroundColor: "white600",
              fontWeight: "bold"
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
  resellerId,
  currencyCode,
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
      currencyCode,
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
          <ResellerCurrencySelect name="currencyCode" resellerId={resellerId} />
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
        id: "brandCode",
        accessor: (row) => row,
        Header: <Trans zh="平台" en="Platfrom" />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, brandCode = "" } }) => {
          return isTotal ? "" : brandCode
          // return isTotal ? <Trans zh="共计" en="Total" /> : brandCode
        }
      }),
      wrapTextColumn({
        id: "currencyCode",
        accessor: (row) => row,
        Header: <Trans zh="币种" en="Currency" />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, currencyCode = "" } }) => {
          // return isTotal ? "" : currencyCode
          return isTotal ? <Trans zh="共计" en="Total" /> : currencyCode
        }
      }),
      numberDecimalColumn({
        accessor: "depositAmount",
        Header: <Trans zh="存款金额" en="Deposit Amount" />,
        disableSortBy: true
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
        accessor: "bonusAmount",
        Header: <Trans zh="红利金额" en="Bonus Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
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
        accessor: "netProfit",
        Header: <Trans zh="净盈利" en="Net Profit" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
