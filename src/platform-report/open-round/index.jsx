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
import { PlayerSettleAmountTrans } from "../../trans/Player"
import { BetAmountTrans, ValidBetAmountTrans } from "../../trans/Game"

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
    deleteCache
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
      title={<Trans zh="未结算订单查询" en="Unsettled Bet" />}
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

  const StartField = "from"
  const EndField = "to"

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FieldStack orientation="vertical">
          <Set orientation="horizontal">
            <DateInputRangeField
              label={<Trans zh="投注时间" en="Created On" />}
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
        Header: <PlayerSettleAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <Trans zh="玩家输赢金额" en="Player Win Loss" />,
        disableSortBy: true
      }),
      textColumn({
        id: "detail",
        accessor: (row) => row,
        Header: <Trans zh="详情" en="Detail" />,
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
