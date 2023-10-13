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
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import Modal from "../../dialog/Modal"
import {
  useAllAgentRebateDetails,
  useAllAgentRebateGameTypeDetails
} from "./client"

//TODO
export const AllAgentRebateDialogDisclosure = ({
  brandId,
  value,
  username,
  playerCode,
  settleDateTime,
  ...props
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <>
      <Disclosure use={Link} {...dialog} {...props}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <ReportDialog
          brandId={brandId}
          username={username}
          playerCode={playerCode}
          settleDateTime={settleDateTime}
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

//TODO: client side pagnation
//TODO: useTable? or useState?
const ReportDialog = ({
  brandId,
  username,
  playerCode,
  settleDateTime,
  dialog
}) => {
  let title = useTrans({
    zh: "全民代理返水细项",
    en: "All Agent Rebate Detail"
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

  //TODO
  return (
    <Modal title={title} {...dialog}>
      <FieldStack>
        <FieldValues marginLeft="1rem">
          <Trans zh="全民代理上级" en="All Agent Username" />
          <Text.Block alignY="center">{username}</Text.Block>

          <Trans zh="结算日期" en="Settlement Date" />
          <Text.Block>
            <FormattedDate value={settleDateTime} dateFormat="dd/MM/yyyy" />
          </Text.Block>
        </FieldValues>
        <Separator />
        <Table columns={columns} data={data?.items} />
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

const GameTypeTrans = {
  Sportsbook: {
    zh: "体育",
    en: "Sports"
  },
  VirtualSports: {
    zh: "虚拟体育",
    en: "Virtual Sports"
  },
  LiveDealer: {
    zh: "真人",
    en: "Live Dealer"
  },
  CardGame: {
    zh: "棋牌",
    en: "Card Game"
  },
  Lottery: {
    zh: "彩票",
    en: "Lottery"
  },
  Slot: {
    zh: "电子",
    en: "EGame"
  }
}

const ValidBetLabel = () => <Trans zh="有效投注" en="Valid Bet" />
const RebateLabel = () => <Trans zh="返水金额" en="Rebate" />

//TODO: column align
const useColumns = ({ items = [], gameTypeDetails = [], brandId }) => {
  return useMemo(() => {
    let columns = [
      {
        id: "gameType",
        Header: <Trans zh="游戏类型" en="Game Type" />,
        columns: [
          {
            id: "gameTypeActivePlayers",
            Header: <Trans zh="活跃人数" en="Active Players" />,
            columns: [
              {
                id: "gameTypeRebatePercentage",
                Header: <Trans zh="返水比例" en="Rebate P/T" />,
                columns: [
                  textColumn({
                    accessor: "username",
                    Header: <Trans zh="直属玩家" en="Players" />
                  }),
                  numberDecimalColumn({
                    accessor: "rebateSubTotal",
                    Header: <Trans zh="有效投注" en="Valid Bet" />
                  })
                ]
              }
            ]
          }
        ]
      },
      {
        id: GameType.LiveDealer,
        Header: <Trans {...GameTypeTrans.LiveDealer} />,
        columns: [
          {
            id: "liveDealerPlayers",
            Header: (
              <ActivePlayersByGameType
                gameType={GameType.LiveDealer}
                items={gameTypeDetails}
              />
            ),
            columns: [
              {
                id: "liveDealerRebatePercentage",
                Header: (
                  <RebatePercentageByGameType
                    ggameType={GameType.LiveDealer}
                    items={gameTypeDetails}
                  />
                ),
                columns: [
                  numberDecimalColumn({
                    accessor: "liveDealerValidBet",
                    Header: <ValidBetLabel />
                  }),
                  numberDecimalColumn({
                    accessor: "virtualSportsRebate",
                    Header: <RebateLabel />
                  })
                ]
              }
            ]
          }
        ]
      }
    ]
    return columns
  }, [JSON.stringify(items), JSON.stringify(gameTypeDetails)])
}
