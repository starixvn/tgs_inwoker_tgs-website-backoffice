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
  FieldStack,
  Heading,
  FieldWrapper
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
import { isDev } from "../../env"

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

const useFormData = ({ brandId, playerCode } = {}) => {
  let {
    isLoading: isLoadingPaymentList,
    data: paymentList,
    error: paymentListError
  } = usePlayerDepositPaymentList({
    brandId,
    playerCode
  })

  let {
    isLoading: isLoadingPlayer,
    data: player,
    error: playerError
  } = usePlayer(playerCode)

  paymentList = supportedPaymentList(paymentList)

  let isLoading = isLoadingPaymentList || isLoadingPlayer
  let error = paymentListError || playerError

  return {
    isLoading,
    error,
    player,
    paymentList
  }
}

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
    isLoading: isLoadingFormData,
    paymentList,
    player,
    error: formDataError
  } = useFormData({
    brandId,
    playerCode
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useApplyPlayerManualDeposit(formData?.bankType, formData)

  if (isLoadingFormData) {
    return <LoadingBackdrop {...dialog} />
  }
  if (formDataError) {
    return <AlertDialog {...formDataError} onClickClose={dialog.hide} />
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
        player,
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

const BankNameField = "bankName"
const BankAccountField = "bankAccount"

const FormBody = ({ paymentList = [], brandId, playerCode }) => {
  let { control, setValue, getValues } = useFormContext()
  let player = getValues("player")
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

    console.log(
      "payment",
      payment,
      `payment.methodCode = paymentMethod = [`,
      paymentMethod,
      `], payment.channelCode = paymentChannel = [`,
      paymentChannel,
      `]`
    )
    let bankName = payment?.extendedData?.name ?? ""
    setValue(BankNameField, bankName)

    let bankAccount = payment?.extendedData?.bankAccount ?? ""
    setValue(BankAccountField, bankAccount)
  }, [paymentMethod, paymentChannel])
  return (
    <FieldStack marginLeft="1rem" marginRight="1rem">
      <FieldWrapper label={<Trans zh="真实姓名" en="Real name" />}>
        <Box>{player.realName}</Box>
      </FieldWrapper>
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
      <ApplyInfo bankType={bankType} />
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

const ApplyInfo = ({ bankType }) => {
  if (!bankType) {
    return null
  }

  switch (bankType) {
    case BankType.Bank:
    case BankType.FPS:
      return <BankInfo />
    case BankType.EWallet:
      return <EWalletInfo />
    case BankType.Pulsa:
      return <PulsaInfo />
    default:
      return null
  }
}

const PulsaInfo = () => {
  let { getValues } = useFormContext()
  let player = getValues("player")

  //TODO: seems no need for realName input?
  return (
    <>
      <InputField
        name="phone"
        label={<Trans zh="电话号码" en="Phone Number" />}
        required
      />
      <InputField name="realName" type="hidden" value={player?.realName} />
    </>
  )
}

const EWalletInfo = () => {
  let { getValues } = useFormContext()
  let player = getValues("player")
  let phoneLabel = useTrans({
    zh: "电话号码",
    en: "Phone Number"
  })

  //TODO: seems no need for realName input?
  return (
    <>
      <InputField name="phone" label={phoneLabel} required />
      <InputField name="realName" type="hidden" value={player?.realName} />
    </>
  )
}

const useBankType = () => {
  let { control } = useFormContext()
  let BankTypeField = "bankType"
  let bankType = useWatch({
    control,
    name: BankTypeField
  })
  return bankType
}

const BankInfo = ({}) => {
  let { getValues } = useFormContext()
  let player = getValues("player")

  let bankNameLabel = useTrans({
    zh: "银行名称",
    en: "Deposit Bank Name"
  })
  let bankAccountLabel = useTrans({
    zh: "存款账户",
    en: "Deposit Bank Account"
  })

  let bankType = useBankType()
  console.log("bankType", bankType, "player.banks", player.banks)
  //TODO: get player default bank info?
  return (
    <>
      <InputField name="bankName" label={bankNameLabel} required />
      <InputField name="bankAccount" label={bankAccountLabel} required />
      <InputField name="realName" type="hidden" value={player?.realName} />
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
