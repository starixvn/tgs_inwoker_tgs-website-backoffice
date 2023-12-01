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
  FieldWrapper,
  Level,
  Dialog,
  Text
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  Trans,
  useTrans,
  getAcceptLangCulture,
  useLangCode,
  FormattedNumberDecimal
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code, Export } from "./menu"
import BrandBar from "../../report/BrandBar"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import { startOfNextMinute } from "../../date/startOfNextMinute"
import { textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import {
  subDays,
  addMinutes,
  subMinutes,
  differenceInMinutes,
  startOfMinute,
  endOfDay
} from "date-fns"
import DateTimeRangeInput, {
  DateInputRange,
  DateInputRangeField
} from "../../date/DateTimeRangeInput"
import {
  GameRoundStatusLabel,
  GameRoundStatusSelect
} from "../../game/round/GameRoundStatus"
import {
  useGameRoundList,
  useSystemGameRoundList,
  useSystemGameRoundListTotal,
  systemGameRoundListDownloadUrl
} from "../../game/round/client"
import AlertDialog from "../../dialog/Alert"
import { isDev } from "../../env"
import { GameActionDialogDisclosure } from "../../game/round/GameActionDialog"
import { CurrencySelectField } from "../../currency/CurrencySelect"
import { GameTypeSelect } from "../../game/GameType"
import BrandIdSelect from "../../merchant/platforms/BrandIdSelect"
import { GameProviderSubGameProviderSelect } from "../../game/providers/GameProviderSubGameProviderSelect"
import DownloadButton from "../../button/DownloadButton"
import { isValidDate } from "../../date/isValidDate"
import { splitEvery, any } from "ramda"
import { GameRoundDialogDisclosure } from "../../game/round/GameRoundDialog"
import Disclosure from "../../dialog/Disclosure"
import { urlWith } from "../../client"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { AddGameProviderRoundDialogDisclosure } from "./AddGameProviderRoundDialog"
import { formatNumber } from "../../number/format"
import {
  BetAmountTrans,
  GameSettleAmountTrans,
  ValidBetAmountTrans
} from "../../trans/Game"

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
  return <ReportContent />
}

const last10MinRange = () => {
  let now = new Date()
  let end = addMinutes(now, 1)
  let start = subMinutes(end, 10)
  return {
    start: startOfMinute(start),
    end: startOfMinute(end)
  }
}

const useSystemGameRoundData = (searchParams) => {
  let {
    isLoading: isLoadingRoundList,
    data: roundListData,
    error: roundListError,
    mutate: mutateRoundList,
    deleteCache: deleteRoundListCache
  } = useSystemGameRoundList(searchParams)

  let {
    isLoading: isLoadingTotal,
    data: total,
    error: totalError,
    mutate: mutateTotal,
    deleteCache: deleteTotalCache
  } = useSystemGameRoundListTotal(searchParams)

  return {
    isLoading: isLoadingRoundList ?? isLoadingTotal,
    data: roundListData && total ? { ...roundListData, total } : undefined,
    error: roundListError ?? totalError,
    mutate: (_, shouldRevalidate) => {
      mutateRoundList(_, shouldRevalidate)
      mutateTotal(_, shouldRevalidate)
    },
    deleteCache: () => {
      deleteRoundListCache()
      deleteTotalCache()
    }
  }
}

