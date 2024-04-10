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
  useModalState,
  FieldStack
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Trans, useTrans, getAcceptLangCulture, useLangCode } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import { ellipsisTextColumn, textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import { subDays, isValid } from "date-fns"
import {
  DateInputRange,
  DateInputRangeField
} from "../../date/DateTimeRangeInput"
import {
  GameRoundStatus,
  GameRoundStatusLabel,
  GameRoundStatusSelect
} from "../../game/round/GameRoundStatus"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import { useGameRoundList } from "../../game/round/client"
import { GameRoundButton } from "./button"
import AlertDialog from "../../dialog/Alert"
import { CopyTextBox } from "../../text/CopyTextBox"
import { isDev } from "../../env"
import { GameActionDialogDisclosure } from "../../game/round/GameActionDialog"
import { splitEvery, any } from "ramda"
import { isValidDate } from "../../date/isValidDate"
import { PlayerWinLossTrans } from "../../trans/Player"
import {
  BetAmountTrans,
  BetTimeTrans,
  ExternalRoundIdTrans,
  GameNameTrans,
  GameProviderTrans,
  OrderTrackingTrans,
  RoundIdTrans,
  SettleTimeTrans,
  SubGameProviderTrans,
  TurnoverTrans,
  ValidBetAmountTrans,
  useExternalRoundIdTrans,
  useRoundIdTrans
} from "../../trans/Game"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"
import { CurrencyTrans } from "../../trans/Payment"
import { DetailTrans } from "../../trans/Action"
import { SettleAmountTrans } from "../../trans/Field"

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
        paddingTop="0.5rem"
        paddingLeft="0.5rem"
      />
      {brandId && <ReportContent brandId={brandId} />}
    </Set>
  )
}

