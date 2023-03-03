import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack
} from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useLangCode,
  useTrans
} from "../../i18n"
import { Table, pageCount, useTable } from "../../table"
import { textColumn } from "../../table/column/textColumn"
import { ViewDisclosure } from "../../dialog/Disclosure"
import GameRoundDialog from "../../game/round/GameRoundDialog"
import { useGameRoundList } from "../../game/round/client"
import { startOfNextDay } from "../../date/startOfNextDay"
import { subDays } from "date-fns"
import { GameRoundStatus } from "../../game/round/GameRoundStatus"
import AlertDialog from "../../dialog/Alert"
//TODO: use PageContent?
import PageContent from "../../page/Content"
import dateTimeColumn from "../../table/column/dateTime"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { today } from "../../date/range"

export const usePlayerOpenOrder = (brandId, playerCode, prefetchedData) => {
  let dateRange = today()
  let to = startOfNextDay(dateRange.end)
  let DayRange = 180
  let from = subDays(to, DayRange)
  let culture = useLangCode()
  let searchParams =
    brandId && playerCode
      ? {
          brandId,
          playerCode,
          sortby: "createdOn",
          orderby: "descending",
          from,
          to: startOfNextDay(to),
          culture,
          status: GameRoundStatus.Open
        }
      : undefined
  return useGameRoundList(
    searchParams,
    prefetchedData
      ? {
          fallbackData: prefetchedData
        }
      : null
  )
}

export const PlayerOpenOrderReport = ({
  brandId,
  playerCode,
  prefetchedData,
  ...props
}) => {
  let { isLoading, data, error } = usePlayerOpenOrder(
    brandId,
    playerCode,
    prefetchedData
  )

  let { state, setPageIndex, setSortOrder } = useTable({})
  let columns = useColumns({ items: data?.items })
  return (
    <PageContent
      title={<Trans zh="未结算订单查询" en="Unsettled Bet" />}
      {...props}
    >
      <Table
        columns={columns}
        data={data?.items}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        stickyHead
      />
      {error && <AlertDialog {...error} />}
    </PageContent>
  )
}

export const GameRoundButton = ({ record, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && <GameRoundDialog record={record} dialog={dialog} />}
    </>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      textColumn({
        accessor: "id",
        Header: <Trans zh="订单ID" en="Id" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="投注时间" en="Created On" />,
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
        accessor: (row) => row,
        Header: <Trans zh="详情" en="Detail" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Set alignX="center">
              <GameRoundButton
                id="game-round-dialog-disclosure"
                record={value}
              />
            </Set>
          )
        }
      })
    ],
    [JSON.stringify(items)]
  )
}
