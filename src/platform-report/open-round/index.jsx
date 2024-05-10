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
import { GameRoundStatus } from "../../game/round/GameRoundStatus"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import { useGameRoundList } from "../../game/round/client"
import { GameRoundButton } from "./button"
import AlertDialog from "../../dialog/Alert"
import { CopyTextBox } from "../../text/CopyTextBox"
import { GameActionDialogDisclosure } from "../../game/round/GameActionDialog"
import { PlayerWinLossTrans } from "../../trans/Player"
import {
  BetAmountTrans,
  BetTimeTrans,
  ExternalRoundIdTrans,
  GameNameTrans,
  GameProviderTrans,
  RoundIdTrans,
  SubGameProviderTrans,
  TurnoverTrans,
  UnsettledBetTrans,
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

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: dateRange.end,
    username: "",
    roundId: "",
    externalRoundId: "",
    gameProviderId: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageSize, from, to, username, roundId, gameProviderId } = state

  let culture = useLangCode()
  let {
    isLoading,
    data = {},
    error,
    mutate,
    emptyData
  } = useGameRoundList({
    ...toApiParams(state),
    sortby: "createdOn",
    orderby: "descending",
    from,
    to: startOfNextDay(to),
    culture,
    status: GameRoundStatus.Open
  })

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)

  let columns = useColumns({ items: data?.items })
  return (
    <PageContent
      actionBar={
        <SearchBar
          from={from}
          to={to}
          username={username}
          roundId={roundId}
          externalRoundId={state?.externalRoundId}
          gameProviderId={gameProviderId}
          minDate={minDate}
          maxDate={dateRange.end}
          maxRangeDays={QueryMaxRangeDays}
          isLoading={isLoading}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
        />
      }
      title={<UnsettledBetTrans />}
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
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </PageContent>
  )
}

const SearchBar = ({
  from,
  to,
  username,
  roundId,
  externalRoundId,
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
      username,
      roundId,
      externalRoundId,
      gameProviderId
    }
  })

  const onSubmit = (data) => search?.(data)

  let playerNamePlaceholder = useUserNameTrans()

  let roundIdPlaceholder = useRoundIdTrans()

  let externalRoundIdPlaceholder = useExternalRoundIdTrans()

  const StartField = "from"
  const EndField = "to"

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FieldStack orientation="vertical">
          <Set orientation="horizontal">
            <DateInputRangeField
              label={<BetTimeTrans />}
              showDateDropdownMenu
              minDate={minDate}
              maxDate={maxDate}
              maxRangeDays={maxRangeDays}
              fakeTimeLabel
              startProps={{
                name: StartField
              }}
              endProps={{
                name: EndField
              }}
              required
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

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
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
      textColumn({
        id: "detail",
        accessor: (row) => row,
        Header: <DetailTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let { id: roundId } = value
          return (
            <Set alignX="center">
              <GameRoundButton
                id="game-round-dialog-disclosure"
                record={value}
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
