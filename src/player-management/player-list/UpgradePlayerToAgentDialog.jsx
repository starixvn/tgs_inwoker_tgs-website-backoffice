import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Set, Dialog, useModalState } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { useUpgradePlayerToAgent } from "./client"

export const UpgradePlayerToAgentDialogDisclosure = ({
  brandId,
  brand,
  playerCode,
  player,
  onSubmitted,
  id,
  dialogId = "upgrade-player-to-agent-dialog",
  ...props
}) => {
  let dialog = useModalState()

  //TODO: confirm brand field name
  if (!brand?.upgradPlayerToAgent) {
    return null
  }

  //TODO: configm player account type field name
  if (player?.accountType) {
    //already upgrade to agent
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}></Disclosure>
      {dialog.visible && (
        <UpgradeDialog
          brandId={brandId}
          playerCode={playerCode}
          player={player}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const UpgradeDialog = ({ playerCode, onSubmitted, dialog, dialogId }) => {
  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } =
    useUpgradePlayerToAgent(formData)

  const onSubmit = () => {
    setSubmit(playerCode)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      id={dialogId}
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = () => {
  return "TODO:"
}
