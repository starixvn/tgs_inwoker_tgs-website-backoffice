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
import { useSendPromotionPayout } from "./client"
import {
  CloseButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import { UserNameTrans } from "../../trans/User"
import {
  PromotionNameTrans,
  PromotionSubtypeTrans,
  PromotionTypeTrans
} from "../../trans/Promotion"
import { CreatedTimeTrans, SentOnTrans } from "../../trans/Date"
import { useViewTrans } from "../../trans/Action"

export const PromotionManualPayoutDisclosure = ({
  brandId,
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="手动派发" en="Manual Payout" />
      </Disclosure>
      {dialog.visible && (
        <ManualPayoutDialog
          brandId={brandId}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

export const ViewPromotionManualPayoutDisclosure = ({
  brandId,
  record,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <ViewPayoutDialog brandId={brandId} record={record} dialog={dialog} />
      )}
    </>
  )
}

const ManualPayoutDialog = ({ brandId, record, onSubmitted, dialog }) => {
  let title = useTrans({
    zh: "手动派发",
    en: "Manual Payout"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useSendPromotionPayout(formData)

  const onSubmit = () => {
    let players = [record]
    setSubmit({
      players
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="payout-promotion-dialog"
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      showActionButtons={false}
      footer={
        <ConfirmCancelFooter
          confirmText={<Trans zh="手动派发" en="Manual Payout" />}
          dialog={dialog}
        />
      }
      title={title}
      dialog={dialog}
    >
      <FormBody record={record} />
    </FormDialog>
  )
}

const ViewPayoutDialog = ({ brandId, record, dialog }) => {
  let title = useViewTrans()

  return (
    <FormDialog
      defaultValues={clone(record)}
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} />}
      title={title}
      dialog={dialog}
    >
      <FormBody record={record} />
    </FormDialog>
  )
}

const FormBody = ({ record }) => {
  let promotionTypeGroup = usePromotionGroupLabelOf(record?.promotionType)
  return (
    <FieldStack marginLeft="1rem">
      <FieldValues>
        <UserNameTrans />
        <Box alignY="center">{record?.username}</Box>

        <PromotionNameTrans />
        <Box alignY="center">{record?.promotionName}</Box>

        <PromotionTypeTrans />
        <Box alignY="center">{promotionTypeGroup}</Box>

        <PromotionSubtypeTrans />
        <Box alignY="center">
          <PromotionTypeLabel value={record?.promotionType} />
        </Box>

        <CreatedTimeTrans />
        <Box alignY="center">
          <FormattedDateTime value={record?.createdOn} placeholder="-" />
        </Box>

        <SentOnTrans />
        <Box alignY="center">
          <FormattedDateTime value={record?.sentOn} placeholder="-" />
        </Box>

        <Trans zh="派发金额" en="Payout Amount" />
        <Box alignY="center">
          <FormattedNumberDecimal value={record?.bonusAmount} />
        </Box>
      </FieldValues>
    </FieldStack>
  )
}
