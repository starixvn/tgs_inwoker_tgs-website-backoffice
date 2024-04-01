import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import { Box, Button, Set, Text, useModalState, FieldStack } from "bumbag"
import FormDialog from "../../form/FormDialog"
import { useForm, useFormContext } from "react-hook-form"
import { ReviewDisclosure } from "../../dialog/Disclosure"
import { useVerifyAgentDividend } from "./client"
import { FieldValues } from "../../layout/Grid"
import { TextareaField } from "../../textarea"
import { ApproveTrans, RejectTrans } from "../../trans/Action"
import {
  useReviewWaitingPaymentTrans,
  useWaitingPaymentTrans
} from "../../trans/Payment"
import { CSNoteTrans } from "../../trans/Field"

//TODO: test case required
export const VerifyAgentDividendDialogDisclosure = ({
  record,
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

  if (!!record?.approvedOn) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  let recordId = record?.id
  return (
    <>
      <ReviewDisclosure id={id} {...dialog} {...props} />
      {dialog.visible && (
        <VerifyDialog
          recordId={recordId}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const VerifyDialog = ({
  recordId,
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
    let agentDividendRecordIds = [recordId]
    setSubmit({
      ...data,
      agentDividendRecordIds
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
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
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      onClickSubmit={(event) => {
        setValue("approve", true)
      }}
      submitText={<ApproveTrans />}
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
