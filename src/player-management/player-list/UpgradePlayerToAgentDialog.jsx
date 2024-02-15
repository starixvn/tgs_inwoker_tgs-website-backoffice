import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Set, Dialog, useModalState } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { useUpgradePlayerToAgent } from "./client"
import { isDev } from "../../env"
import {
  ConfirmUpgradeToAgentTrans,
  ConfirmUpgradeToMasterAgentTrans,
  UpgradeToAgentTrans,
  useUpgradeToAgentTrans
} from "../../trans/Agent"
import { ConfirmTrans } from "../../trans/Action"

//TODO: test case
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

  //TODO: rm isDev local dev code
  /*
  let devEnv = isDev()
  if (devEnv) {
    brand = {
      ...brand,
      upgradPlayerToAgent: true
    }
  }
  */

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
      <Disclosure id={id} {...dialog} {...props}>
        <UpgradeToAgentTrans />
      </Disclosure>
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

const UpgradeDialog = ({
  playerCode,
  player,
  onSubmitted,
  dialog,
  dialogId
}) => {
  let title = useUpgradeToAgentTrans()
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
      submitText={<ConfirmTrans />}
      title={title}
      id={dialogId}
    >
      <FormBody player={player} />
    </FormDialog>
  )
}

const FormBody = ({ player }) => {
  let hasMasterAgent = !!player?.agentUsername

  return (
    <Stack paddingLeft="1rem">
      {hasMasterAgent ? (
        <ConfirmUpgradeToMasterAgentTrans />
      ) : (
        <ConfirmUpgradeToAgentTrans />
      )}
    </Stack>
  )
}
