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
import { usePlayer } from "../player-list/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { View } from "./menu"
import { FieldValues } from "../../layout/Grid"

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
        <Trans zh="流水金额" en="Turnover Requirement Amount" />
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
  let title = useTrans({
    zh: "流水金额",
    en: "Turnover Requirement Amount"
  })

  let { isLoading, data: player, error } = usePlayer(playerCode)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.close} />
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
    >
      <FieldValues marginLeft="1rem">
        <Trans zh="用户名" en="Username" />
        <Box>{username}</Box>

        <Trans zh="流水金额" en="Turnover Requirement Amount" />
        <Box>
          <FormattedNumberDecimal value={player?.wageringRequirement} />
        </Box>
      </FieldValues>
    </Dialog.Modal>
  )
}
