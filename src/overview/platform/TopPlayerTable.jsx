import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Popover,
  Icon,
  List,
  Columns,
  useBreakpoint,
  useBreakpointValue,
  Table,
  Spinner
} from "bumbag"
import AlertDialog from "../../dialog/Alert"
import { usePlatformTopPlayerList } from "./client"
import { FormattedNumberDecimal, FormattedNumber, Trans } from "../../i18n"
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"
import { SortableHead, SortDescendingOnlyHead } from "./TopTableHead"

const Deposit = "deposit"
const Withdraw = "withdraw"
const Bet = "bet"
const Settle = "settle"
const WinLoss = "winLoss"

const TopPlayerColumns = {
  Deposit,
  Withdraw,
  Bet,
  Settle,
  WinLoss
}

//TODO: sticky head? overflow
export const TopPlayerTable = ({ brand, brandId }) => {
  let [sortType, setSortType] = useState(TopPlayerColumns.Deposit)
  let [ascending, setAscending] = useState(false)

  let {
    data: items = [],
    isLoading,
    error,
    deleteCache
  } = usePlatformTopPlayerList(brandId, { sortType, ascending })

  return (
    <>
      <Table hasDividers isStriped>
        <Head
          sortType={sortType}
          setSortType={setSortType}
          ascending={ascending}
          setAscending={setAscending}
        />
        <Table.Body>
          {isLoading && <LoadingRow />}
          {!isLoading && <PlayerRows brand={brand} items={items} />}
        </Table.Body>
      </Table>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </>
  )
}

const LoadingRow = () => {
  return (
    <Table.Row>
      <Table.Cell colSpan={5}>
        <Box alignX="center">
          <Spinner />
        </Box>
      </Table.Cell>
    </Table.Row>
  )
}

const EmptyRow = () => {
  return (
    <Table.Row>
      <Table.Cell colSpan={6} textAlign="center">
        <Trans zh="查无资料" en="No Search Result" />
      </Table.Cell>
    </Table.Row>
  )
}

const PlayerRows = ({ items = [], brand }) => {
  if (items.length === 0) {
    return <EmptyRow />
  }

  return items.map((player, index) => {
    return (
      <PlayerRow
        brand={brand}
        player={player}
        index={index}
        key={player.playerCode}
      />
    )
  })
}

//TODO: player detail dialog
//TODO: sticky last cell
const PlayerRow = ({ player = {}, index }) => {
  let isEven = index % 2 != 0
  return useMemo(() => {
    let isWin = player.winLoss >= 0
    return (
      <Table.Row>
        <Table.Cell textAlign="left">{player.playerUserName}</Table.Cell>
        <Table.Cell textAlign="right">
          <FormattedNumber value={player.deposit} />
        </Table.Cell>
        <Table.Cell textAlign="right">
          <FormattedNumber value={player.withdraw} />
        </Table.Cell>
        <Table.Cell textAlign="right">
          <FormattedNumber value={player.bet} />
        </Table.Cell>
        <Table.Cell textAlign="right">
          <FormattedNumber value={player.settle} />
        </Table.Cell>
        <Table.Cell textAlign="right" color={isWin ? "success" : "danger"}>
          <FormattedNumber value={player.winLoss} format="+0,0" />
        </Table.Cell>
      </Table.Row>
    )
  }, [JSON.stringify(player), index])
}

const Head = ({ sortType, setSortType, ascending = false, setAscending }) => {
  return useMemo(() => {
    return (
      <Table.Head>
        <Table.Row>
          <Table.HeadCell textAlign="center">
            <Trans zh="玩家用戶名" en="Player" />
          </Table.HeadCell>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Deposit}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <Trans zh="存款" en="Deposit" />
          </SortDescendingOnlyHead>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Withdraw}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <Trans zh="提款" en="Withdraw" />
          </SortDescendingOnlyHead>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Bet}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <Trans zh="投注" en="Bet" />
          </SortDescendingOnlyHead>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Settle}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <Trans zh="派彩" en="Payout" />
          </SortDescendingOnlyHead>
          <SortableHead
            column={TopPlayerColumns.WinLoss}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <Trans zh="输赢" en="W/L" />
          </SortableHead>
        </Table.Row>
      </Table.Head>
    )
  }, [sortType, setSortType, ascending, setAscending])
}
