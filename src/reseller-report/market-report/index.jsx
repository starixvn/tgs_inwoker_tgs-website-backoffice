import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Level, Alert, List } from "bumbag"
import PageContent from "../../page/Content"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserLicenseeId,
  useUserResellerId
} from "../../user/context"
import { today, yesterday } from "../../date/range"
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
import Big from "big.js"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { useTableColumnHiddenLocalStorage } from "../../table/ActionBar"
import { NetProfitTrans } from "../../trans/Field"

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

  let [hiddenColumns] = useTableColumnHiddenLocalStorage(
    TableLocalStorageKey,
    []
  )

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    resellerId,
    currencyCode: undefined,
    from: dateRange.start,
    to: dateRange.end,
    hiddenColumns
  })

  useEffect(() => {
    setState({ pageIndex: 0, resellerId })
  }, [resellerId])

  let culture = useLangCode()
  let { pageSize, from, to } = state
  let toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "currencyCode",
    from,
    to: startOfNextDay(to),
    culture
  })
  let { isLoading, data, error, mutate, deleteCache } =
    useResellerMarketReportList(toSearchParams())

  let columns = useColumns({ items: data?.items })
  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            resellerId={resellerId}
            currencyCode={state?.currencyCode}
            from={from}
            to={to}
            isLoading={isLoading}
            search={(data) => {
              setState({
                pageIndex: 0,
                ...data
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
                href={urlWith(toSearchParams(), `${API}/export`)}
              />
            </Box>
          )} 
          */}
        </Level>
      }
      title={<Trans zh="市场报表 - 总公司" en="Market Report - Reseller" />}
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
  resellerId,
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
        Header: <Trans zh="平台" en="Platform" />,
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
        id: "depositAmount",
        accessor: (row) => row,
        Header: <Trans zh="存款金额" en="Deposit Amount" />,
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
        accessor: "agentProfit",
        Header: <Trans zh="代理总分红" en="Agent Profit" />,
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
        Header: <NetProfitTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
