import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  Flex,
  Button,
  Text,
  Switch,
  Input,
  Stack,
  Dialog,
  Level
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import BrandBar from "../../report/BrandBar"
import { SortOrder } from "../../table/order"
import { NumberInput } from "../../input/NumberInput"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { yesterday } from "../../date/range"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import { useAgentMarketingReport } from "./client"
import { startOfNextDay } from "../../date/startOfNextDay"
import {
  BetAmountTrans,
  TurnoverTrans,
  ValidBetAmountTrans
} from "../../trans/Game"
import { DepositAmountTrans, WithdrawAmountTrans } from "../../trans/Payment"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled height="100%">
      <BrandBar
        id="page-merchant-bar"
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  let dateRange = yesterday()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    agentUsername: "",
    from: dateRange.start,
    to: dateRange.end
  })

  let { agentUsername, from, to } = state
  let { isLoading, data, error, mutate, deleteCache } = useAgentMarketingReport(
    agentUsername
      ? { ...toApiParams(state), from, to: startOfNextDay(to) }
      : undefined
  )

  const reset = () => {
    mutate(null)
    deleteCache()
  }

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
    reset()
  }, [brandId])

  let columns = useColumns({
    items: data?.items,
    brandId,
    agentUsername
  })

  return (
    <PageContent
      title={<Trans zh="代理市場報表" en="Agent Marketing Report" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            from={state?.from}
            to={state?.to}
            search={(data) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
        </Level>
      }
    >
      {agentUsername && (
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          stickyHead
        />
      )}

      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  brandId,
  agentUsername,
  from,
  to,
  search,
  isLoading,
  ...props
}) => {
  const QueryMaxRangeDays = 31
  let agentUsernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent Username"
  })

  let formMethods = useForm({
    defaultValues: {
      agentUsername,
      from,
      to
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="agentUsername"
            autoFocus
            showEmptyFieldValueAddonAfter
            placeholder={agentUsernamePlaceholder}
            required
          />
          <DateInputRange
            showDateDropdownMenu
            maxRangeDays={QueryMaxRangeDays}
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
            required
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, items = [] }) => {
  return useMemo(() => {
    let columns = [
      numberColumn({
        accessor: "registeredCount",
        Header: <Trans zh="注册人数" en="Registered Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "firstFundInCount",
        Header: <Trans zh="首存人数" en="First Deposit Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "depositorCount",
        Header: <Trans zh="存款人数" en="Depositor Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "placeBetPlayerCount",
        Header: <Trans zh="投注人数" en="Place Bet Player Count" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "playGamePlayerCount",
        Header: <Trans zh="游戏人数" en="Play Game Player Count" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "deposit",
        Header: <DepositAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "withdraw",
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
        accessor: "betAmount",
        Header: <BetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        sumColumn: "validBetAmount",
        Header: <ValidBetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        sumColumn: "turnover",
        Header: <TurnoverTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyWinLoss",
        Header: <Trans zh="公司输赢金额" en="Co. Win Loss" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "additionalExpenses",
        Header: <Trans zh="额外支出" en="Additional Expenses" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <Trans zh="净盈利" en="NetProfit" />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
