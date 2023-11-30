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
import { ellipsisTextColumn, textColumn } from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import { useForm, FormProvider } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { PageContent } from "../../page/Content"
import AlertDialog from "../../dialog/Alert"
import { Trans, useTrans, getAcceptLangCulture, useLangCode } from "../../i18n"
import { useLanguageList } from "../../language/client"
import equals from "fast-deep-equal"
import { useGameOpenedRoundList, useResettleOpenedRound } from "./client"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import GameProviderSelect from "../../game/providers/GameProviderSelect"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import { subDays } from "date-fns"
import { SettleGameRoundDialogDisclosure } from "../game-open-round/SettleGameRound"
import { GameActionDialogDisclosure } from "../../game/round/GameActionDialog"
import { ActionTrans } from "../../trans/Action"

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
    externalRoundId: undefined
  })

  let culture = useLangCode()
  let { isLoading, data, error, mutate, deleteCache } = useGameOpenedRoundList({
    ...toApiParams(state),
    sortby: "createdOn",
    orderby: "descending",
    culture
  })
  let columns = useColumns({ items: data?.items, mutate })

  let DataRetentionDays = 180
  let minDate = subDays(dateRange.start, DataRetentionDays)
  return (
    <PageContent
      actionBar={
        <SearchBar
          externalRoundId={state.externalRoundId}
          gameProviderId={state.gameProviderId}
          minDate={minDate}
          maxDate={dateRange.end}
          maxRangeDays={QueryMaxRangeDays}
          isLoading={isLoading}
          search={({ start, end, ...rest }) => {
            setState({
              pageIndex: 0,
              ...rest
            })
            mutate()
          }}
        />
      }
      title={
        <Trans
          zh="游戏已结算订单 - 再次調整"
          en="Game Settled Round - Re-adjustment"
        />
      }
    >
      {state.externalRoundId && (
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
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  externalRoundId,
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
      externalRoundId,
      start,
      end,
      gameProviderId
    }
  })

  const onSubmit = (data) => search?.(data)

  let externalRoundIdPlaceholder = useTrans({
    zh: "三方订单ID",
    en: "External ID"
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="externalRoundId"
            showEmptyFieldValueAddonAfter
            placeholder={externalRoundIdPlaceholder}
            autoFocus
            required
          />
          <GameProviderSelect name="gameProviderId" required />
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
        Header: <Trans zh="投注时间" en="Created On" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "externalCreatedOn",
        Header: <Trans zh="三方投注时间" en="External Created On" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalRoundId",
        Header: <Trans zh="三方订单ID" en="External Id" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "brandCode",
        Header: <Trans zh="平台" en="Platform" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerName",
        Header: <Trans zh="玩家" en="Player" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "playerCode",
        Header: <Trans zh="玩家代码" en="Player Code" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <Trans zh="有效投注金额" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        Header: <Trans zh="结算金额" en="Settle Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "commission",
        Header: <Trans zh="佣金" en="Commission" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <Trans zh="输赢金额" en="WinLoss" />,
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
        accessor: "platformType",
        Header: <Trans zh="支持设备" en="Supporting Device" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "currencyCode",
        Header: <Trans zh="币种" en="Currency" />,
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
                  useUpdate={useResettleOpenedRound}
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
