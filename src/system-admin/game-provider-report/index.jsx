import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Card,
  useToasts,
  Group
} from "bumbag"
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
  useGameProviderReportList,
  useUpdateGameProviderReport,
  useUpdatePlatformGameProviderReport
} from "./client"
import { isValid, addMonths, startOfMonth } from "date-fns"
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
import { GameProviderCurrencyReportDisclosure } from "./GameProviderCurrencyReport"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import { DateHourRangeInput } from "../../date/DateTimeRangeInput"
import {
  localTimeOffset,
  TimezoneSelectField,
  toZonedTime
} from "../../date/TimeZone"
import {
  BetAmountTrans,
  GameProviderReportTrans,
  GameProviderTrans,
  TransactionCountTrans,
  TurnoverTrans,
  ValidBetAmountTrans
} from "../../trans/Game"
import { CurrencyTrans } from "../../trans/Payment"
import { CompanyWinLossTrans } from "../../trans/Platform"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <ReportContent />
}

export const CodeContentPair = [Code, Content]

const startOfSixMonthsAgo = () => {
  let sixMonthsAgo = addMonths(new Date(), -6)
  let start = startOfMonth(sixMonthsAgo)
  return start
}

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
    gameProviderId: "",
    from: undefined,
    to: undefined,
    currencyCode: undefined,
    timezoneOffset: localTimeOffset()
  })

  let validDateRange = isValid(state.from) && isValid(state.to)

  let culture = useLangCode()
  let toSearchParams = () => ({
    ...toApiParams(state),
    from: toZonedTime(state.from, state.timezoneOffset),
    to: toZonedTime(state.to, state.timezoneOffset),
    culture
  })

  let { isLoading, data, error, mutate, emptyData } = useGameProviderReportList(
    validDateRange ? toSearchParams() : undefined
  )

  let columns = useColumns({
    items: data?.items,
    month
  })

  let minDate = startOfSixMonthsAgo()

  return (
    <PageContent
      actionBar={
        <Set orientation="vertical">
          <FormProvider {...formMethods}>
            <Set marginBottom="1.5rem">
              <DateMonthInput
                name="month"
                minDate={minDate}
                placeholder={monthPlaceholder}
              />
              <UpdateGameProviderReportButton month={month} />
              <UpdatePlatformGameProviderReport month={month} />
            </Set>
          </FormProvider>
          <SearchBar
            from={state.from}
            to={state.to}
            gameProviderId={state.gameProviderId}
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
      title={<GameProviderReportTrans />}
    >
      {validDateRange && (
        <>
          <Table
            columns={columns}
            data={data?.items}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(state.pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
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
          {error && <AlertDialog {...error} onClickClose={emptyData} />}
        </>
      )}
    </PageContent>
  )
}

const UpdateGameProviderReportButton = ({ month }) => {
  let invalidDate = !isValid(month)
  let { control } = useFormContext()

  const GameProviderIdField = "gameProviderId"
  let gameProviderId = useWatch({
    control,
    name: GameProviderIdField
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } =
    useUpdateGameProviderReport(formData)

  let reportGenerationTitle = useTrans({
    zh: "游戏商報表產生中",
    en: "Game Provider Report generation in progress"
  })
  let toasts = useToasts()

  const reset = () => {
    setSubmit(undefined)
    mutate(undefined, false)
  }

  useEffect(() => {
    if (result) {
      toasts.add({
        title: reportGenerationTitle
      })
      reset()
    }
  }, [result])

  if (invalidDate) {
    return null
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={reset} />
  }

  return (
    <Group>
      <GameProviderSelect name="gameProviderId" />
      <Button
        disabled={isLoading}
        isLoading={isLoading}
        onClick={() => {
          setSubmit({
            startDate: month,
            gameProviderId
          })
        }}
        borderLeftWidth="1px"
        variant="outlined"
        palette="primary"
      >
        <Trans zh="加總資料" en="Advanced" />
      </Button>
    </Group>
  )
}

export const UpdatePlatformGameProviderReport = ({ month }) => {
  let invalidDate = !isValid(month)
  let { control } = useFormContext()

  const PlatformIdField = "brandId"
  let platformId = useWatch({
    control,
    name: PlatformIdField
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } =
    useUpdatePlatformGameProviderReport(formData)

  let reportGenerationTitle = useTrans({
    zh: "平台游戏商報表產生中",
    en: "Platform Game Provider Report generation in progress"
  })
  let toasts = useToasts()

  const reset = () => {
    setSubmit(undefined)
    mutate(undefined, false)
  }

  useEffect(() => {
    if (result) {
      toasts.add({
        title: reportGenerationTitle
      })
      reset()
    }
  }, [result])

  if (invalidDate) {
    return null
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={reset} />
  }

  return (
    <Group>
      <MerchantIdSelect
        css={css`
          .bb-SelectWrapper:last-child > select {
            border-radius: 0;
          }
        `}
      />
      <Button
        disabled={isLoading}
        isLoading={isLoading}
        onClick={() => {
          setSubmit({
            startDate: month,
            brandId: platformId
          })
        }}
        borderLeftWidth="1px"
        variant="outlined"
        palette="primary"
      >
        <Trans zh="平台加總資料" en="Platform Advanced" />
      </Button>
    </Group>
  )
}

const SearchBar = ({
  from,
  to,
  gameProviderId,
  currencyCode,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      from,
      to,
      gameProviderId,
      currencyCode
    }
  })
  let { control, getValues, setValue, clearErrors } = formMethods

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <TimezoneSelectField />
          <DateHourRangeInput
            id="date-range"
            dateFormat="yyyy/MM/dd HH"
            timeFormat="HH"
            showTimeInput={false}
            showTimeSelect
            timeIntervals={60}
            showDateDropdownMenu={false}
            startProps={{ name: "from" }}
            endProps={{ name: "to" }}
            required
          />
          <GameProviderSelect name="gameProviderId" valueField="id" />
          <CurrencySelectField name="currencyCode" />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], month }) => {
  return useMemo(
    () => [
      textColumn({
        id: "gameProviderName",
        accessor: (row) => row,
        Header: <GameProviderTrans />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, gameProviderName } }) => {
          return isTotal ? <Trans zh="共计" en="Total" /> : gameProviderName
        }
      }),
      textColumn({
        id: "currencyCode",
        accessor: (row) => row,
        Header: <CurrencyTrans />,
        disableSortBy: true,
        Cell: ({ value: { currencyCode = "" } }) => {
          return currencyCode
          /*
          return (
            <GameProviderCurrencyReportDisclosure currencyCode={currencyCode} />
          )
          */
        }
      }),
      numberColumn({
        accessor: "transactionCount",
        Header: <TransactionCountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <BetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "originalTurnover",
        Header: <TurnoverTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <ValidBetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyWinLoss",
        Header: <CompanyWinLossTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
