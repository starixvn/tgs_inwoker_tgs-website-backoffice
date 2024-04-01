import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Set, Icon } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { FormDialog, WarningConfirmFormDialog } from "../../form/FormDialog"
import AlertDialog from "../../dialog/Alert"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import {
  NegativeDividendTrans,
  useNegativeDividendTrans
} from "../../trans/Agent"
import { useAgent, useUpdateAgentNegativeDividend } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { LiableOrNotSwitch } from "../../switch/LiableOrNotSwitch"
import { isUndefined } from "lodash-es"

export const NegativeDividendDialogDisclosure = ({
  agentId,
  id,
  dialogId = "negative-dividend-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  let readOnly = !editable

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <NegativeDividendTrans />
      </Disclosure>
      {dialog.visible && (
        <SettingDialog
          agentId={agentId}
          readOnly={readOnly}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const SettingDialog = ({ agentId, readOnly, dialog, dialogId, ...props }) => {
  let title = useNegativeDividendTrans()

  let {
    isLoading: isLoadingAgent,
    data: agent,
    error: agentError,
    deleteCache: deleteAgentCache
  } = useAgent(agentId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } =
    useUpdateAgentNegativeDividend(agentId, formData)

  if (isLoadingAgent) {
    return <LoadingBackdrop {...dialog} />
  }

  if (agentError) {
    return <AlertDialog {...agentError} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{
        negativeAgentDividendCarryForward:
          agent.negativeAgentDividendCarryForward
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      id={dialogId}
      onSubmitted={() => {
        deleteAgentCache()
        reset()
      }}
      dialog={dialog}
      title={title}
      showActionButtons={readOnly ? false : true}
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ readOnly }) => {
  return (
    <Set orientation="horizontal">
      <NegativeDividendTrans />
      <LiableOrNotSwitch
        name="negativeAgentDividendCarryForward"
        disabled={readOnly}
      />
    </Set>
  )
}
