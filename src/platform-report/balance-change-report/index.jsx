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
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { useBalanceChangeReportList, API } from "./client"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { urlWith } from "../../client"
import { isDev } from "../../env"
import sequenceColumn from "../../table/column/sequence"
import {
  TransactionTypeLabel,
  TransactionTypeSelect
} from "./TransactionTypeSelect"
import dateTimeColumn from "../../table/column/dateTime"
import { DateButtons } from "../../date/DateButtons"
import {
  OperatorTrans,
  RemarkTrans,
  TransactionTypeTrans
} from "../../trans/Action"
import {
  BalanceAfterTrans,
  BalanceBeforeTrans,
  UserNameTrans,
  useUserNameTrans
} from "../../trans/User"
import { BalanceChangeReportTrans } from "../../trans/Platform"
import { TimeTrans } from "../../trans/Date"
import { TransactionAmountTrans } from "../../trans/Field"

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
  let dateRange = today()
  let QueryMaxRangeDays = 31

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: dateRange.end,
    username: "",
    transactionType: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { from, to } = state
  let culture = useLangCode()
  const toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "recordedOn",
    orderby: "descending",
    from,
    to: startOfNextDay(to),
    culture
  })

  let { isLoading, data, error, mutate, deleteCache } =
    useBalanceChangeReportList(toSearchParams())

  let columns = useColumns({
    items: data?.items
  })

  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            start={from}
            end={to}
            username={state.username}
            transactionType={state.transactionType}
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
        </Level>
      }
      title={<BalanceChangeReportTrans />}
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        // foot={data?.items?.length > 0}
        stickyHead
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  username,
  transactionType,
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
          <TransactionTypeSelect name="transactionType" />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, items = [] }) => {
  return useMemo(
    () => [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        Header: <TimeTrans />,
        accessor: "recordedOn",
        disableSortBy: true
      }),
      textColumn({
        accessor: "transactionType",
        Header: <TransactionTypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <TransactionTypeLabel value={value} />
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <TransactionAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "beforeBalance",
        Header: <BalanceBeforeTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "afterBalance",
        Header: <BalanceAfterTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "operator",
        Header: <OperatorTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "description",
        Header: <RemarkTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
