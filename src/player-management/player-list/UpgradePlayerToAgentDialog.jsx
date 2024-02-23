import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useNavigate } from "react-router-dom"
import { Code as AgentMenuCode } from "../../agent/menu"
import { Code as AgentListMenuCode } from "../../agent/agent-list/menu"
import { Stack, Box, Button, Set, Dialog, useModalState } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { useUpgradePlayerToAgent } from "./client"
import { isDev } from "../../env"
import {
  ConfirmUpgradeToAgentTrans,
  UpgradeToAgentTrans,
  useUpgradeToAgentTrans
} from "../../trans/Agent"
import { ConfirmTrans } from "../../trans/Action"

//TODO: test case
export const UpgradePlayerToAgentDialogDisclosure = ({
  brand,
  playerCode,
  player,
  onSubmitted,
  id,
  dialogId = "upgrade-player-to-agent-dialog",
  ...props
}) => {
  let dialog = useModalState()

  if (!brand?.enablePlayerAgent) {
    return null
  }

  if (player?.upgradePlayerAgentId) {
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
          brand={brand}
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
  brand,
  playerCode,
  player,
  onSubmitted,
  dialog,
  dialogId
}) => {
  let navigate = useNavigate()

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
      onSubmitted={() => {
        onSubmitted?.()

        let path = `/${AgentMenuCode}/${AgentListMenuCode}`
        let state = {
          brandId: brand.id,
          username: player.username,
          config: player.username
        }
        navigate(path, { state })
      }}
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
  // let hasMasterAgent = !!player?.agentUsername
  return (
    <Stack paddingLeft="1rem">
      <ConfirmUpgradeToAgentTrans />
    </Stack>
  )
}
