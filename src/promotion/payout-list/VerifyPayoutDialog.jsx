import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Text, useModalState, FieldStack } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure, { ViewDisclosure } from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import FormDialog from "../../form/FormDialog"
import clone from "clone-deep"
import { FieldValues } from "../../layout/Grid"
import { PromotionTypeLabel, usePromotionGroupLabelOf } from "../PromotionType"
import { useSendPromotionPayout, useVerifyPromotionPayout } from "./client"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { UserNameTrans } from "../../trans/User"
import {
  PromotionNameTrans,
  PromotionSubtypeTrans,
  PromotionTypeTrans
} from "../../trans/Promotion"
import { CreatedTimeTrans, SentOnTrans } from "../../trans/Date"
import { useViewTrans } from "../../trans/Action"
import {
  ManualPayoutTrans,
  PayoutAmountTrans,
  useManualPayoutTrans
} from "../../trans/Payment"
import { ViewPayoutFormBody } from "./ViewPayoutDialog"

export const VerifyPayoutDialogDisclosure = ({
  brandId,
  record,
  onSubmitted,
  id,
  dialogId = "verify-payout-dialog",
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
        <VerifyPayoutDialog
          brandId={brandId}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const VerifyPayoutDialog = ({
  brandId,
  record,
  onSubmitted,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useManualPayoutTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyPromotionPayout(formData)

  const onSubmit = () => {
    let players = [record]
    setSubmit({
      players
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
