import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Spinner,
  Stack,
  Flex,
  Box,
  Button,
  Set,
  Blockquote,
  Dialog,
  useModalState,
  FieldStack
} from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update, DepositForm } from "./menu"
import dateTimeColumn from "../../table/column/dateTime"
import { useApplyPlayerManualDeposit, usePlayer } from "./client"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { sortBy } from "lodash-es"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { usePlayerDepositPaymentList } from "../../system/brandpayments/client"
import { PlayerPaymentMethodSelect } from "./PlayerPaymentMethodSelect"
import { PlayerPaymentChannelSelect } from "./PlayerPaymentChannelSelect"
import { NumberInputField } from "../../input/NumberInput"
import { BankType } from "./bank"
import { InputField } from "../../input/Input"
import { PlayerPromotionSelect } from "./PlayerPromotionSelect"
import { TextareaField } from "../../textarea"

export const PlayerDepositFormDialogDisclosure = ({
  brandId,
  playerCode,
  id,
  dialogId,
  ...props
}) => {
  let dialog = new useModalState()

  let depositFormAuth = useIsDisplayMenuByRoute([DepositForm])
  if (!depositFormAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <Trans zh="存款单" en="Deposit Form" />
      </Disclosure>
      {dialog.visible && (
        <DepositFormDialog
          dialogId={dialogId}
          brandId={brandId}
          playerCode={playerCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: move ManualCode to?
const ManualCode = "Manual"
const supportedPaymentList = (list = []) =>
  list.filter(({ paymentCode }) => paymentCode === ManualCode)

const DepositFormDialog = ({
  brandId,
  playerCode,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useTrans({
    zh: "存款单",
    en: "Deposit Form"
  })
  let {
    isLoading: isLoadingPaymentList,
    data: paymentList,
    error: paymentListError
  } = usePlayerDepositPaymentList({
    brandId,
    playerCode
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useApplyPlayerManualDeposit(formData?.bankType, formData)

  if (isLoadingPaymentList) {
    return <LoadingBackdrop {...dialog} />
  }
  if (paymentListError) {
    return <AlertDialog {...paymentListError} onClickClose={dialog.hide} />
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(null)
  }

  const onSubmit = (data) => {
    setSubmit(data)
  }

  return (
    <FormDialog
      id={dialogId}
      defaultValues={{
        brandId,
        playerCode
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      minWidth="40vw"
    >
      <FormBody
        paymentList={supportedPaymentList(paymentList)}
        brandId={brandId}
        playerCode={playerCode}
      />
    </FormDialog>
  )
}

const FormBody = ({ paymentList = [], brandId, playerCode }) => {
  let { control, setValue } = useFormContext()
  let PaymentMethodField = "method"

  let paymentMethod = useWatch({
    control,
    name: PaymentMethodField
  })

  let PaymentChannelField = "channel"
  let paymentChannel = useWatch({
    control,
    name: PaymentChannelField
  })
  useEffect(() => {
    setValue(PaymentChannelField, "")
  }, [paymentMethod])

  let BrandPaymentIdField = "brandPaymentId"
  let paymentId = useWatch({
    control,
    name: BrandPaymentIdField
  })

  let payment = paymentList.find(({ id }) => id === paymentId)

  let BankTypeField = "bankType"
  let bankType = useWatch({
    control,
    name: BankTypeField
  })

  useEffect(() => {
    let payment = paymentList.find((payment) => {
      return (
        payment.methodCode === paymentMethod &&
        payment.channelCode === paymentChannel
      )
    })

    let paymentId = payment?.id ?? ""
    setValue(BrandPaymentIdField, paymentId)

    let bankType = payment?.bankType ?? ""
    setValue(BankTypeField, bankType)
  }, [paymentMethod, paymentChannel])
  return (
    <FieldStack marginLeft="1rem" marginRight="1rem">
      <Set>
        <PlayerPaymentMethodSelect
          name={PaymentMethodField}
          paymentList={paymentList}
          required
        />
        <PlayerPaymentChannelSelect
          name={PaymentChannelField}
          paymentMethod={paymentMethod}
          paymentList={paymentList}
          required
        />
      </Set>
      <Info bankType={bankType} />
      {payment && (
        <>
          <AmountInputField required />
          <PlayerPromotionSelect brandId={brandId} playerCode={playerCode} />
          <NoteInputField bankType={bankType} />
        </>
      )}
    </FieldStack>
  )
}

const Info = ({ bankType }) => {
  if (!bankType) {
    return null
  }

  switch (bankType) {
    case BankType.Bank:
    case BankType.FPS:
      return <BankInfo />
    default:
      return null
  }
}

const BankInfo = ({}) => {
  let bankNameLabel = useTrans({
    zh: "银行名称",
    en: "Deposit Bank Name"
  })
  let bankAccountLabel = useTrans({
    zh: "存款账户",
    en: "Deposit Bank Account"
  })
  return (
    <>
      <InputField name="bankName" label={bankNameLabel} required />
      <InputField name="bankAccount" label={bankAccountLabel} required />
    </>
  )
}

const AmountInputField = ({ ...props }) => {
  let label = useTrans({
    zh: "存款金额",
    en: "Amount"
  })
  return <NumberInputField name="amount" label={label} {...props} />
}

const noteUsedConfig = [BankType.Bank, BankType.EWallet, BankType.Pulsa]
const NoteInputField = ({ bankType, ...props }) => {
  let label = useTrans({
    zh: "玩家备注",
    en: "Player Note"
  })

  if (!noteUsedConfig.includes(bankType)) {
    return null
  }

  return <TextareaField name="note" label={label} {...props} />
}
