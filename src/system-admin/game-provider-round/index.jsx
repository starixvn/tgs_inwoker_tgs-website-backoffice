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
  FieldStack,
  FieldWrapper
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
import { textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import { subDays, addMinutes, subMinutes } from "date-fns"
import DateTimeRangeInput, {
  DateInputRange,
  DateInputRangeField
} from "../../date/DateTimeRangeInput"
import {
  GameRoundStatus,
  GameRoundStatusLabel,
  GameRoundStatusSelect,
  useGameRoundStatusOptions
} from "../../game/round/GameRoundStatus"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import { useGameRoundList } from "../../game/round/client"
import AlertDialog from "../../dialog/Alert"
import { CopyTextBox } from "../../text/CopyTextBox"
import { isDev } from "../../env"
import { GameActionDialogDisclosure } from "../../game/round/GameActionDialog"
import { CurrencySelectField } from "../../currency/CurrencySelect"
import { GameTypeSelect } from "../../game/GameType"
import BrandIdSelect from "../../merchant/platforms/BrandIdSelect"
import { GameProviderSubGameProviderSelect } from "../../game/providers/GameProviderSubGameProviderSelect"
import { addHours } from "date-fns/esm"
import DownloadButton from "../../button/DownloadButton"
import { isValidDate } from "../../date/isValidDate"
import { splitEvery, any } from "ramda"
import { GameRoundDialogDisclosure } from "../../game/round/GameRoundDialog"

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
  //TODO: remove brand id
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

const last10MinRange = () => {
  let now = new Date()
  let end = addMinutes(now, 1)
  let start = subMinutes(end, 10)
  return {
    start,
    end
  }
}

const ReportContent = ({ brandId }) => {
  let dateRange = today() //last10MinRange()
  let QueryMaxRangeDays = 31

  //TODO: set externalFrom, externalTo default value
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
    sortby: "",
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

  const toSearchParams = () => ({
    ...toApiParams(state),
    orderby: "descending",
    from,
    to: startOfNextDay(to),
    closedFrom,
    closedTo: startOfNextDay(closedTo),
    culture
  })

  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useGameRoundList(toSearchParams())

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)
  //TODO: need maxDate?

  let columns = useColumns({ items: data?.items })
  return (
    <PageContent
      actionBar={
        <SearchBar
          from={state?.from}
          to={to}
          closedFrom={state?.closedFrom}
          closedTo={state?.closedTo}
          username={username}
          roundId={roundId}
          externalRoundId={state?.externalRoundId}
          status={status}
          gameProviderId={gameProviderId}
          minDate={minDate}
          //   maxDate={dateRange.end}
          maxRangeDays={QueryMaxRangeDays}
          isLoading={isLoading}
          search={({ ...rest }) => {
            setState({
              pageIndex: 0,
              ...rest
            })
            mutate()
          }}
        />
      }
      title={<Trans zh="订单管理" en="Order Management" />}
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

const DateFormat = "yyyy/MM/dd HH:mm"

const SearchBar = ({
  externalFrom,
  externalTo,
  externalClosedFrom,
  externalClosedTo,
  from,
  to,
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
      from,
      to,
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
  let { control, getValues, setValue, clearErrors, watch } = formMethods

  const onSubmit = (data) => search?.(data)

  let playerNamePlaceholder = useTrans({
    zh: "用户名",
    en: "Player Name"
  })
  let externalUsernamePlaceholder = useTrans({
    zh: "三方用戶名",
    en: "3rd Party Player Name"
  })

  let roundIdPlaceholder = useTrans({
    zh: "订单ID",
    en: "Round ID"
  })

  let externalRoundIdPlaceholder = useTrans({
    zh: "三方订单ID",
    en: "3rd Party ID"
  })

  const ExternalFromField = "externalFrom"
  const ExternalToField = "externalTo"

  const ExternalClosedFromField = "externalClosedFrom"
  const ExternalClosedToField = "externalClosedTo"

  const FromField = "from"
  const ToField = "to"

  const ClosedFromField = "closedFrom"
  const ClosedToField = "closedTo"

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={playerNamePlaceholder}
          />
          <InputField
            name="externalUsername"
            showEmptyFieldValueAddonAfter
            placeholder={externalUsernamePlaceholder}
          />
          <InputField
            name="externalRoundId"
            showEmptyFieldValueAddonAfter
            placeholder={externalRoundIdPlaceholder}
          />
          <InputField
            name="roundId"
            showEmptyFieldValueAddonAfter
            placeholder={roundIdPlaceholder}
          />
          <DateTimeRangeInputField
            label={<Trans zh="三方投注时间" en="3rd Party Created On" />}
            minDate={minDate}
            maxRangeDays={maxRangeDays}
            startProps={{
              name: ExternalFromField
            }}
            endProps={{
              name: ExternalToField
            }}
            otherDateTimeRangeFields={[
              ExternalClosedFromField,
              ExternalClosedToField,
              FromField,
              ToField,
              ClosedFromField,
              ClosedToField
            ]}
          />
          <DateTimeRangeInputField
            label={<Trans zh="三方结算时间" en="3rd Party Closed On" />}
            minDate={minDate}
            maxRangeDays={maxRangeDays}
            fakeTimeLabel
            startProps={{
              name: ExternalClosedFromField
            }}
            endProps={{
              name: ExternalClosedToField
            }}
            otherDateTimeRangeFields={[
              ExternalFromField,
              ExternalToField,
              FromField,
              ToField,
              ClosedFromField,
              ClosedToField
            ]}
          />
          <DateTimeRangeInputField
            label={<Trans zh="平台投注时间" en="Platform Created On" />}
            minDate={minDate}
            maxRangeDays={maxRangeDays}
            startProps={{
              name: FromField
            }}
            endProps={{
              name: ToField
            }}
            otherDateTimeRangeFields={[
              ExternalFromField,
              ExternalToField,
              ExternalClosedFromField,
              ExternalClosedToField,
              ClosedFromField,
              ClosedToField
            ]}
          />
          <DateTimeRangeInputField
            label={<Trans zh="平台结算时间" en="Platform Closed On" />}
            minDate={minDate}
            maxRangeDays={maxRangeDays}
            startProps={{
              name: ClosedFromField
            }}
            endProps={{
              name: ClosedToField
            }}
            otherDateTimeRangeFields={[
              ExternalFromField,
              ExternalToField,
              ExternalClosedFromField,
              ExternalClosedToField,
              FromField,
              ToField
            ]}
          />
          <GameRoundStatusSelect name="status" />
          <BrandIdSelect name="brandId" />
          <GameProviderSubGameProviderSelect
            gameProviderProps={{ name: "gameProviderId", required: true }}
            subGameProviderProps={{ name: "subGameProviderCode" }}
          />
          <GameTypeSelect name="gameType" />
          <CurrencySelectField name="currency" />
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
        accessor: "playerName",
        Header: <Trans zh="用户名" en="Player Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalPlayerName",
        Header: <Trans zh="三方用戶名" en="3rd Party Player Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalRoundId",
        Header: <Trans zh="三方订单ID" en="External Id" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "externalCreatedOn",
        Header: <Trans zh="三方投注时间" en="External Created On" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "externalClosedOn",
        Header: <Trans zh="三方结算时间" en="External Closed On" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "id",
        Header: <Trans zh="订单ID" en="Id" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="平台投注时间" en="Created On" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "closedOn",
        Header: <Trans zh="平台结算时间" en="Closed On" />,
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
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: GameRoundStatusLabel
      }),
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
      textColumn({
        id: "detail",
        accessor: (record) => record,
        Header: <Trans zh="详情" en="Detail" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let { id: roundId } = record
          return (
            <Set alignX="center">
              <GameRoundDialogDisclosure
                label={<Trans zh="查看" en="View" />}
                record={record}
              />
              <GameActionDialogDisclosure
                id="game-action-dialog-disclosure"
                roundId={roundId}
              />
            </Set>
          )
        }
      })
    ],
    [JSON.stringify(items)]
  )
}

const DateTimeRangeInputField = ({
  label,
  startProps,
  endProps,
  otherDateTimeRangeFields = [],
  ...props
}) => {
  let { control, getValues, setValue } = useFormContext()

  let startFieldName = startProps?.name
  let endFieldName = endProps?.name
  return (
    <FieldWrapper
      label={
        <Set>
          {label}
          <Button.Close
            size="small"
            onClick={() => {
              setValue(startFieldName, "")
              setValue(endFieldName, "")
            }}
          />
        </Set>
      }
    >
      <DateTimeRangeInput
        dateFormat={DateFormat}
        startProps={startProps}
        endProps={endProps}
        validate={(range) => {
          let allDateTimeRanges = splitEvery(2, [
            range.start,
            range.end,
            ...getValues(otherDateTimeRangeFields)
          ])

          let pass = any(([start, end]) => {
            return isValidDate(start) && isValidDate(end)
          }, allDateTimeRanges)

          return pass ? true : "one-of-date-range-required"
        }}
        {...props}
      />
    </FieldWrapper>
  )
}

//TODO: date time range validation? show disabled popup?
const ExportButton = ({ searchParams }) => {
  //TODO: auth
  return <DownloadButton />
}
