import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Level, Text, Link } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useLangCode, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import {
  DateInputRange,
  DateInputRangeField
} from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import {
  useGameProviderReportList,
  useUpdateGameProviderReport
} from "./client"
import { subDays, isValid } from "date-fns"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { urlWith } from "../../client"
import { isDev } from "../../env"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import { CurrencySelectField } from "../../currency/CurrencySelect"
import { DateMonthInput } from "../../date/DateMonthInput"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <ReportContent />
}

export const CodeContentPair = [Code, Content]

//TODO:
// 1. month input
// 2. aggregate btn
const ReportContent = ({}) => {
  let monthPlaceholder = useTrans({
    en: "Month",
    zh: "月份"
  })
  let formMethods = useForm({
    defaultValues: {
      month: undefined
    }
  })
  let { control } = formMethods
  let month = useWatch({ control, name: "month" })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    gameProviderCode: "",
    currencyCode: undefined
  })

  let culture = useLangCode()
  let toSearchParams = () => ({
    ...toApiParams(state),
    sortby: "gameProviderName",
    culture,
    month
  })

  let { isLoading, data, error, mutate, deleteCache } =
    useGameProviderReportList(isValid(month) ? toSearchParams() : undefined)

  let columns = useColumns({
    items: data?.items
  })

  return (
    <PageContent
      actionBar={
        <Set orientation="vertical">
          <FormProvider {...formMethods}>
            <Set>
              <DateMonthInput name="month" placeholder={monthPlaceholder} />
              <UpdateReportButton month={month} />
            </Set>
          </FormProvider>
          <SearchBar
            month={state.month}
            gameProviderCode={state.gameProviderCode}
            currencyCode={state.currencyCode}
            isLoading={isLoading}
            search={({ ...rest }) => {
              setState({
                pageIndex: 0,
                ...rest
              })
              mutate()
            }}
          />
        </Set>
      }
      title={<Trans zh="游戏商報表" en="Game Provider Report" />}
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
        // getTableHeadProps={() => {
        //   return {
        //     zIndex: state.pageSize
        //   }
        // }}
        getRowProps={({ original: { isTotal }, index } = {}) => {
          if (isTotal) {
            return {
              "data-row-type": "total",
              backgroundColor: "white600",
              fontWeight: "bold"
              /*
              position: "sticky",
              bottom: "0",
              zIndex: state.pageSize - index
              */
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

const UpdateReportButton = ({ month }) => {
  let invalidDate = !isValid(month)

  let [formData, setSubmit] = useState()
  let { isLoading, data, error, mutate } = useUpdateGameProviderReport(formData)

  const reset = () => {
    setSubmit(undefined)
    mutate(undefined, false)
  }

  useEffect(() => {
    if (data) {
      reset()
    }
  }, [data])

  if (invalidDate) {
    return null
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={reset} />
  }

  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        setSubmit(month)
      }}
    >
      <Trans zh="更新報表" en="Update Report" />
    </Button>
  )
}

const SearchBar = ({
  month,
  gameProviderCode,
  currencyCode,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      month,
      gameProviderCode,
      currencyCode
    }
  })
  let { control, getValues, setValue, clearErrors } = formMethods

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <GameProviderSelect name="gameProviderCode" valueField="code" />
          <CurrencySelectField name="currencyCode" />
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
        id: "gameProviderName",
        accessor: (row) => row,
        Header: <Trans zh="游戏商" en="Game Provider" />,
        disableSortBy: true
      }),
      textColumn({
        id: "currencyCode",
        accessor: (row) => row,
        Header: <Trans zh="币种" en="Currency" />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, currencyCode = "" } }) => {
          //TODO: dialog > search game provider & currency?
          return currencyCode
          // return isTotal ? <Trans zh="共计" en="Total" /> : currencyCode
        }
      }),
      numberColumn({
        accessor: "transactionCount",
        Header: <Trans zh="訂單筆數" en="Transactions" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "originalTurnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid Bet" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyWinLoss",
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
