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
import { useSendPromotionPayout, useReviewPromotionPayout } from "./client"
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
import { PromotionType as Milestone } from "../promotion-list/reward/LeaderboardMilestoneReward"
import { ItemTrans } from "../../trans/Field"

export const ViewPayoutDialogDisclosure = ({
  brandId,
  record,
  onSubmitted,
  id,
  dialogId = "view-payout-dialog",
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
      <ViewDisclosure id={id} {...dialog} {...props} />
      {dialog.visible && (
        <ViewPayoutDialog
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

const ViewPayoutDialog = ({
  brandId,
  record,
  onSubmitted,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useViewTrans()

  return (
    <FormDialog
      id={dialogId}
      defaultValues={clone(record)}
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} />}
      title={title}
      dialog={dialog}
    >
      <ViewPayoutFormBody record={record} />
    </FormDialog>
  )
}

export const ViewPayoutFormBody = ({ record }) => {
  let promotionTypeGroup = usePromotionGroupLabelOf(record?.promotionType)

  let isSent = !!record?.sentOn
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

        <DetailBox record={record} />

        <CreatedTimeTrans />
        <Box alignY="center">
          <FormattedDateTime value={record?.createdOn} placeholder="-" />
        </Box>

        <SentOnTrans />
        <Box alignY="center">
          <FormattedDateTime
            value={record?.sentOn}
            placeholder="-"
            data-sent={isSent}
          />
        </Box>

        <PayoutAmountTrans />
        <Box alignY="center">
          <FormattedNumberDecimal value={record?.bonusAmount} />
        </Box>
      </FieldValues>
    </FieldStack>
  )
}

//TODO: confirm backend naming
const DetailBox = ({ record = {} }) => {
  let { promotionType } = record

  switch (promotionType) {
    case Milestone:
      return (
        <>
          <ItemTrans />
          <Box alignY="center">
            {Number.isFinite(record?.detail?.item)
              ? `${record?.detail.item + 1}`
              : "-"}
          </Box>
        </>
      )
    default:
      return null
  }
}