const ReportContent = ({}) => {
  let dateRange = last10MinRange()
  let QueryMaxRangeDays = 31

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId: undefined,
    externalFrom: dateRange.start,
    externalTo: dateRange.end,
    externalClosedFrom: undefined,
    externalClosedTo: undefined,
    from: undefined,
    to: undefined,
    closedFrom: undefined,
    closedTo: undefined,
    username: "",
    roundId: "",
    externalRoundId: "",
    status: "",
    gameProviderId: "",
    sortBy: [{ id: "externalCreatedOn", desc: true }]
  })

  let { pageSize, username, roundId, status, gameProviderId } = state

  let culture = useLangCode()

  const toSearchParams = () => ({
    ...toApiParams(state),
    culture
  })

  let { isLoading, data, error, mutate, deleteCache } = useSystemGameRoundData(
    toSearchParams()
  )

  let DataRetentionDays = 90
  let minDate = subDays(dateRange.start, DataRetentionDays)
  let maxDate = endOfDay(new Date())

  let columns = useColumns({ items: data?.items })
  let formattedTotalCount = formatNumber(data?.totalCount) || "-"
  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            externalFrom={state.externalFrom}
            externalTo={state.externalTo}
            externalClosedFrom={state.externalClosedFrom}
            externalClosedTo={state.externalClosedTo}
            from={state.from}
            to={state.to}
            closedFrom={state.closedFrom}
            closedTo={state?.closedTo}
            username={username}
            roundId={roundId}
            externalRoundId={state?.externalRoundId}
            status={status}
            gameProviderId={gameProviderId}
            minDate={minDate}
            maxDate={maxDate}
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
          <Set>
            <DownloadReportButton
              disabled={data?.items?.length === 0}
              url={systemGameRoundListDownloadUrl(toSearchParams())}
              dateTimeRanges={[
                [state.externalFrom, state.externalTo],
                [state.externalClosedFrom, state.externalClosedTo],
                [state.from, state.to],
                [state.closedFrom, state.to]
              ]}
            />
            <AddGameProviderRoundDialogDisclosure onSubmitted={mutate} />
          </Set>
        </Level>
      }
      title={<Trans zh="订单管理" en="Order Management" />}
    >
      <FieldStack>
        <Text.Block>
          <Trans
            zh={`筆數：${formattedTotalCount}`}
            en={`Rows：${formattedTotalCount}`}
          />
        </Text.Block>
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
          getRowId={(row) => row.id}
          stickyHead
          stickyRight
          css={css`
            tr td:last-child:not([data-type="total"]) {
              background-color: #fff;
            }
          `}
        />
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

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
    en: "Player Code"
  })

  let externalRoundIdPlaceholder = useTrans({
    zh: "三方订单ID",
    en: "External ID"
  })

  let roundIdPlaceholder = useTrans({
    zh: "订单ID",
    en: "ID"
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
            name="playerCode"
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
          <FieldStack orientation="horizontal">
            <DateTimeRangeInputField
              label={<Trans zh="三方投注时间" en="External Created On" />}
              minDate={minDate}
              maxDate={maxDate}
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
              label={<Trans zh="三方结算时间" en="External Closed On" />}
              minDate={minDate}
              maxDate={maxDate}
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
          </FieldStack>
          <FieldStack orientation="horizontal">
            <DateTimeRangeInputField
              label={<Trans zh="平台投注时间" en="Created On" />}
              minDate={minDate}
              maxDate={maxDate}
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
              label={<Trans zh="平台结算时间" en="Closed On" />}
              minDate={minDate}
              maxDate={maxDate}
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
          </FieldStack>
          <GameRoundStatusSelect name="status" />
          <BrandIdSelect name="brandId" />
          <GameProviderSubGameProviderSelect
            gameProviderProps={{ name: "gameProviderId", required: true }}
            subGameProviderProps={{ name: "subGameProviderCode" }}
          />
          <GameTypeSelect name="gameType" />
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
        accessor: "playerName",
        Header: <Trans zh="用户名" en="Player Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerCode",
        Header: <Trans zh="三方用戶名" en="Player Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalRoundId",
        Header: <Trans zh="三方订单ID" en="External Id" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "externalCreatedOn",
        Header: <Trans zh="三方投注时间" en="External Created On" />
      }),
      dateTimeColumn({
        accessor: "externalClosedOn",
        Header: <Trans zh="三方结算时间" en="External Closed On" />
      }),
      textColumn({
        accessor: "id",
        Header: <Trans zh="订单ID" en="Id" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="平台投注时间" en="Created On" />
      }),
      dateTimeColumn({
        accessor: "closedOn",
        Header: <Trans zh="平台结算时间" en="Closed On" />
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
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        Header: <GameSettleAmountTrans />,
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
        TotalCell: () => null,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <GameRoundDialogDisclosure
                dialogId="game-round-dialog"
                label={<Trans zh="查看" en="View" />}
                record={record}
              />
              <GameActionDialogDisclosure
                dialogId="game-action-dialog"
                roundId={record?.id}
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
        dateFormat="yyyy/MM/dd HH:mm"
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

const DownloadReportButton = ({ url, dateTimeRanges = [], ...props }) => {
  let errorDialog = useModalState()
  let auth = useIsDisplayMenuByRoute([Export])
  if (!auth) {
    return null
  }

  let error = null
  let dateTimeRange = dateTimeRanges.find(([start, end]) => {
    return isValidDate(start) && isValidDate(end)
  })
  if (!dateTimeRange) {
    error = (
      <Trans zh={"请选择搜寻时间区间"} en="Please select a search time range" />
    )
  }
  if (dateTimeRange && isMoreThan10Mins(...dateTimeRange)) {
    error = (
      <Trans
        zh="
    搜寻时间区间不能超过10分钟"
        en="Search time range should not exceed ten minutes"
      />
    )
  }

  let exportLabel = <Trans zh="汇出" en="Export" />
  return (
    <>
      {!error && (
        <DownloadButton href={url} {...props}>
          {exportLabel}
        </DownloadButton>
      )}
      {error && <Disclosure {...errorDialog}>{exportLabel}</Disclosure>}
      {errorDialog.visible && (
        <Dialog.Modal
          type="warning"
          footer={<CloseButtonFooter alignX="right" dialog={errorDialog} />}
          {...errorDialog}
        >
          {error}
        </Dialog.Modal>
      )}
    </>
  )
}

const isMoreThan10Mins = (start, end) => {
  let TenMinutes = 10
  return differenceInMinutes(end, start) > TenMinutes
}
