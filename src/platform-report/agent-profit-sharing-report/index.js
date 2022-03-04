import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  Text,
  Link,
  FieldStack,
  Alert
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  Trans,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { useAgentDividendList, API } from "./client"
import { AgentWinLossDialogDisclosure } from "./AgentWinLoss"
import { AgentBonusDetailDialogDisclosure } from "./AgentBonusDetail"
import { AgentTypeSelect } from "../../agent/AgentType"
import { isDev } from "../../env"
import { urlWith } from "../../client"
import DownloadButton from "../../button/DownloadButton"
import { AgentTeamContributionDialogDisclosure } from "./AgentTeamContribution"

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
  let dateRange = yesterday()
  let QueryMaxRangeDays = 31
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    pageSize: QueryMaxRangeDays,
    username: "",
    type: "",
    from: dateRange.start,
    to: dateRange.end
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageIndex, pageSize, username, from, to } = state
  const toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "username",
    from,
    to: startOfNextDay(to)
  })
  let { isLoading, data, error, mutate, deleteCache } = useAgentDividendList(
    username ? toSearchParams() : undefined
  )

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
            type={state?.type}
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
                href={urlWith(toSearchParams(), `${API}/exportAgentDividends`)}
              />
            </Box>
          )}
        </Level>
      }
      title={<Trans zh="代理分红报表" en="Agent Profit Sharing Report" />}
    >
      {username && (
        <FieldStack>
          <TotalsInfo data={data} />
          <Table
            columns={columns}
            data={data?.items}
            total={data?.total}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
            foot={data?.items?.length > 0}
            stickyHead
          />
        </FieldStack>
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const TotalsInfo = ({ data }) => {
  //TODO: data from api
  let totalWinLoss = undefined
  let totalCost = undefined
  let totalNetProfit = undefined

  if (
    !Number.isFinite(totalWinLoss) ||
    !Number.isFinite(totalCost) ||
    !Number.isFinite(totalNetProfit)
  ) {
    return null
  }

  return (
    <Set
      isFilled
      css={css`
        font-weight: bold;
      `}
    >
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Win Loss：" zh="总输赢金额：" />
        <FormattedNumberDecimal value={totalWinLoss} />
      </Alert>
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Cost：" zh="总成本：" />
        <FormattedNumberDecimal value={totalCost} />
      </Alert>
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Net Profit：" zh="总盈余：" />
        <FormattedNumberDecimal value={totalNetProfit} />
      </Alert>
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Profit Sharing：" zh="总分红金额：" />
        <FormattedNumberDecimal value={totalCost} />
      </Alert>
    </Set>
  )
}

const SearchBar = ({
  brandId,
  username,
  type,
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
      type,
      start,
      end
    }
  })

  let usernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent username"
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
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernamePlaceholder}
            requiredMessage=""
            required
            autoFocus
          />
          <AgentTypeSelect name="type" />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, start, end, items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "username",
        Header: <Trans zh="代理用户名" en="Agent Username" />,
        TotalCell: () => <Trans zh="总计" en="Total" />,
        Cell: ({ value }) => <Text.Block>{value}</Text.Block>,
        Footer: () => <Trans zh="页总计" en="Page Total" />,
        footerCellProps: {
          textAlign: "center"
        },
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
        accessor: "bonusAmount",
        sumColumn: "bonusAmount",
        Header: <Trans zh="红利金额" en="Bonus Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "adjustmentAmount",
        sumColumn: "adjustmentAmount",
        Header: <Trans zh="调账" en="Adjustment Amount" />,
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
        id: "winLossAmount",
        accessor: (row) => row,
        sumColumn: "winLossAmount",
        toValue: (row) => row?.winLossAmount,
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <AgentWinLossDialogDisclosure
              brandId={brandId}
              agentId={value?.id}
              start={start}
              end={end}
              username={value?.username}
              value={value?.winLossAmount}
              use={Link}
            />
          )
        }
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <Trans zh="净盈利" en="Net Profit" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "agentDividendAmount",
        accessor: (row) => row,
        sumColumn: "agentDividendAmount",
        toValue: (row) => row?.agentDividendAmount,
        Header: <Trans zh="分红金额" en="Profit Sharing Amount" />,
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <AgentBonusDetailDialogDisclosure
              brandId={brandId}
              agentId={value?.id}
              start={start}
              end={end}
              username={value?.username}
              value={value?.agentDividendAmount}
              use={Link}
            />
          )
        }
      })
    ]

    columns.push(
      ...[
        numberDecimalColumn({
          accessor: "fromPlayerAgentDividendAmount",
          sumColumn: "fromPlayerAgentDividendAmount",
          Header: <Trans zh="玩家贡献" en="Player Contribution" />,
          disableSortBy: true
        }),
        numberDecimalColumn({
          id: "fromTeamAgentDividendAmount",
          accessor: (row) => row,
          sumColumn: "fromTeamAgentDividendAmount",
          toValue: (row) => row?.fromTeamAgentDividendAmount,
          Header: <Trans zh="团队贡献" en="Team Contribution" />,
          TotalCell: ({ value }) => (
            <FormattedNumber value={value} format="0,0.00" digits={2} />
          ),
          disableSortBy: true,
          Cell: ({ value }) => {
            return (
              <AgentTeamContributionDialogDisclosure
                brandId={brandId}
                agentId={value?.id}
                start={start}
                end={end}
                username={value?.username}
                value={value?.fromTeamAgentDividendAmount}
                use={Link}
              />
            )
          }
        })
      ]
    )

    return columns
  }, [JSON.stringify(items)])
}
