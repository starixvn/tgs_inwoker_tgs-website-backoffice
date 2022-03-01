import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  useWatch
} from "react-hook-form"
import {
  Stack,
  Box,
  Set,
  Button,
  Text,
  Modal,
  Dialog,
  Columns,
  Heading,
  Flex,
  Group,
  List as _List,
  applyTheme
} from "bumbag"
import { useModalState } from "../../dialog/Modal"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update as UpdateMenu } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { AddDisclosure, EditDisclosure } from "../../dialog/Disclosure"
import { ConfirmButtonFooter } from "../../form/ConfirmButtonFooter"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel as Label } from "../../form/Label"
import Input from "../../input/Input"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import TransferType, {
  isDepositPlatformPayment
} from "./BrandPaymentTransferType"

const BankTransfer = "BankTransfer"
const ThirdParty = "ThirdParty"
const FPS = "FPS"

export const PaymentMethodSetting = ({
  brandId,
  paymentName,
  paymentMethodCode
}) => {
  let { getValues } = useFormContext()
  const transferType = getValues("transferType")
  let isDeposit = isDepositPlatformPayment(transferType)

  switch (paymentMethodCode) {
    case BankTransfer:
      return (
        <BankTransferSetting
          brandId={brandId}
          paymentName={paymentName}
          isDeposit={isDeposit}
        />
      )
    case ThirdParty:
      return <ThirdPartySetting brandId={brandId} paymentName={paymentName} />
    case FPS:
      return <FPSSetting brandId={brandId} />
    default:
      return null
  }
}

const FPSSetting = ({ paymentName }) => {
  return (
    <>
      <Label required>
        <Trans zh="帐号名称" en="Account Name" />
      </Label>
      <Input name="extendedData.name" required />

      <Label required>
        <Trans zh="银行卡号" en="Bank Account" />
      </Label>
      <Input name="extendedData.bankAccount" />
    </>
  )
}

const ManualCode = "Manual"
const BankTransferSetting = ({ brandId, paymentName, isDeposit }) => {
  let isManualPaymentCode = paymentName === ManualCode
  return (
    <>
      {isManualPaymentCode && (
        <>
          <Label required={isDeposit}>
            <Trans zh="帐号名称" en="Account Name" />
          </Label>
          <Input name="extendedData.name" required={isDeposit} />
        </>
      )}

      {isManualPaymentCode && (
        <>
          <Label required={isDeposit}>
            <Trans zh="银行卡号" en="Bank Account" />
          </Label>
          <Input name="extendedData.bankAccount" required={isDeposit} />
        </>
      )}

      <Label>
        <Trans zh="銀行Logo" en="Bank Logo" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.logo"
        prefix="payment"
        showLocalizationAddonAfter={false}
      />
    </>
  )
}

const ThirdPartySetting = ({ brandId, paymentName }) => {
  return (
    <>
      <Label required>
        <Trans zh="QR Code" en="QR Code" />
      </Label>
      <ImageUploadButton
        brandId={brandId}
        name="extendedData.qrCodeFileUrl"
        prefix="payment"
        showLocalizationAddonAfter={false}
      />
    </>
  )
}
