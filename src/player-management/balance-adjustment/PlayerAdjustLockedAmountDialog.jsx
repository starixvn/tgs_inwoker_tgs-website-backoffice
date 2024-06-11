import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, { AddDisclosure } from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { usePlayerAdjustLockedAmount } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { AdjustLockedAmount } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext, useWatch } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInputField } from "../../input/NumberInput"
import { usePlayer } from "../player-list/client"
import {
  PlayerAdjustBalanceTypeSelect,
  isTransfer,
  showIncludeInNetProfitSetting
} from "./PlayerAdjustBalanceType"
import Checkbox from "../../checkbox"
import { RemarkTrans } from "../../trans/Action"
import { UserNameTrans } from "../../trans/User"

export const PlayerAdjustLockedAmountDialogDisclosure = ({
  playerCode,
  username,
  id,
  dialogId = "player-adjust-locked-amount-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([AdjustLockedAmount])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)

  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <Trans zh="解鎖" en="Unlock" />
      </Disclosure>
      {dialog.visible && (
        <AdjustLockedAmountDialog
          playerCode={playerCode}
          username={username}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const AdjustLockedAmountDialog = ({
  playerCode,
  username,
  dialog,
  dialogId
}) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    usePlayerAdjustLockedAmount(playerCode, formData)

  let title = useTrans({
    zh: "解鎖",
    en: "Unlock"
  })

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      id={dialogId}
      defaultValues={{}}
      onSubmit={onSubmit}
      onSubmitted={reset}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
    >
      <FormBody username={username} />
    </FormDialog>
  )
}

const FormBody = ({ username }) => {
  return (
    <FieldValues margin="1rem">
      <Box alignY="center">
        <UserNameTrans />
      </Box>
      <Box alignY="center">{username}</Box>

      <Box alignY="center">
        <Trans zh="金额" en="Amount" />
      </Box>
      <NumberInputField name="lockAmount" step="0.01" required />

      <Box alignY="center">
        <RemarkTrans />
      </Box>

      <Input name="remark" />
    </FieldValues>
  )
}
