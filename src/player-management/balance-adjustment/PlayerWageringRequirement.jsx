import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Dialog, useModalState, FieldStack, FieldWrapper, Box } from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { usePlayer, usePlayerBucketAmount } from "../player-list/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { View } from "./menu"
import { FieldValues } from "../../layout/Grid"
import { BalanceTrans, UserNameTrans, useBalanceTrans } from "../../trans/User"

export const PlayerWageringRequirementDialogDisclosure = ({
  brandId,
  username,
  playerCode,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <BalanceTrans />
      </Disclosure>
      {dialog.visible && (
        <WageringRequirementDialog
          brandId={brandId}
          playerCode={playerCode}
          username={username}
          dialog={dialog}
        />
      )}
    </>
  )
}

const WageringRequirementDialog = ({
  brandId,
  username,
  playerCode,
  dialog,
  ...props
}) => {
  let title = useBalanceTrans()

  let {
    isLoading: isLoadingPlayer,
    data: player,
    error: playerError
  } = usePlayer(playerCode)
  let {
    data: wageringRequirement,
    isLoading: isLoadingWageringRequirement,
    error: wageringRequirementError
  } = usePlayerBucketAmount(playerCode)

  let isLoading = isLoadingPlayer || isLoadingWageringRequirement
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  let error = playerError || wageringRequirementError
  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      id="wagering-requirement-dialog"
      {...dialog}
      showActionButtons={false}
      showCloseButton
      hideOnClickOutside={false}
      title={title}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      maxWidth="80vw"
    >
      <FieldValues marginLeft="1rem">
        <UserNameTrans />
        <Box>{username}</Box>

        <BalanceTrans />
        <Box>
          <FormattedNumberDecimal value={player?.balance} />
        </Box>

        <Trans zh="流水" en="Unfinished Wagering" />
        <Box>
          <FormattedNumberDecimal value={wageringRequirement} />
        </Box>
      </FieldValues>
    </Dialog.Modal>
  )
}
