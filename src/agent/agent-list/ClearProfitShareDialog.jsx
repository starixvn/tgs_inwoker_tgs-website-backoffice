import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Set, Icon } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { FormDialog, WarningConfirmFormDialog } from "../../form/FormDialog"
import AlertDialog from "../../dialog/Alert"
import { useClearAgentProfitShare } from "./client"
import { ClearProfitSharing } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"

export const ClearProfitShareDialogDisclosure = ({
  agentId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let label = useTrans({
    zh: "清除累计结算分红",
    en: "Clear Accumulated Profit Share"
  })

  let hasAuth = useIsDisplayMenuByRoute([ClearProfitSharing])
  if (!hasAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        {label}
      </Disclosure>
      {dialog.visible && (
        <ResetDialog
          agentId={agentId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ResetDialog = ({ agentId, onSubmitted, dialog }) => {
  let confirm = useTrans({
    zh: "确定清除？",
    en: "Are you sure you want to clear？"
  })

  let submitText = useTrans({
    zh: "确定",
    en: "Yes, I'm sure"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useClearAgentProfitShare(formData)

  const onSubmit = () => {
    setSubmit(agentId)
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  return (
    <>
      <Backdrop {...dialog}>
        <FormDialog
          id="clear-agent-profit-sharing-dialog"
          onSubmit={onSubmit}
          stopPropagation={true}
          onSubmitted={() => {
            reset()
            onSubmitted?.()
          }}
          isLoading={isLoading}
          result={result}
          error={error}
          submitText={submitText}
          dialog={dialog}
          hideBackdrop={true}
          showCloseButton
        >
          <Set
            orientation="horizontal"
            alignY="center"
            margin="1rem 2rem 1em 0rem"
            minWidth="250px"
          >
            <Icon icon="warning" color="warning" />
            <Text.Block fontWeight="bold">{confirm}</Text.Block>
          </Set>
        </FormDialog>
      </Backdrop>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
