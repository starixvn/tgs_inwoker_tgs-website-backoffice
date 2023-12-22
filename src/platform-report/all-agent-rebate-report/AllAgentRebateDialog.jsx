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
  FieldStack,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumber,
  FormattedNumberDecimal,
  FormattedNumberDecimalPercentage,
  Trans,
  useTrans
} from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import Modal from "../../dialog/Modal"
import {
  useAllAgentRebateDetails,
  useAllAgentRebateGameTypeDetails
} from "./client"
import { camelCase } from "lodash-es"
import { isDev } from "../../env"
import {
  CardGame,
  GameTypeTrans,
  LiveDealer,
  Lottery,
  Sportsbook,
  ValidBetAmountTrans,
  VirtualSports
} from "../../trans/Game"
import { TotalTrans } from "../../trans/Field"

export const AllAgentRebateDialogDisclosure = ({
  brandId,
  value,
  username,
  playerCode,
  settleDateTime,
  from,
  to,
  ...props
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumber value={value} />
  }

  return (
    <>
      <Disclosure use={Link} {...dialog} {...props}>
        <FormattedNumber value={value} />
      </Disclosure>
      {dialog.visible && (
        <ReportDialog
          brandId={brandId}
          username={username}
          playerCode={playerCode}
          settleDateTime={settleDateTime}
          from={from}
          to={to}
          dialog={dialog}
        />
      )}
    </>
  )
}

const useReportData = (searchParams) => {
  let {
    isLoading: isLoadingRebateList,
    data: items,
    error: rebateListError,
    mutate: mutateRebateList,
    deleteCache: deleteRebateListCache
  } = useAllAgentRebateDetails(searchParams)
  let {
    isLoading: isLoadingGameTypeDetails,
    data: gameTypeDetails,
    error: gameTypeDetailError,
    mutate: mutateGameTypeDetails,
    deleteCache: deleteGameTypeDetailsCache
  } = useAllAgentRebateGameTypeDetails(searchParams)

  let isLoading = isLoadingRebateList || isLoadingGameTypeDetails
  let data =
    items && gameTypeDetails
      ? {
          items,
          gameTypeDetails
        }
      : undefined
  let error = rebateListError || gameTypeDetailError

  return {
    isLoading,
    data,
    error,
    mutate: (_, shouldRevalidate) => {
      mutateRebateList(_, shouldRevalidate)
      mutateGameTypeDetails(_, shouldRevalidate)
    },
    deleteCache: () => {
      deleteRebateListCache()
      deleteGameTypeDetailsCache()
    }
  }
}

const ActivePlayersByGameType = ({ gameType = "", items = [] }) => {
  let record = items.find(
    ({ allAgentGameType }) => allAgentGameType === gameType
  )

  if (!Number.isFinite(record?.activePlayerNumber)) {
    return ""
  }

  return <FormattedNumber value={record?.activePlayerNumber} />
}

const RebatePercentageByGameType = ({ gameType = "", items = [] }) => {
  let record = items.find(
    ({ allAgentGameType }) => allAgentGameType === gameType
  )
  if (!Number.isFinite(record?.rebatePercentage)) {
    return ""
  }

  return <FormattedNumberDecimalPercentage value={record?.rebatePercentage} />
}

