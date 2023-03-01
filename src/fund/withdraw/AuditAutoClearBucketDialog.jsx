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
import { Table, pageCount, toApiParams } from "../../table"
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
import { usePlayerAutoClearBucketList } from "../../player-management/player-list/client"
import {
  PlayerOpenOrderReport,
  usePlayerOpenOrder
} from "./PlayerOpenOrderReport"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Modal from "../../dialog/Modal"
import { PlayerAutoClearBucketReport } from "./PlayerAutoClearBucketReport"

export const AuditAutoClearBucketDialogDisclosure = ({
  brandId,
  playerCode,
  id,
  dialogId = "audit-auto-clear-bucket-dialog",
  ...props
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <Trans zh="流水確認" en="Wagering Check" />
      </Disclosure>
      {dialog.visible && (
        <AuditAutoClearBucketDialog
          brandId={brandId}
          playerCode={playerCode}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const AuditAutoClearBucketDialog = ({
  brandId,
  playerCode,
  dialog,
  dialogId
}) => {
  let { isLoading, playerOpenOrderData, playerAutoClearBucketData, error } =
    useAuditData(brandId, playerCode)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={" "} {...dialog}>
      <Body
        brandId={brandId}
        playerCode={playerCode}
        playerOpenOrderData={playerOpenOrderData}
        playerAutoClearBucketData={playerAutoClearBucketData}
      />
    </Modal>
  )
}

const useAuditData = (brandId, playerCode) => {
  let {
    isLoading: isLoadingPlayerOpenOrder,
    data: playerOpenOrderData,
    error: playerOpenOrderError
  } = usePlayerOpenOrder(brandId, playerCode)

  let {
    isLoading: isLoadingPlayerAutoClearBucket,
    data: playerAutoClearBucketData,
    error: playerAutoClearBucketError
  } = usePlayerAutoClearBucketList(playerCode)

  return {
    isLoading: isLoadingPlayerOpenOrder || isLoadingPlayerAutoClearBucket,
    playerOpenOrderData,
    playerAutoClearBucketData,
    error: playerOpenOrderError || playerAutoClearBucketError
  }
}

const Body = ({
  brandId,
  playerCode,
  playerOpenOrderData,
  playerAutoClearBucketData
}) => {
  return (
    <Box>
      <PlayerOpenOrderReport
        brandId={brandId}
        playerCode={playerCode}
        prefetchedData={playerOpenOrderData}
      />
      <PlayerAutoClearBucketReport
        playerCode={playerCode}
        prefetchedData={playerAutoClearBucketData}
      />
    </Box>
  )
}
