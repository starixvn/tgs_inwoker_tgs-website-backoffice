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
      <Card
        title={<Trans zh="十大玩家" en="Top 10 Players" />}
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
    let isWin = player.winLoss >= 0
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
          color={isWin ? "success" : "danger"}
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
            css={css`
              z-index: 1;
              position: sticky;
              right: 0;
            `}
          >
            <Trans zh="输赢" en="W/L" />
          </SortableHead>
        </Table.Row>
      </Table.Head>
    )
  }, [sortType, setSortType, ascending, setAscending])
}