const ReportDialog = ({
  brandId,
  username,
  playerCode,
  settleDateTime,
  from,
  to,
  dialog
}) => {
  let title = useTrans({
    zh: "全民代理返水细项",
    en: "All Agent Rebate Detail"
  })

  let { state, setPageIndex, setSortOrder } = useTable({
    pageSize: 5
  })

  let { isLoading, data, error } = useReportData({
    brandId,
    playerCode,
    settleDateTime
  })

  let columns = useColumns({
    items: data?.items,
    gameTypeDetails: data?.gameTypeDetails
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal
      title={title}
      placement="top"
      css={css`
        max-width: 95vw;
      `}
      {...dialog}
    >
      <FieldStack spacing="major-1" paddingBottom="0.5rem">
        <FieldValues marginLeft="1rem">
          <Trans zh="全民代理上级" en="All Agent Username" />
          <Box alignY="center">{username}</Box>

          <Trans zh="结算日期" en="Settlement Date" />
          <Box alignY="center">
            <FormattedDate value={settleDateTime} dateFormat="yyyy/MM/dd" />
          </Box>

          <Trans zh="全民代理上级" en="All Agent Username" />
          <Set orientation="horizontal">
            <FormattedDate value={from} dateFormat="yyyy/MM/dd" />
            <Box>-</Box>
            <FormattedDate value={to} dateFormat="yyyy/MM/dd" />
          </Set>
        </FieldValues>
        <Separator />
        <Table
          columns={columns}
          data={data?.items}
          foot={data?.items?.length > 0}
          controlledState={state}
          autoPaging={true}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          hasCellDividers
        />
      </FieldStack>
    </Modal>
  )
}

const GameType = {
  Sportsbook: "Sportsbook",
  VirtualSports: "VirtualSports",
  LiveDealer: "LiveDealer",
  CardGame: "CardGame",
  Lottery: "Lottery",
  Slot: "Slot"
}

const AllGameTypeMessages = {
  Sportsbook: Sportsbook,
  VirtualSports: VirtualSports,
  LiveDealer: LiveDealer,
  CardGame: CardGame,
  Lottery: Lottery,
  Slot: {
    zh: "电子",
    en: "EGame"
  }
}

const RebateLabel = () => <Trans zh="返水金额" en="Rebate" />

const gameTypeColumn = (gameType, gameTypeDetails = []) => {
  if (!gameType) {
    return null
  }

  let trans = AllGameTypeMessages?.[gameType]
  if (!trans) {
    return null
  }

  let gameTypeAccessor = camelCase(gameType)
  return {
    id: gameType,
    Header: <Trans {...trans} />,
    headCell: {
      textAlign: "center"
    },
    columns: [
      {
        id: `${gameTypeAccessor}-players`,
        Header: (
          <ActivePlayersByGameType
            gameType={gameType}
            items={gameTypeDetails}
          />
        ),
        headCell: {
          textAlign: "center"
        },
        columns: [
          {
            id: `${gameTypeAccessor}-rebate-percentage`,
            Header: (
              <RebatePercentageByGameType
                gameType={gameType}
                items={gameTypeDetails}
              />
            ),
            headCell: {
              textAlign: "center"
            },
            columns: [
              numberDecimalColumn({
                accessor: `${gameTypeAccessor}ValidBet`,
                sumColumn: `${gameTypeAccessor}ValidBet`,
                Header: <ValidBetAmountTrans />,
                disableSortBy: true
              }),
              numberDecimalColumn({
                accessor: `${gameTypeAccessor}Rebate`,
                sumColumn: `${gameTypeAccessor}Rebate`,
                Header: <RebateLabel />,
                disableSortBy: true
              })
            ]
          }
        ]
      }
    ]
  }
}

const useColumns = ({ items = [], gameTypeDetails = [], brandId }) => {
  return useMemo(() => {
    let columns = [
      {
        id: "gameType",
        Header: <GameTypeTrans />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          {
            id: "gameTypeActivePlayers",
            Header: <Trans zh="活跃人数" en="Active Players" />,
            headCell: {
              textAlign: "center"
            },
            columns: [
              {
                id: "gameTypeRebatePercentage",
                Header: <Trans zh="返水比例" en="Rebate P/T" />,
                headCell: {
                  textAlign: "center"
                },
                columns: [
                  textColumn({
                    accessor: "username",
                    Header: <Trans zh="直属玩家" en="Players" />,
                    Footer: () => <TotalTrans />,
                    disableSortBy: true
                  }),
                  numberDecimalColumn({
                    accessor: "rebateSubTotal",
                    sumColumn: "rebateSubTotal",
                    Header: <Trans zh="返水小计" en="Rebate Subtotal" />,
                    disableSortBy: true
                  })
                ]
              }
            ]
          }
        ]
      },
      gameTypeColumn(GameType.LiveDealer, gameTypeDetails),
      gameTypeColumn(GameType.Sportsbook, gameTypeDetails),
      gameTypeColumn(GameType.VirtualSports, gameTypeDetails),
      gameTypeColumn(GameType.Slot, gameTypeDetails),
      gameTypeColumn(GameType.CardGame, gameTypeDetails),
      gameTypeColumn(GameType.Lottery, gameTypeDetails)
    ]
    return columns
  }, [JSON.stringify(items), JSON.stringify(gameTypeDetails)])
}
