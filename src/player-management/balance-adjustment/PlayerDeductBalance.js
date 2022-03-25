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
import {
  CloseButtonFooter,
  ConfirmButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { usePlayerAdjustReduceBalance } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { Update } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext, useWatch } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInputField } from "../../input/NumberInput"
import { usePlayer } from "../player-list/client"
import {
  PlayerAdjustBalanceTypeSelect,
  isTransfer,
  isCompanyOrAgent
} from "./PlayerAdjustBalanceType"
import Checkbox from "../../checkbox"

export const PlayerDeductBalanceDisclosure = ({
  brandId,
  username,
  playerCode,
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
        <Trans zh="扣钱" en="Deduct Balance" />
      </Disclosure>
      {dialog.visible && (
        <DeductDialog
          brandId={brandId}
          username={username}
          playerCode={playerCode}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const DeductDialog = ({
  brandId,
  username,
  playerCode,
  onSubmitted,
  dialog
}) => {
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    usePlayerAdjustReduceBalance(playerCode, formData)

  let title = useTrans({
    zh: "余额扣分",
    en: "Deduct Balance"
  })

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="deduct-balance-dialog"
      defaultValues={{}}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      showActionButtons={false}
      footer={
        <ConfirmCancelFooter
          isLoading={isLoading}
          disabled={isLoading}
          dialog={dialog}
        />
      }
    >
      <FormBody brandId={brandId} username={username} playerCode={playerCode} />
    </FormDialog>
  )
}

const FormBody = ({ brandId, username, playerCode }) => {
  let { watch, control } = useFormContext()
  let { data: player } = usePlayer(playerCode)

  let TransactionTypeField = "transactionType"
  let transactionType = useWatch({
    control,
    name: TransactionTypeField
  })
  let isTransferTransactionType = isTransfer(transactionType)
  return (
    <>
      <Input type="hidden" name="brandId" value={brandId} />
      <Input type="hidden" name="username" value={username} />
      <Input type="hidden" name="playerCode" value={playerCode} />
      <FieldValues margin="1rem">
        <Box alignY="center">
          <Trans zh="用户名" en="Username" />
        </Box>
        <Box alignY="center">{username}</Box>

        <Box alignY="center">
          <Trans zh="交易类型" en="Transaction Type" />
        </Box>
        <Set>
          <PlayerAdjustBalanceTypeSelect
            name={TransactionTypeField}
            transferable={!!player?.agentUsername}
            required
          />
        </Set>

        {/* TODO: checkbox field name
        {isCompanyOrAgent(transactionType) && (
          <>
            <Box alignY="center">
              <Trans zh="需算入净盈利" en="Include in Net Profit" />
            </Box>
            <Checkbox name="includeNetProfit" />
          </>
        )} 
        */}

        {isTransferTransactionType && player?.agentUsername && (
          <>
            <Box alignY="center">
              <Trans zh="转账代理用户名" en="Transfer Agent Username" />
            </Box>
            <Input value={player?.agentUsername} readOnly />
          </>
        )}

        <Box alignY="center">
          <Trans zh="交易金额" en="Amount" />
        </Box>
        <NumberInputField name="amount" min="0" step="0.01" required />

        <Box alignY="center">
          <Trans zh="备注" en="Remark" />
        </Box>

        <Input name="remark" />
      </FieldValues>
    </>
  )
}
