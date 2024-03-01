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
  FieldWrapper
} from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update, WithdrawalForm } from "./menu"
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
import { useFormContext, useWatch } from "react-hook-form"
import BankType from "../../payment/BankType"
import {
  RealNameTrans,
  WithdrawFormTrans,
  useWithdrawFormTrans
} from "../../trans/User"
import { usePlayerNoteTrans } from "../../trans/Player"

export const PlayerWithdrawFormDialogDisclosure = ({
  brandId,
  player,
  playerCode,
  id,
  dialogId,
  ...props
}) => {
  let dialog = useModalState()

  let withdrawalFormAuth = useIsDisplayMenuByRoute([WithdrawalForm])
  if (!withdrawalFormAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <WithdrawFormTrans />
      </Disclosure>
      {dialog.visible && (
        <WithdrawFormDialog
          brandId={brandId}
          player={player}
          playerCode={playerCode}
          dialog={dialog}
          dialogId={dialogId}
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

const WithdrawFormDialog = ({
  brandId,
  player,
  playerCode,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useWithdrawFormTrans()

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

  let defaultBankInfo = bankInfoList?.find(({ isDefault }) => isDefault)
  return (
    <FormDialog
      id={dialogId}
      defaultValues={{
        brandId,
        player,
        playerCode,
        bankInfoId: defaultBankInfo?.id
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

const FormBody = ({ bankInfoList = [] }) => {
  let { control, getValues } = useFormContext()
  let player = getValues("player")
  return (
    <FieldStack marginLeft="1rem" marginRight="1rem">
      <FieldWrapper label={<RealNameTrans />}>
        <Box>{player.realName}</Box>
      </FieldWrapper>
      <BankInfoSelect bankInfoList={bankInfoList} required />
      <AmountInputField required />
      <NoteInputField />
    </FieldStack>
  )
}

const NoteInputField = ({ ...props }) => {
  let label = usePlayerNoteTrans()

  return <TextareaField name="note" label={label} {...props} />
}

const AmountInputField = ({ ...props }) => {
  let label = useTrans({
    zh: "提款金额",
    en: "Withdrawal Amount"
  })

  return <NumberInputField name="amount" label={label} {...props} />
}

const BankInfoIdFieldName = "bankInfoId"
const BankInfoSelect = ({
  name = BankInfoIdFieldName,
  bankInfoList = [],
  ...props
}) => {
  let label = useTrans({
    zh: "银行卡",
    en: "Bank"
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
