import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Level, Text, Link } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { yesterday } from "../../date/range"
import { useVipReportList, API } from "./client"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import VipLevelSelect from "../../vip-levels/VipLevelSelect"
import { PlayerRebatDialogDisclosure } from "./PlayerRebateReport"
import { isDev } from "../../env"
import { urlWith } from "../../client"
import DownloadButton from "../../button/DownloadButton"
import { VipLevelTrans } from "../../trans/Vip"
import { NetProfitTrans } from "../../trans/Field"
import { BetAmountTrans } from "../../trans/Game"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"
import { DepositAmountTrans } from "../../trans/Payment"

export { Code }

//TODO: rm @ v1.37
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
  let dateRange = yesterday()
  let QueryMaxRangeDays = 31
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    username: undefined,
    level: undefined,
    from: dateRange.start,
    to: dateRange.end
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageIndex, pageSize, from, to } = state
  const toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "username",
    from,
    to: startOfNextDay(to)
  })
  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useVipReportList(toSearchParams())

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  let columns = useColumns({
    brandId,
    start: from,
    end: to,
    items: data?.items
  })
  let maxDate = startOfToday()

  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            username={state?.username}
            level={state?.level}
            start={from}
            end={to}
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={QueryMaxRangeDays}
            isLoading={isLoading}
            search={({ start, end, ...data }) => {
              setState({
                pageIndex: 0,
                from: start,
                to: end,
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
                href={urlWith(toSearchParams(), `${API}/exportVips`)}
              />
            </Box>
          )}
        </Level>
      }
      title={<Trans zh="VIP报表" en="VIP Report" />}
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
  brandId,
  username,
  level,
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
      username,
      level,
      start,
      end
    }
  })

  let usernamePlaceholder = useUserNameTrans()

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateInputRange
            id="date-range"
            showDateDropdownMenu
            minDate={minDate}
            maxRangeDays={maxRangeDays}
            fakeTimeLabel
            required
          />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernamePlaceholder}
          />
          <VipLevelSelect
            name="level"
            brandId={brandId}
            optionValue={({ level }) => level}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, start, end, items = [] }) => {
  return useMemo(
    () => [
      textColumn({
        accessor: "username",
        Header: <UserNameTrans />,
        TotalCell: () => <Trans zh="总计" en="Total" />,
        Cell: ({ value }) => <Text.Block>{value}</Text.Block>,
        Footer: () => <Trans zh="页总计" en="Page Total" />,
        footerCellProps: {
          textAlign: "center"
        },
        disableSortBy: true
      }),
      textColumn({
        accessor: "level",
        Header: <VipLevelTrans />,
        TotalCell: () => null,
        Cell: ({ value }) => <Text.Block>VIP {value}</Text.Block>,
        Footer: () => <Box />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "depositAmount",
        sumColumn: "depositAmount",
        Header: <DepositAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "withdrawalAmount",
        sumColumn: "withdrawalAmount",
        Header: <Trans zh="提款金额" en="Withdrawal Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAmount",
        sumColumn: "bonusAmount",
        Header: <Trans zh="红利金额" en="Bonus Amount" />,
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
      textColumn({
        id: "rebateAmount",
        accessor: (row) => row,
        sumColumn: "rebateAmount",
        toValue: (row) => row?.rebateAmount,
        Header: <Trans zh="返水金额" en="Commission Rebate Amount" />,
        disableSortBy: true,
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        Cell: ({ value }) => {
          return (
            <PlayerRebatDialogDisclosure
              use={Link}
              brandId={brandId}
              username={value?.username}
              start={start}
              end={end}
              value={value?.rebateAmount}
            />
          )
        }
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        sumColumn: "betAmount",
        Header: <BetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        sumColumn: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid bet" />,
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
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <NetProfitTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
