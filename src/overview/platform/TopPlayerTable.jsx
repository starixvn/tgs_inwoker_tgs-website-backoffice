import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Link, useLocation } from "react-router-dom"
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
  Card,
  Table,
  Spinner
} from "bumbag"
import AlertDialog from "../../dialog/Alert"
import { usePlatformTopPlayerList } from "./client"
import { FormattedNumberDecimal, FormattedNumber, Trans } from "../../i18n"
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"
import { SortableHead, SortDescendingOnlyHead } from "./TopTableHead"
import { Code as PlayerMenuCode } from "../../player-management/menu"
import { Code as PlayerListMenuCode } from "../../player-management/player-list/menu"
import { useMeasure } from "react-use"
import { DepositTrans, WithdrawTrans } from "../../trans/Payment"
import { PlayerUsernameTrans, Top10PlayersTrans } from "../../trans/Player"
import { BetTrans, GamePayoutTrans, WLTrans } from "../../trans/Game"
import { NoSearchResultTrans } from "../../trans/Status"

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

export const TopPlayerTable = ({ brand, brandId, maxWidth }) => {
  let [sortType, setSortType] = useState(TopPlayerColumns.WinLoss)
  let [ascending, setAscending] = useState(false)

  let {
    data: items = [],
    isLoading,
    error,
    deleteCache
  } = usePlatformTopPlayerList(brandId, { sortType, ascending })

  return (
    <>
      <Card
        title={<Top10PlayersTrans />}
        variant="bordered"
        css={css`
          padding: 0.75rem;
          & .bb-Table {
            max-width: 100%;
            overflow: auto;

            tr:nth-child(even) td,
            thead tr th {
              background-color: var(--bb-palette-white600, #000000);
            }

            tr:nth-child(odd) td {
              background-color: white;
            }
          }
        `}
      >
        <Table id="top-player" hasDividers isStriped>
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
      </Card>
    </>
  )
}

const ColumnSize = 6
const LoadingRow = () => {
  return (
    <Table.Row>
      <Table.Cell colSpan={ColumnSize}>
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
      <Table.Cell colSpan={ColumnSize} textAlign="center">
        <NoSearchResultTrans />
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

const stickyLeft = css`
  z-index: 1;
  position: sticky;
  left: 0;
`

const playerNameColumnCss = css`
  max-width: 9.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PlayerRow = ({ player = {}, brand, index }) => {
  return useMemo(() => {
    let isPlayerWin = player.winLoss >= 0
    return (
      <Table.Row>
        <Table.Cell textAlign="left" css={playerNameColumnCss}>
          <Link
            to={`/${PlayerMenuCode}/${PlayerListMenuCode}`}
            state={{
              brandId: brand.id,
              playerUsername: player.playerUsername
            }}
            css={css`
              color: #574feb;
            `}
            title={player.playerUsername}
          >
            {player.playerUsername}
          </Link>
        </Table.Cell>
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
        <Table.Cell
          textAlign="right"
          color={isPlayerWin ? "danger" : "success"}
          css={css`
            position: sticky;
            right: 0;
          `}
        >
          <FormattedNumber value={player.winLoss} format="+0,0" />
        </Table.Cell>
      </Table.Row>
    )
  }, [JSON.stringify(player), index])
}

const Head = ({ sortType, setSortType, ascending = false, setAscending }) => {
  return useMemo(() => {
    return (
      <Table.Head
        css={css`
          white-space: nowrap;
        `}
      >
        <Table.Row>
          <Table.HeadCell textAlign="center">
            <PlayerUsernameTrans />
          </Table.HeadCell>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Deposit}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <DepositTrans />
          </SortDescendingOnlyHead>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Withdraw}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <WithdrawTrans />
          </SortDescendingOnlyHead>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Bet}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <BetTrans />
          </SortDescendingOnlyHead>
          <SortDescendingOnlyHead
            column={TopPlayerColumns.Settle}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <GamePayoutTrans />
          </SortDescendingOnlyHead>
          <SortableHead
            column={TopPlayerColumns.WinLoss}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
            css={css`
              z-index: 1;
              position: sticky;
              right: 0;
            `}
          >
            <WLTrans />
          </SortableHead>
        </Table.Row>
      </Table.Head>
    )
  }, [sortType, setSortType, ascending, setAscending])
}
