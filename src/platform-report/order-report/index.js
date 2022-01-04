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
  GameRoundStatusLabel,
  GameRoundStatusSelect
} from "../../game/round/GameRoundStatus"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import { useGameRoundList } from "../../game/round/client"
import { GameRoundButton } from "./button"
import AlertDialog from "../../dialog/Alert"
import { CopyTextBox } from "../../text/CopyTextBox"
import { isDev } from "../../env"

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
            console.log("rest", rest)
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
      title={<Trans zh="订单查询" en="Order Tracking" />}
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
        isSticky
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
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
  let { control, getValues, setValue, clearErrors } = formMethods

  const onSubmit = (data) => search?.(data)

  let playerNamePlaceholder = useTrans({
    zh: "用户名",
    en: "Player Name"
  })

  let roundIdPlaceholder = useTrans({
    zh: "订单ID",
    en: "Round ID"
  })

  let externalRoundIdPlaceholder = useTrans({
    zh: "三方订单ID",
    en: "External ID"
  })

  const StartField = "start"
  let startValue = useWatch({ control, name: StartField })

  const EndField = "end"
  let endValue = useWatch({ control, name: EndField })
  useEffect(() => {
    if (isValid(startValue) && isValid(endValue)) {
      setValue("sortby", "createdOn")
    }
  }, [startValue, endValue])

  const ClosedFromField = "closedFrom"
  let closedFromValue = useWatch({ control, name: ClosedFromField })

  const ClosedToField = "closedTo"
  let closedToValue = useWatch({ control, name: ClosedToField })
  useEffect(() => {
    if (isValid(closedFromValue) && isValid(closedToValue)) {
      setValue("sortby", "closedOn")
    }
  }, [closedFromValue, closedToValue])

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FieldStack orientation="vertical">
          <Set orientation="horizontal">
            <DateInputRangeField
              label={<Trans zh="投注时间" en="Created On" />}
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
                  clearErrors([ClosedFromField, ClosedToField])
                }

                return pass ? true : "one-of-date-range-required"
              }}
            />
            <DateInputRangeField
              label={<Trans zh="结算时间" en="Closed On" />}
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
                    clearErrors([StartField, EndField])
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
              showEmptyFieldValueAddonAfter
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
            <GameRoundStatusSelect name="status" />
            <GameProviderSelect name="gameProviderId" />
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </FieldStack>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      textColumn({
        accessor: "playerName",
        Header: <Trans zh="用户名" en="Player Name" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      ellipsisTextColumn({
        accessor: "externalRoundId",
        Header: <Trans zh="三方订单ID" en="External Id" />,
        disableSortBy: true,
        maxWidth: "8rem",
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      ellipsisTextColumn({
        accessor: "id",
        Header: <Trans zh="订单ID" en="Id" />,
        disableSortBy: true,
        maxWidth: "8rem",
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="投注时间" en="Created On" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "closedOn",
        Header: <Trans zh="结算时间" en="Closed On" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameProviderName",
        Header: <Trans zh="游戏厂商" en="Game Provider" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "subGameProviderName",
        Header: <Trans zh="子游戏厂商" en="Sub Game Provider" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameName",
        Header: <Trans zh="游戏名称" en="Game Name" />,
        disableSortBy: true
      }),
      {
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: GameRoundStatusLabel,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        }
      },
      textColumn({
        accessor: "currencyCode",
        Header: <Trans zh="币种" en="Currency" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        Header: <Trans zh="派彩" en="Settle Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <Trans zh="玩家输赢金额" en="Player Win Loss" />,
        disableSortBy: true
      }),
      {
        id: "detail",
        accessor: (record) => record,
        Header: <Trans zh="详情" en="Detail" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Set>
              <GameRoundButton record={value} />
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
    ],
    [JSON.stringify(items)]
  )
}
