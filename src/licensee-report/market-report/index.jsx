import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Alert, Set, Level, List } from "bumbag"
import PageContent from "../../page/Content"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useLangCode,
  useTrans
} from "../../i18n"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserLicenseeId
} from "../../user/context"
import { today, yesterday } from "../../date/range"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import { useLicenseeMarketReportList, API } from "./client"
import { Licensee } from "../../merchant/licensees"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { subDays, startOfToday } from "date-fns"
import { isDev } from "../../env"
import textColumn, { wrapTextColumn } from "../../table/column/textColumn"
import { LicenseeCurrencySelect } from "../LicenseeCurrencySelect"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client/index"
import Big from "big.js"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { useTableColumnHiddenLocalStorage } from "../../table/ActionBar"
import { NetProfitTrans } from "../../trans/Field"
import { BetAmountTrans, TurnoverTrans } from "../../trans/Game"
import {
  CurrencyTrans,
  DepositAmountTrans,
  WithdrawAmountTrans
} from "../../trans/Payment"
import {
  DepositAmountAfterDeductingTransferFeeTrans,
  PlatformTrans
} from "../../trans/Platform"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

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

  let [hiddenColumns] = useTableColumnHiddenLocalStorage(
    TableLocalStorageKey,
    []
  )

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    licenseeId,
    currencyCode: undefined,
    from: dateRange.start,
    to: dateRange.end,
    hiddenColumns
  })

  useEffect(() => {
    setState({ pageIndex: 0, licenseeId })
  }, [licenseeId])

  let { pageSize, from, to } = state
  let culture = useLangCode()
  let toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "currencyCode",
    from,
    to: startOfNextDay(to),
    culture
  })

  let { isLoading, data, error, mutate, deleteCache } =
    useLicenseeMarketReportList(toSearchParams())

  let columns = useColumns({ items: data?.items })
  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            licenseeId={licenseeId}
            currencyCode={state?.currencyCode}
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
              <DownloadButton
                id="export-report"
                isLoading={isLoading}
                href={urlWith(toSearchParams(), `${API}/exportLicenseeMarkets`)}
              />
            </Box>
          )}
        </Level>
      }
      title={<Trans zh="市场报表 - 公司" en="Market Report - Licensee" />}
    >
      <Stack>
        <Alert variant="bordered" type="info" accent marginBottom="1rem">
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <DepositAmountAfterDeductingTransferFeeTrans />
            </List.Item>
          </List>
        </Alert>
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
          localStorageKey={TableLocalStorageKey}
          toggleColumnHidden={true}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  licenseeId,
  currencyCode,
  from,
  to,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      currencyCode,
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
          <LicenseeCurrencySelect name="currencyCode" licenseeId={licenseeId} />
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
        Header: <PlatformTrans />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, brandCode = "" } }) => {
          return isTotal ? "" : brandCode
          // return isTotal ? <Trans zh="共计" en="Total" /> : brandCode
        }
      }),
      wrapTextColumn({
        id: "currencyCode",
        accessor: (row) => row,
        Header: <CurrencyTrans />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, currencyCode = "" } }) => {
          // return isTotal ? "" : currencyCode
          return isTotal ? <Trans zh="共计" en="Total" /> : currencyCode
        }
      }),
      numberDecimalColumn({
        id: "depositAmount",
        accessor: (row) => row,
        Header: <DepositAmountTrans />,
        disableSortBy: true,
        toValue: ({ isTotal, depositAmount, depositHandlingFee = 0 } = {}) => {
          let value = Number.isFinite(depositAmount)
            ? new Big(depositAmount).minus(depositHandlingFee).toNumber()
            : depositAmount
          return value
        }
      }),
      numberDecimalColumn({
        accessor: "withdrawalAmount",
        Header: <WithdrawAmountTrans />,
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
        accessor: "agentProfit",
        Header: <Trans zh="代理总分红" en="Agent Profit" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <BetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <TurnoverTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLossAmount",
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        Header: <NetProfitTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
