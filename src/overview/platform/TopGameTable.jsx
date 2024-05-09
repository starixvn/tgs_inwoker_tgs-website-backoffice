import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Heading,
  Stack,
  Box,
  Text,
  Button,
  Set,
  Icon,
  Table,
  Spinner,
  Card
} from "bumbag"
import { usePlatformTopGameList } from "./client"
import { SortableHead, SortDescendingOnlyHead } from "./TopTableHead"
import { Trans, FormattedNumber, useLangCode } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { useGameProviderCodeStylePairs } from "../client"
import cloneDeep from "clone-deep"
import { CopyTextBox } from "../../text/CopyTextBox"
import {
  BetTrans,
  GameProviderGameNameTrans,
  Top10GamesTrans,
  WLTrans
} from "../../trans/Game"
import { NoSearchResultTrans } from "../../trans/Status"

const Bet = "bet"
const WinLoss = "winLoss"

const TopGameColumns = {
  Bet,
  WinLoss
}

export const TopGameTable = ({ brandId, gameProviderCodeStylePairs = [] }) => {
  let [sortType, setSortType] = useState(TopGameColumns.WinLoss)
  let [ascending, setAscending] = useState(false)

  let culture = useLangCode()
  let {
    data: items = [],
    isLoading,
    error,
    emptyData
  } = usePlatformTopGameList(brandId, { sortType, ascending, culture })

  return (
    <>
      <Card
        title={<Top10GamesTrans />}
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
        <Table hasDividers isStriped>
          <Head
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
          />
          <Table.Body>
            {isLoading && <LoadingRow />}
            {!isLoading && (
              <GameRows
                items={items}
                gameProviderCodeStylePairs={gameProviderCodeStylePairs}
              />
            )}
          </Table.Body>
        </Table>
        {error && <AlertDialog {...error} onClickClose={emptyData} />}
      </Card>
    </>
  )
}

const ColumnSize = 4
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

const GameRows = ({ items = [], gameProviderCodeStylePairs = [] }) => {
  if (items.length === 0) {
    return <EmptyRow />
  }

  return items.map((game, index) => {
    return (
      <GameRow
        key={index}
        game={game}
        index={index}
        gameProviderCodeStylePairs={gameProviderCodeStylePairs}
      />
    )
  })
}

const useGameProviderCodeBoxStyle = (gameProviderCode = "", pairs = []) => {
  //TODO: default background color: #e6e6eb or transparent?
  let defaultStyle = {
    "background-color": "transparent"
  }

  let styleIndex = 1
  let style = pairs?.find?.(([code]) => code === gameProviderCode)?.[styleIndex]
  if (!style) {
    style = cloneDeep(defaultStyle)
  }

  return css`
    ${style}
  `
}

const GameProviderCodeBox = ({ code, gameProviderCodeStylePairs = [] }) => {
  let style = useGameProviderCodeBoxStyle(code, gameProviderCodeStylePairs)
  if (!code) {
    return null
  }

  return (
    <Text
      css={css`
        border-radius: 6px;
        padding: 0.25rem 0.75rem;
        ${style}
      `}
    >
      {code}
    </Text>
  )
}

const GameRow = ({ game = {}, index, gameProviderCodeStylePairs = [] }) => {
  return useMemo(() => {
    let isPlayerWin = game.winLoss >= 0
    return (
      <Table.Row>
        <Table.Cell textAlign="left">
          <GameProviderCodeBox
            code={game.gameProviderName}
            gameProviderCodeStylePairs={gameProviderCodeStylePairs}
          />
        </Table.Cell>
        <Table.Cell textAlign="left">
          <CopyTextBox
            value={game.gameName}
            textAlign="left"
            css={css`
              white-space: nowrap;
              max-width: 18rem;
            `}
          />
        </Table.Cell>
        <Table.Cell textAlign="right">
          <FormattedNumber value={game.bet} />
        </Table.Cell>
        <Table.Cell
          textAlign="right"
          color={isPlayerWin ? "danger" : "success"}
          css={css`
            z-index: 1;
            position: sticky;
            right: 0;
          `}
        >
          <FormattedNumber value={game.winLoss} format="+0,0" />
        </Table.Cell>
      </Table.Row>
    )
  }, [JSON.stringify(game), index])
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
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell textAlign="center">
            <GameProviderGameNameTrans />
          </Table.HeadCell>
          <SortDescendingOnlyHead
            column={TopGameColumns.Bet}
            sortType={sortType}
            setSortType={setSortType}
            ascending={ascending}
            setAscending={setAscending}
            textAlign="center"
          >
            <BetTrans />
          </SortDescendingOnlyHead>
          <SortableHead
            column={TopGameColumns.WinLoss}
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
