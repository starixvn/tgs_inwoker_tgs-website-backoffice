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
import PageContent from "../../page/Content"
import dateTimeColumn from "../../table/column/dateTime"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { today } from "../../date/range"
import {
  BetAmountTrans,
  BetTimeTrans,
  GameNameTrans,
  RoundIdTrans,
  SubGameProviderTrans,
  TurnoverTrans,
  UnsettledBetTrans,
  ValidBetAmountTrans
} from "../../trans/Game"
import { PlayerWinLossTrans } from "../../trans/Player"
import { DetailTrans } from "../../trans/Action"
import { SettleAmountTrans } from "../../trans/Field"

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

  let { state, setPageIndex, setSortOrder } = useTable({
    pageSize: 5
  })
  let columns = useColumns({ items: data?.items })
  return (
    <PageContent title={<UnsettledBetTrans />} {...props}>
      <Table
        id="open-order"
        columns={columns}
        data={data?.items}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.id}
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
        Header: <RoundIdTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <BetTimeTrans />,
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
