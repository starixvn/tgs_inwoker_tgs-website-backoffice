import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Icon,
  Table,
  Spinner,
  Card
} from "bumbag"
import { usePlatformTopGameList } from "./client"
import { SortableHead, SortDescendingOnlyHead } from "./TopTableHead"
import { Trans, FormattedNumber } from "../../i18n"
import AlertDialog from "../../dialog/Alert"

const Bet = "bet"
const WinLoss = "winLoss"

const TopGameColumns = {
  Bet,
  WinLoss
}

//TODO: sticky head? overflow
export const TopGameTable = ({ brandId }) => {
  let [sortType, setSortType] = useState(TopGameColumns.WinLoss)
  let [ascending, setAscending] = useState(false)

  let {
    data: items = [],
    isLoading,
    error,
    deleteCache
  } = usePlatformTopGameList(brandId, { sortType, ascending })

  return (
    <>
      <Card
        title={<Trans zh="十大游戏" en="Top 10 Games" />}
        variant="bordered"
        css={css`
          padding: 0.75rem;
        `}
      >
        <Table hasDividers isStriped>
          <Head
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
          />
          <Table.Body>
            {isLoading && <LoadingRow />}
            {!isLoading && <GameRows items={items} />}
          </Table.Body>
        </Table>
        {error && <AlertDialog {...error} onClickClose={deleteCache} />}
      </Card>
    </>
  )
}

//TODO: move to?
const LoadingRow = () => {
  return (
    <Table.Row>
      <Table.Cell colSpan={4}>
        <Box alignX="center">
          <Spinner />
        </Box>
      </Table.Cell>
    </Table.Row>
  )
}

//TODO: move to?
const EmptyRow = () => {
  return (
    <Table.Row>
      <Table.Cell colSpan={4} textAlign="center">
        <Trans zh="查无资料" en="No Search Result" />
      </Table.Cell>
    </Table.Row>
  )
}

const GameRows = ({ items = [] }) => {
  if (items.length === 0) {
    return <EmptyRow />
  }

  return items.map((game, index) => {
    return <GameRow game={game} index={index} />
  })
}

const GameRow = ({ game = {}, index }) => {
  let isEven = index % 2 != 0
  return useMemo(() => {
    let isWin = game.winLoss >= 0
    return (
      <Table.Row>
        <Table.Cell textAlign="left">{game.gameProviderName}</Table.Cell>
        <Table.Cell textAlign="left">{game.gameName}</Table.Cell>
        <Table.Cell textAlign="right">
          <FormattedNumber value={game.bet} />
        </Table.Cell>
        <Table.Cell textAlign="right" color={isWin ? "success" : "danger"}>
          <FormattedNumber value={game.winLoss} format="+0,0" />
        </Table.Cell>
      </Table.Row>
    )
  }, [JSON.stringify(game), index])
}

const Head = ({ sortType, setSortType, ascending = false, setAscending }) => {
  return useMemo(() => {
    return (
      <Table.Head>
        <Table.Row>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell textAlign="center">
            <Trans zh="游戏厂商 / 游戏名称" en="Provider / Game Name" />
          </Table.HeadCell>
          <SortDescendingOnlyHead
            column={TopGameColumns.Bet}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <Trans zh="投注" en="Bet" />
          </SortDescendingOnlyHead>
          <SortableHead
            column={TopGameColumns.WinLoss}
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

/*
export const TopGameTable = ({ brandId }) => {
  //TODO: sort options?
  let { state, setState, setPageIndex, setSortOrder } = useTable({})

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  //TODO: handle api error
  let { data: items = [], isLoading, error } = usePlatformTopGameList(brandId)
  let columns = useColumns({ items })

  //TODO: sort options?
  return (
    <Table
      columns={columns}
      data={items}
      initialState={state}
      controlledState={state}
      setPageIndex={setPageIndex}
      setSortOrder={setSortOrder}
      isLoading={isLoading}
    />
  )
}

//TODO: columns, sort options here?
const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        id: "name",
        accessor: (row) => row,
        Header: <Trans zh="游戏厂商 / 游戏名称" en="Provider / Game Name" />,
        disableSortBy: true,
        Cell: ({ value: game }) => {
          let abbr = game?.providerAbbr ?? ""
          let name = game?.gameName ?? ""
          return abbr && name ? `${abbr} / ${name}` : ""
        }
      }),
      numberDecimalColumn({
        accessor: "bet",
        Header: <Trans zh="投注" en="Bet" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <Trans zh="输赢" en="W/L" />,
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
*/
