import React, { useState, useEffect, useMemo } from "react"
import {
  Spinner,
  useModalState,
  FieldStack,
  Box,
  Text,
  Dialog,
  Modal,
  Heading,
  Link,
  Flex,
  Set,
  Columns
} from "bumbag"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  getTrans,
  Trans,
  useLocale,
  useTrans
} from "../../i18n"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import {
  Disclosure,
  VerifyDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { useFundWithdrawForm } from "./client"
import Separator from "../../layout/Separator"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import {
  FundWithdrawStatusLabel,
  isFundApproved,
  isFundUnderReview
} from "./FundWithdrawStatus"
import {
  PaymentChannelLabel,
  PaymentChannelSelect
} from "../../payment/channel/PaymentChannel"
import { TextareaField } from "../../textarea"
import { BrandPaymentSelect } from "../../system/brandpayments/BrandPayment"
import BrandPaymentTransferType from "../../system/brandpayments/BrandPaymentTransferType"
import clone from "clone-deep"
import { useFormContext, useWatch } from "react-hook-form"
import { useBrandPayment } from "../../system/brandpayments/client"
import { parseJSON } from "../../text/json"
import Input from "../../input/Input"
import BrandPaymentStatus from "../../system/brandpayments/BrandPaymentStatus"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import Big from "big.js"
import { PhoneTrans, RealNameTrans, UserNameTrans } from "../../trans/User"
import { GmsIdTrans, ThirdPartyIdTrans } from "../../trans/Platform"
import { ApplicationTimeTrans } from "../../trans/Date"
import { PaidTimeTrans, WithdrawAmountTrans } from "../../trans/Payment"
import { StatusTrans } from "../../trans/Status"

export const ViewFundWithdrawDisclosure = ({
  brandId,
  formId,
  onVisibleChange,
  ...props
}) => {
  let dialog = useModalState()

  useEffect(() => {
    onVisibleChange?.(dialog.visible)
  }, [dialog.visible])

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <ViewFundWithdrawDialog
          brandId={brandId}
          formId={formId}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ViewFundWithdrawDialog = ({ brandId, formId, dialog, ...props }) => {
  let title = useTrans({
    zh: "查看提款",
    en: "View Withdraw"
  })

  let { isLoading, data, error, mutate, deleteCache } = useFundWithdrawForm(
    brandId,
    formId
  )

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} />
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  return (
    <FormDialog
      id="view-withdraw-dialog"
      title={title}
      defaultValues={clone(data)}
      showCloseButton
      showActionButtons={false}
      hideOnClickOutside={false}
      onClickClose={reset}
      {...dialog}
      maxWidth="80vw"
    >
      <FormBody brandId={brandId} record={data} readonly />
    </FormDialog>
  )
}

export const FormBody = ({ brandId, record, readonly }) => {
  let disabled = readonly
  return (
    <>
      <FieldStack>
        <FieldValues marginLeft="1.5rem">
          <NormalLabel>
            <UserNameTrans />
          </NormalLabel>
          <Box alignY="center">{record?.userName}</Box>

          <RealNameBox record={record} />

          <NormalLabel>
            <GmsIdTrans />
          </NormalLabel>
          <Box alignY="center">{record?.orderNo}</Box>

          <NormalLabel>
            <Trans zh="订单号" en="Id" />
          </NormalLabel>
          <Box alignY="center">{record?.id}</Box>

          <NormalLabel>
            <ThirdPartyIdTrans />
          </NormalLabel>
          <Box alignY="center">{record?.thirdPartyOrderNo}</Box>

          <NormalLabel>
            <Trans zh="提款类型 " en="Payment Channel" />
          </NormalLabel>
          <Box alignY="center">
            <PaymentChannelLabel value={record?.bankInfo?.paymentChannelId} />
          </Box>

          <NormalLabel>
            <WithdrawAmountTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedNumberDecimal value={record?.amount} />
          </Box>

          <NormalLabel>
            <ApplicationTimeTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={record?.createdOn} />
          </Box>

          <NormalLabel>
            <Trans zh="审核时间" en="Review Time" />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={record?.reviewedOn} placeholder="-" />
          </Box>

          <NormalLabel>
            <PaidTimeTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={record?.paidOn} placeholder="-" />
          </Box>

          <NormalLabel>
            <StatusTrans />
          </NormalLabel>
          <Box alignY="center">
            <FundWithdrawStatusLabel value={record?.status} />
          </Box>
        </FieldValues>
        <Separator />
        <Columns orientation="horizontal" alignY="top">
          <Columns.Column>
            <PayerInfo
              brandId={brandId}
              record={record}
              disabled={disabled}
              readonly={readonly}
            />
          </Columns.Column>
          <Columns.Column>
            <PayeeInfo record={record} />
          </Columns.Column>
        </Columns>

        <Separator />

        <TextareaField
          name="remark"
          label={<Trans zh="客服备註" en="CS Note" />}
          disabled={disabled}
        />

        <TextareaField
          name="playerRemark"
          label={<Trans zh="玩家备註" en="Player Note" />}
          disabled={disabled}
        />
      </FieldStack>
      <Input type="hidden" value={brandId} />
    </>
  )
}

const RealNameBox = ({ record = {} }) => {
  let realName = record?.realName
  if (!realName) {
    return null
  }
  return (
    <>
      <NormalLabel>
        <RealNameTrans />
      </NormalLabel>
      <Box alignY="center">{realName}</Box>
    </>
  )
}

const PayerInfo = ({ brandId, record, disabled }) => {
  let { watch, control } = useFormContext()

  let BrandPaymentIdField = "brandPaymentId"
  let brandPaymentId = watch(BrandPaymentIdField)

  let underReview = isFundUnderReview(record?.status)
  let isApproved = isFundApproved(record?.status)
  let underReviewOrApproved = underReview || isApproved

  let { isLoading, data: brandPayment, error } = useBrandPayment(brandPaymentId)

  let detail = parseJSON(brandPayment?.extendedData)
  let rate = detail?.rate
  let hasRate = Number.isFinite(rate)
  let amount =
    hasRate && Number.isFinite(record?.amount)
      ? new Big(record?.amount).times(new Big(rate)).toNumber()
      : null

  let bankType = record?.bankInfo?.bankType?.toUpperCase?.() ?? ""
  return (
    <>
      <Heading use="h6">
        <Trans zh="出款信息" en="Payout Info" />
      </Heading>
      <FieldValues marginLeft="1.5rem">
        <NormalLabel>
          <Trans zh="出款渠道" en="Withdrawal Payment" />
        </NormalLabel>
        <Box alignY="center">
          <BrandPaymentSelect
            name={BrandPaymentIdField}
            brandId={brandId}
            transferType={BrandPaymentTransferType.Withdrawal}
            paymentStatus={BrandPaymentStatus.Enabled}
            bankType={record?.bankInfo?.bankType}
            paymentChannelId={record?.bankInfo?.paymentChannelId}
            required
            disabled={disabled}
          />
        </Box>
        {underReviewOrApproved && hasRate && (
          <>
            <NormalLabel>
              <Trans zh="匯率" en="Exchange rate" />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimal
                value={rate}
                digits={4}
                format="0,0.00[00]"
              />
            </Box>
          </>
        )}

        {underReviewOrApproved && Number.isFinite(amount) && (
          <>
            <NormalLabel>
              <Trans zh={bankType} en={bankType} />
            </NormalLabel>
            <Box alignY="center">
              <FormattedNumberDecimal value={amount} />
            </Box>
          </>
        )}

        {isApproved && brandPayment && (
          <>
            <NormalLabel>
              <Trans zh="出款通道" en="Channel" />
            </NormalLabel>
            <Box alignY="center">
              <PaymentChannelLabel value={brandPayment?.paymentChannelId} />
            </Box>

            {detail?.name && (
              <>
                <NormalLabel>
                  <Trans zh="帐号名称" en="Account Name" />
                </NormalLabel>
                <Box alignY="center">{detail?.name}</Box>
              </>
            )}

            {detail?.bankAccount && (
              <>
                <NormalLabel>
                  <Trans zh="银行帐号" en="Account" />
                </NormalLabel>
                <Box alignY="center">{detail?.bankAccount}</Box>
              </>
            )}
          </>
        )}
      </FieldValues>
    </>
  )
}

const PayeeInfo = ({ record }) => {
  let hasBankInfo = !!record?.bankInfo
  if (!hasBankInfo) {
    return null
  }

  let hasBankName = !!record?.bankInfo?.detail?.bankName
  let hasBankBranch = !!record?.bankInfo?.detail?.bankBranch

  let hasAccountName = !!record?.bankInfo?.detail?.name
  let hasBankAccount = !!record?.bankInfo?.detail?.bankAccount
  let hasMemo = !!record?.bankInfo?.detail?.memo
  let hasIFSCcode = !!record?.bankInfo?.detail?.IFSCcode
  let isBank = hasAccountName && hasBankAccount

  let hasAddress = !!record?.bankInfo?.detail?.address
  let isCrypto = hasAddress

  let hasUsername = !!record?.bankInfo?.detail?.username
  let hasPhone = !!record?.bankInfo?.detail?.phone

  let hasNote = !!record?.note
  return (
    <>
      <Heading use="h6">
        <Trans zh="收款人信息" en="Payee Info" />
      </Heading>
      <FieldValues marginLeft="1.5rem">
        <NormalLabel>
          <Trans zh="收款通道" en="Channel" />
        </NormalLabel>
        <Box alignY="center">
          <PaymentChannelLabel value={record?.bankInfo?.paymentChannelId} />
        </Box>

        {hasBankName && (
          <>
            <NormalLabel>
              <Trans zh="银行" en="Bank" />
            </NormalLabel>
            <Box alignY="center">{record?.bankInfo?.detail?.bankName}</Box>
          </>
        )}

        {hasBankBranch && (
          <>
            <NormalLabel>
              <Trans zh="银行分行" en="Bank Branch" />
            </NormalLabel>
            <Box alignY="center">{record?.bankInfo?.detail?.bankBranch}</Box>
          </>
        )}

        {hasAccountName && (
          <>
            <NormalLabel>
              <Trans zh="收款账户名" en="Account Name" />
            </NormalLabel>
            <Box alignY="center">{record?.bankInfo?.detail?.name}</Box>
          </>
        )}

        {hasBankAccount && (
          <>
            <NormalLabel>
              <Trans zh="银行卡帐号" en="Account" />
            </NormalLabel>
            <Box alignY="center">{record?.bankInfo?.detail?.bankAccount}</Box>
          </>
        )}

        {hasAddress && (
          <>
            <>
              <NormalLabel>
                <Trans zh="钱包地址" en="Wallet address" />
              </NormalLabel>
              <Box alignY="center">{record?.bankInfo?.detail?.address}</Box>
            </>
          </>
        )}

        {hasUsername && (
          <>
            <>
              <NormalLabel>
                <Trans zh="名字" en="Name" />
              </NormalLabel>
              <Box alignY="center">{record?.bankInfo?.detail?.username}</Box>
            </>
          </>
        )}

        {hasPhone && (
          <>
            <>
              <NormalLabel>
                <PhoneTrans />
              </NormalLabel>
              <Box alignY="center">{record?.bankInfo?.detail?.phone}</Box>
            </>
          </>
        )}

        {hasMemo && (
          <>
            <NormalLabel>
              <Trans zh="附言" en="Memo" />
            </NormalLabel>
            <Box alignY="center">{record?.bankInfo?.detail?.memo}</Box>
          </>
        )}

        {hasIFSCcode && (
          <>
            <NormalLabel>IFSC code</NormalLabel>
            <Box alignY="center">{record?.bankInfo?.detail?.IFSCcode}</Box>
          </>
        )}

        {hasNote && (
          <>
            <NormalLabel>
              <Trans zh="玩家备註" en="Player Note" />
            </NormalLabel>
            <Box alignY="center">{record?.note}</Box>
          </>
        )}
      </FieldValues>
    </>
  )
}
