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
  useUserLicenseeId
} from "../../user/context"
import { yesterday } from "../../date/range"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import startOfToday from "date-fns/startOfToday"
import AlertDialog from "../../dialog/Alert"
import { useLicenseeMarketReportList } from "./client"
import { Licensee } from "../../merchant/licensees"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import sequence, { SequenceCell } from "../../table/column/sequence"
import subDays from "date-fns/subDays"
import { isDev } from "../../env"
import textColumn from "../../table/column/textColumn"
import { LicenseeCurrencySelect } from "../LicenseeCurrencySelect"

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
  let userLicenseeId = useUserLicenseeId()
  let [licenseeId, setLicenseeId] = useState(userLicenseeId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        end={Licensee}
        onLicenseeChange={(value) => {
          setLicenseeId(value)
        }}
      />
      {licenseeId && <ReportContent licenseeId={licenseeId} />}
    </Set>
  )
}

const ReportContent = ({ licenseeId }) => {
  let dateRange = yesterday()
  let QueryMaxRangeDays = 31
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    pageSize: QueryMaxRangeDays,
    licenseeId,
    currencyCodes: undefined,
    from: dateRange.start,
    to: dateRange.end
  })

  useEffect(() => {
    setState({ pageIndex: 0, licenseeId })
  }, [licenseeId])

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
    useLicenseeMarketReportList(toSearchParams())

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  let columns = useColumns({ items: data?.items })
  let maxDate = startOfToday()

  return (
    <PageContent
      actionBar={
        <Level alignY="bottom">
          <SearchBar
            licenseeId={licenseeId}
            currencyCodes={state?.currencyCodes}
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
        </Level>
      }
      title={<Trans zh="市场报表 - 公司" en="Market Report - Licensee" />}
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
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  licenseeId,
  currencyCodes,
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
      currencyCodes,
      start,
      end
    }
  })

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <LicenseeCurrencySelect
            name="currencyCodes"
            licenseeId={licenseeId}
          />
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
      textColumn({
        id: "currencyCode",
        accessor: (row) => row,
        Header: <Trans zh="币种" en="Currency" />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, currencyCode = "" } }) => {
          // return isTotal ? "" : currencyCode
          return isTotal ? <Trans zh="共计" en="Total" /> : currencyCode
        }
      }),
      /*
      numberColumn({
        accessor: "registeredCount",
        Header: <Trans zh="注册人数" en="Registered Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "firstFundInCount",
        Header: <Trans zh="首充人数" en="First Fund In Count" />,
        disableSortBy: true
      }),
      */
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
        accessor: "adjustmentAmount",
        Header: <Trans zh="调账" en="Adjustment Amount" />,
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
        Header: <Trans zh="有效投注" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLossAmount",
        Header: <Trans zh="输赢金额" en="Win Loss Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        Header: <Trans zh="净盈利" en="NetProfit" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
