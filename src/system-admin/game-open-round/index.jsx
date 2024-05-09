import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Icon, Flex } from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserRoleType,
  useUserRoleId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code, Update, ViewGameAction } from "./menu"
import { textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import { useForm, FormProvider } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { PageContent } from "../../page/Content"
import AlertDialog from "../../dialog/Alert"
import { Trans, useTrans, getAcceptLangCulture, useLangCode } from "../../i18n"
import { useLanguageList } from "../../language/client"
import equals from "fast-deep-equal"
import { useOpenGameRoundList, useCloseGameOpenRound } from "./client"
import { CopyTextBox } from "../../text/CopyTextBox"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import {
  GameRoundStatusLabel,
  GameRoundStatusSelect
} from "../../game/round/GameRoundStatus"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import { subDays } from "date-fns"
import { SettleGameRoundDialogDisclosure } from "./SettleGameRound"
import copy from "clipboard-copy"
import { GameActionDialogDisclosure } from "../../game/round/GameActionDialog"
import { ActionTrans } from "../../trans/Action"
import {
  BetAmountTrans,
  BetTimeTrans,
  ExternalBetTimeTrans,
  ExternalRoundIdTrans,
  GameNameTrans,
  GameProviderTrans,
  SubGameProviderTrans,
  TurnoverTrans,
  ValidBetAmountTrans,
  WinLossTrans,
  useExternalRoundIdTrans
} from "../../trans/Game"
import { CurrencyTrans } from "../../trans/Payment"
import { SettleAmountTrans, SupportingDeviceTrans } from "../../trans/Field"
import { PlatformTrans } from "../../trans/Platform"
import { PlayerTrans } from "../../trans/Player"

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
  let dateRange = today()
  let QueryMaxRangeDays = 31

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    from: dateRange.start,
    to: dateRange.end
  })

  let { from, to } = state

  let culture = useLangCode()
  let { isLoading, data, error, mutate, emptyData } = useOpenGameRoundList({
    ...toApiParams(state),
    sortby: "createdOn",
    orderby: "descending",
    from,
    to: startOfNextDay(to),
    culture
  })
  let columns = useColumns({ items: data?.items, mutate })

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)
  return (
    <PageContent
      actionBar={
        <SearchBar
          start={from}
          end={to}
          gameProviderId={state.gameProviderId}
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
      title={<Trans zh="游戏未结算订单" en="Game Open Round" />}
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
        stickyHead
        stickyRight
        css={css`
          tr td:last-child {
            background-color: #fff;
          }
        `}
      />
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </PageContent>
  )
}

const SearchBar = ({
  start,
  end,
  minDate,
  maxDate,
  maxRangeDays,
  gameProviderId,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end,
      gameProviderId
    }
  })

  const onSubmit = (data) => search?.(data)

  let externalRoundIdPlaceholder = useExternalRoundIdTrans()

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateInputRange
            showDateDropdownMenu
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            required
          />
          <InputField
            name="externalRoundId"
            showEmptyFieldValueAddonAfter
            placeholder={externalRoundIdPlaceholder}
          />
          <GameProviderSelect name="gameProviderId" />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let viewGameActionAuth = useIsDisplayMenuByRoute([ViewGameAction])

  return useMemo(() => {
    let columns = [
      dateTimeColumn({
        accessor: "createdOn",
        Header: <BetTimeTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "externalCreatedOn",
        Header: <ExternalBetTimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalRoundId",
        Header: <ExternalRoundIdTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "brandCode",
        Header: <PlatformTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerName",
        Header: <PlayerTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerCode",
        Header: <Trans zh="玩家代码" en="Player Code" />,
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
        accessor: "settleAmount",
        Header: <SettleAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "commission",
        Header: <Trans zh="佣金" en="Commission" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <TurnoverTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <WinLossTrans />,
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
        accessor: "platformType",
        Header: <SupportingDeviceTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "currencyCode",
        Header: <CurrencyTrans />,
        disableSortBy: true
      })
    ]

    if (hasUpdateAuth) {
      columns.push(
        textColumn({
          id: "actions",
          Header: <ActionTrans />,
          accessor: (row) => row,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            let { id: roundId } = record
            return (
              <Set alignX="center">
                <SettleGameRoundDialogDisclosure
                  id="settle-game-round-dialog-disclosure"
                  roundId={roundId}
                  record={record}
                  useUpdate={useCloseGameOpenRound}
                  onSubmitted={mutate}
                />
                <GameActionDialogDisclosure roundId={roundId} />
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}
