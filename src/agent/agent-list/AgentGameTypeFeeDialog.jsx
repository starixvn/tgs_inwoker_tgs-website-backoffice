import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Box,
  Text,
  Dialog,
  useModalState,
  Set,
  Icon,
  FieldStack
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import AlertDialog from "../../dialog/Alert"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { GameTypeFee } from "./menu"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import FormDialog from "../../form/FormDialog"
import { useAgentGameTypeFees, useUpdateAgentGameTypeFees } from "./client"
import clone from "clone-deep"
import { GameTypeFreeFormBody } from "./GameTypeFeeDialog"
import { AgentUsernameTrans } from "../../trans/Agent"
import Label from "../../form/Label"

export const AgentGameTypeFeeDialogDisclosure = ({
  agent,
  id,
  dialogId = "game-type-fee-dialog"
}) => {
  let dialog = useModalState()

  let auth = useIsDisplayMenuByRoute([GameTypeFee])
  if (!auth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  //TODO: trans
  return (
    <>
      <Disclosure {...dialog}>Game Type Fee</Disclosure>
      {dialog.visible && (
        <FetchDialog agent={agent} dialog={dialog} dialogId={dialogId} />
      )}
    </>
  )
}

const FetchDialog = ({ agent, dialog }) => {
  let { isLoading, data, error, deleteCache } = useAgentGameTypeFees(agent.id)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <EditDialog
      agent={agent}
      record={data}
      dialog={dialog}
      onSubmitted={deleteCache}
    />
  )
}

const EditDialog = ({ agent, record, dialog, dialogId, onSubmitted }) => {
  //TODO: trans
  let title = "Game Type Fee"

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } = useUpdateAgentGameTypeFees(
    agent.id,
    formData
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={onSubmitted}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      id={dialogId}
    >
      <GameTypeFreeFormBody
        addonBefore={
          <>
            <Box
              css={css`
                font-weight: bold;
              `}
            >
              <AgentUsernameTrans />
            </Box>
            <Box>{agent.username}</Box>
          </>
        }
      />
    </FormDialog>
  )
}
