import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import { Box, Button, Set, Text, useModalState, FieldStack } from "bumbag"
import FormDialog from "../../form/FormDialog"
import { useForm, useFormContext } from "react-hook-form"
import { VerifyDisclosure } from "../../dialog/Disclosure"
import { useVerifyAgentDividend } from "./client"
import { FieldValues } from "../../layout/Grid"
import { TextareaField } from "../../textarea"
import { RejectTrans } from "../../trans/Action"
import {
  useReviewWaitingPaymentTrans,
  useWaitingPaymentTrans
} from "../../trans/Payment"
import { CSNoteTrans } from "../../trans/Field"

//TODO: agentDividendRecordId? rm hardcoded
export const VerifyAgentDividendDialogDisclosure = ({
  agentDividendRecordId = "787861eb-76cb-46a1-8a78-397d2994d57a",
  onSubmitted,
  id,
  dialogId = "verify-agent-dividend-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <VerifyDisclosure id={id} {...dialog} {...props} />
      {dialog.visible && (
        <VerifyDialog
          agentDividendRecordId={agentDividendRecordId}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const VerifyDialog = ({
  agentDividendRecordId,
  onSubmitted,
  dialog,
  dialogId,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {}
  })
  let { setValue } = formMethods

  let title = useReviewWaitingPaymentTrans()
  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyAgentDividend(formData)

  const onSubmit = (data) => {
    let agentDividendRecordIds = [agentDividendRecordId]
    setSubmit({
      ...data,
      agentDividendRecordIds
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id={dialogId}
      formMethods={formMethods}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      onClickSubmit={(event) => {
        setValue("approve", true)
      }}
      addonButtons={
        <Button
          type="submit"
          data-type="Reject"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={() => {
            setValue("approve", false)
          }}
          palette="danger"
          variant="outlined"
        >
          <RejectTrans />
        </Button>
      }
      dialog={dialog}
      title={title}
    >
      <FieldValues>
        <CSNoteTrans />
        <TextareaField name="remark" />
      </FieldValues>
    </FormDialog>
  )
}