const ReportContent = ({ brandId }) => {
  let dateRange = today()
  let QueryMaxRangeDays = 31
  //TODO: rm status
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    externalFrom: undefined,
    externalTo: undefined,
    externalClosedFrom: undefined,
    externalClosedTo: undefined,
    from: dateRange.start,
    to: dateRange.end,
    closedFrom: undefined,
    closedTo: undefined,
    sortby: "createdOn",
    username: "",
    roundId: "",
    externalRoundId: "",
    status: "",
    gameProviderId: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let {
    pageIndex,
    pageSize,
    from,
    to,
    closedFrom,
    closedTo,
    username,
    roundId,
    status,
    gameProviderId
  } = state

  let culture = useLangCode()
  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useGameRoundList({
    ...toApiParams(state),
    orderby: "descending",
    from,
    to: startOfNextDay(to),
    closedFrom,
    closedTo: startOfNextDay(closedTo),
    culture
  })

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  let columns = useColumns({ items: data?.items })
  return (
    <PageContent
      actionBar={
        <SearchBar
          externalFrom={state.externalFrom}
          externalTo={state.externalTo}
          externalClosedFrom={state.externalClosedFrom}
          externalClosedTo={state.externalClosedTo}
          start={from}
          end={to}
          closedFrom={state?.closedFrom}
          closedTo={state?.closedTo}
          username={username}
          roundId={roundId}
          externalRoundId={state?.externalRoundId}
          status={status}
          gameProviderId={gameProviderId}
          minDate={minDate}
          maxDate={dateRange.end}
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
      }
      title={<OrderTrackingTrans />}
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
        getRowId={(row) => row.id}
        stickyHead
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

//TODO: rm status
const SearchBar = ({
  externalFrom,
  externalTo,
  externalClosedFrom,
  externalClosedTo,
  start,
  end,
  closedFrom,
  closedTo,
  sortby,
  username,
  roundId,
  externalRoundId,
  status,
  gameProviderId,
  minDate,
  maxDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      externalFrom,
      externalTo,
      externalClosedFrom,
      externalClosedTo,
      start,
      end,
      closedFrom,
      closedTo,
      sortby,
      username,
      roundId,
      externalRoundId,
      status,
      gameProviderId
    }
  })
  let { control, getValues, setValue } = formMethods

  const onSubmit = (data) => search?.(data)

  let playerNamePlaceholder = useUserNameTrans()

  let roundIdPlaceholder = useRoundIdTrans()

  let externalRoundIdPlaceholder = useExternalRoundIdTrans()

  //TODO: rename to from
  //TODO: apply maxDate={maxDate}
  const StartField = "start"
  let startValue = useWatch({ control, name: StartField })

  //TODO: rename to "to"
  const EndField = "end"
  let endValue = useWatch({ control, name: EndField })
  useEffect(() => {
    if (isValid(startValue) && isValid(endValue)) {
      setValue("sortby", "createdOn")
    }
  }, [startValue, endValue])

  //TODO: apply maxDate={maxDate}
  const ClosedFromField = "closedFrom"
  let closedFromValue = useWatch({ control, name: ClosedFromField })

  const ClosedToField = "closedTo"
  let closedToValue = useWatch({ control, name: ClosedToField })
  useEffect(() => {
    if (isValid(closedFromValue) && isValid(closedToValue)) {
      setValue("sortby", "closedOn")
    }
  }, [closedFromValue, closedToValue])

  //TODO: apply to all date range inputs
  const validateValidDateRanges = (range = {}, otherDateRangeFields = []) => {
    let allDateRanges = splitEvery(2, [
      range.start,
      range.end,
      ...getValues(otherDateRangeFields)
    ])

    let pass = any(([start, end]) => {
      return isValidDate(start) && isValidDate(end)
    }, allDateRanges)

    return pass ? true : "one-of-date-range-required"
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FieldStack orientation="vertical">
          <Set orientation="horizontal">
            <DateInputRangeField
              label={<BetTimeTrans />}
              showDateDropdownMenu
              minDate={minDate}
              maxRangeDays={maxRangeDays}
              fakeTimeLabel
              startProps={{
                name: StartField
              }}
              endProps={{
                name: EndField
              }}
              validate={(createdOn) => {
                let hasCreatedOn =
                  isValid(createdOn.start) && isValid(createdOn.end)

                let closedFrom = getValues(ClosedFromField)
                let closedTo = getValues(ClosedToField)
                let hasClosedOn = isValid(closedFrom) && isValid(closedTo)

                let pass = hasCreatedOn || hasClosedOn
                if (pass) {
                  // clearErrors([ClosedFromField, ClosedToField])
                }

                return pass ? true : "one-of-date-range-required"
              }}
            />
            <DateInputRangeField
              label={<SettleTimeTrans />}
              showDateDropdownMenu
              minDate={minDate}
              maxRangeDays={maxRangeDays}
              fakeTimeLabel
              startProps={{
                name: ClosedFromField
              }}
              endProps={{
                name: ClosedToField
              }}
              validate={{
                validate: (closedOn) => {
                  let hasClosedOn =
                    isValid(closedOn.start) && isValid(closedOn.end)

                  let start = getValues(StartField)
                  let end = getValues(EndField)
                  let hasCreatedOn = isValid(start) && isValid(end)

                  let pass = hasCreatedOn || hasClosedOn
                  if (pass) {
                    // clearErrors([StartField, EndField])
                  }
                  return pass ? true : "one-of-date-range-required"
                }
              }}
            />
          </Set>
          <Set orientation="horizontal">
            <InputField
              name="username"
              showEmptyFieldValueAddonAfter
              placeholder={playerNamePlaceholder}
            />
            <InputField
              name="roundId"
              showEmptyFieldValueAddonAfter
              placeholder={roundIdPlaceholder}
            />
            <InputField
              name="externalRoundId"
              showEmptyFieldValueAddonAfter
              placeholder={externalRoundIdPlaceholder}
            />
            <GameProviderSelect name="gameProviderId" />
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </FieldStack>
      </form>
    </FormProvider>
  )
}

export const useColumns = ({ items = [], filter: predicate }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "playerName",
        Header: <UserNameTrans />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      ellipsisTextColumn({
        accessor: "externalRoundId",
        Header: <ExternalRoundIdTrans />,
        headCellProps: {
          bodyProps: {
            title: useExternalRoundIdTrans()
          }
        },
        disableSortBy: true,
        maxWidth: "8rem",
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      ellipsisTextColumn({
        accessor: "id",
        Header: <RoundIdTrans />,
        headCellProps: {
          bodyProps: {
            title: useRoundIdTrans()
          }
        },
        disableSortBy: true,
        maxWidth: "8rem",
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <BetTimeTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "closedOn",
        Header: <SettleTimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameProviderName",
        Header: <GameProviderTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "subGameProviderName",
        Header: <SubGameProviderTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameName",
        Header: <GameNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "currencyCode",
        Header: <CurrencyTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <BetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <ValidBetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <TurnoverTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        Header: <SettleAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <PlayerWinLossTrans />,
        disableSortBy: true
      }),
      {
        id: "detail",
        accessor: (record) => record,
        Header: <DetailTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <GameRoundButton
                id="game-round-dialog-disclosure"
                record={record}
              />
              <GameActionDialogDisclosure
                id="game-action-dialog-disclosure"
                roundId={record?.id}
              />
            </Set>
          )
        },
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        }
      }
    ]

    if (predicate) {
      return columns.filter(predicate)
    }
    return columns
  }, [JSON.stringify(items)])
}
