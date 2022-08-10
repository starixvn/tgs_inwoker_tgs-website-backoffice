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
import { View, Update } from "./menu"
import dateTimeColumn from "../../table/column/dateTime"
import { useApplyPlayerWithdraw, usePlayer } from "./client"
import { FormattedNumberDecimal, Trans, useLocale, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import AlertDialog from "../../dialog/Alert"
import { sortBy } from "lodash-es"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Disclosure from "../../dialog/Disclosure"
import { SelectField } from "../../select/Select"
import { usePaymentChannelList } from "../../payment/client"
import { paymentChannelabel } from "../../payment/channel/client"
import { TextareaField } from "../../textarea"
import { NumberInputField } from "../../input/NumberInput"

export const PlayerWithdrawFormDialogDisclosure = ({
  brandId,
  playerCode,
  ...props
}) => {
  let dialog = new useModalState()

  //TODO: auth for deposit or fund?
  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="提款单" en="Withdrawal Form" />
      </Disclosure>
      {dialog.visible && (
        <WithdrawFormDialog
          brandId={brandId}
          playerCode={playerCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

const usePlayerBankInfoList = (playerCode) => {
  let locale = useLocale()
  let {
    isLoading: isLoadingPlayer,
    data: playerData,
    error: playerDataError
  } = usePlayer(playerCode)

  let {
    isLoading: isLoadingPaymentChannelList,
    data: paymentChannelData,
    error: paymentChannelError
  } = usePaymentChannelList()

  let data = playerData?.banks?.map((bankCard) => {
    let paymentChannelId = bankCard.paymentChannelId
    let paymentChannel =
      paymentChannelData?.find(({ id }) => id === paymentChannelId) ?? []
    let paymentChannelCode = paymentChannel?.code
    let paymentChannelLabel =
      paymentChannelabel(locale, paymentChannelCode) ?? paymentChannelCode
    return {
      ...bankCard,
      paymentChannelCode,
      paymentChannelLabel
    }
  })
  return {
    isLoading: isLoadingPlayer || isLoadingPaymentChannelList,
    error: playerDataError || paymentChannelError,
    data
  }
}

const WithdrawFormDialog = ({ brandId, playerCode, dialog, ...props }) => {
  let title = useTrans({
    zh: "提款单",
    en: "Withdrawal Form"
  })

  let {
    isLoading: isLoadingBankInfoList,
    data: bankInfoList,
    error: bankInfoError
  } = usePlayerBankInfoList(playerCode)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useApplyPlayerWithdraw(formData)

  if (isLoadingBankInfoList) {
    return <LoadingBackdrop {...dialog} />
  }
  if (bankInfoError) {
    return <AlertDialog {...bankInfoError} onClickClose={dialog.hide} />
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
        bankInfoList={bankInfoList}
        brandId={brandId}
        playerCode={playerCode}
      />
    </FormDialog>
  )
}

const FormBody = ({ bankInfoList = [], brandId, playerCode }) => {
  return (
    <FieldStack marginLeft="1rem" marginRight="1rem">
      <BankInfoSelect bankInfoList={bankInfoList} required />
      <AmountInputField required />
      <NoteInputField />
    </FieldStack>
  )
}

const NoteInputField = ({ ...props }) => {
  let label = useTrans({
    zh: "玩家备注",
    en: "Player Note"
  })

  return <TextareaField name="note" label={label} {...props} />
}

const AmountInputField = ({ ...props }) => {
  let label = useTrans({
    zh: "提款金额",
    en: "Withdrawal Amount"
  })

  return <NumberInputField name="amount" label={label} {...props} />
}

const BankInfoSelect = ({
  name = "bankInfoId",
  bankInfoList = [],
  ...props
}) => {
  let label = useTrans({
    zh: "银行卡",
    en: "Bank"
  })

  let placeholder = useTrans({
    zh: "支付通道",
    en: "Payment Channel"
  })

  let options = bankInfoList.map((bankInfo) => {
    return {
      label: bankInfo.paymentChannelLabel,
      value: bankInfo.id
    }
  })
  return (
    <SelectField
      name={name}
      placeholder=""
      options={options}
      label={label}
      {...props}
    />
  )
}
