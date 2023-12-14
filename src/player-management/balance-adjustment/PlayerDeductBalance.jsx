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
import { Trans, useTrans } from "../../i18n"
import { usePlayerAdjustReduceBalance } from "./client"
import { FieldValues } from "../../layout/Grid"
import { Update } from "./menu"
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
import {
  DeductBalanceTrans,
  RemarkTrans,
  TransactionTypeTrans
} from "../../trans/Action"
import { UserNameTrans } from "../../trans/User"
import { TransactionAmountTrans } from "../../trans/Field"

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
        <DeductBalanceTrans />
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
    >
      <FormBody brandId={brandId} username={username} playerCode={playerCode} />
    </FormDialog>
  )
}

const FormBody = ({ brandId, username, playerCode }) => {
  let { control, setValue } = useFormContext()
  let { data: player } = usePlayer(playerCode)

  let TransactionTypeField = "transactionType"
  let transactionType = useWatch({
    control,
    name: TransactionTypeField
  })
  let isTransferTransactionType = isTransfer(transactionType)

  let IncludeInNetProfitField = "includeInNetProfit"
  return (
    <>
      <Input type="hidden" name="brandId" value={brandId} />
      <Input type="hidden" name="username" value={username} />
      <Input type="hidden" name="playerCode" value={playerCode} />
      <FieldValues margin="1rem">
        <Box alignY="center">
          <UserNameTrans />
        </Box>
        <Box alignY="center">{username}</Box>

        <Box alignY="center">
          <TransactionTypeTrans />
        </Box>
        <Set>
          <PlayerAdjustBalanceTypeSelect
            name={TransactionTypeField}
            transferable={!!player?.agentUsername}
            required
            onChange={(event) => {
              let type = event.target.value
              if (!showIncludeInNetProfitSetting(type)) {
                setValue(IncludeInNetProfitField, undefined)
              }
            }}
          />
        </Set>

        {showIncludeInNetProfitSetting(transactionType) && (
          <>
            <Box alignY="center">
              <Trans zh="需算入净盈利" en="Include in Net Profit" />
            </Box>
            <Checkbox name={IncludeInNetProfitField} defaultChecked={true} />
          </>
        )}

        {isTransferTransactionType && player?.agentUsername && (
          <>
            <Box alignY="center">
              <Trans zh="转账代理用户名" en="Transfer Agent Username" />
            </Box>
            <Input value={player?.agentUsername} readOnly />
          </>
        )}

        <Box alignY="center">
          <TransactionAmountTrans />
        </Box>
        <NumberInputField name="amount" min="0" step="0.01" required />

        <Box alignY="center">
          <RemarkTrans />
        </Box>

        <Input name="remark" />
      </FieldValues>
    </>
  )
}
