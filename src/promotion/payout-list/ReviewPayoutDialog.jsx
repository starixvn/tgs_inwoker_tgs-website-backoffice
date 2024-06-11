import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Text, useModalState, FieldStack } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import Disclosure, { ViewDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import clone from "clone-deep"
import { useReviewPromotionPayout } from "./client"
import {
  ManualPayoutTrans,
  PayoutAmountTrans,
  useManualPayoutTrans
} from "../../trans/Payment"
import { ViewPayoutFormBody } from "./ViewPayoutDialog"

export const ReviewPayoutDialogDisclosure = ({
  record,
  onSubmitted,
  id,
  dialogId = "review-promotion-payout-dialog",
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
      <Disclosure id={id} {...dialog} {...props}>
        <ManualPayoutTrans />
      </Disclosure>
      {dialog.visible && (
        <ReviewPayoutDialog
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const ReviewPayoutDialog = ({
  record,
  onSubmitted,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useManualPayoutTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } =
    useReviewPromotionPayout(formData)

  const onSubmit = () => {
    let players = [record]
    setSubmit({
      players
    })
  }

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      id={dialogId}
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      title={title}
      dialog={dialog}
    >
      <ViewPayoutFormBody record={record} />
    </FormDialog>
  )
}
