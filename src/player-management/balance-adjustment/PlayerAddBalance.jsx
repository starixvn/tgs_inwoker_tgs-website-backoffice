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
import { ConfirmCancelFooter } from "../../form/ConfirmButtonFooter"
import {
  usePlayerAdjustIncreaseBalance,
  usePlayerAdjustIncreaseTurnoverRequirement
} from "./client"
import { FieldValues } from "../../layout/Grid"
import { Update, AdjustTransactionAmount } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext, useWatch } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInputField } from "../../input/NumberInput"
import {
  PlayerAdjustBalanceTypeSelect,
  showIncludeInNetProfitSetting
} from "./PlayerAdjustBalanceType"
import Checkbox from "../../checkbox"
import { PlatformBucketSelect } from "../../platform-management/PlatformBucket"
import { isDev } from "../../env"

export const PlayerAddBalanceDisclosure = ({
  brandId,
  username,
  playerCode,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  let hasTransactionAmountAuth = useIsDisplayMenuByRoute([
    AdjustTransactionAmount
  ])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="加钱" en="Add Balance" />
      </Disclosure>
      {dialog.visible && hasTransactionAmountAuth ? (
        <AddDialog
          brandId={brandId}
          username={username}
          playerCode={playerCode}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      ) : (
        <AddTurnoverRequirementDialog
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

const AddDialog = ({ brandId, username, playerCode, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    usePlayerAdjustIncreaseBalance(playerCode, formData)

  let title = useTrans({
    zh: "余额加分",
    en: "Add Balance"
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
      id="add-balance-dialog"
      defaultValues={{
        brandId,
        username,
        playerCode,
        transactionType: null
      }}
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
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({}) => {
  let { control, getValues, setValue } = useFormContext()

  let [username, brandId, playerCode] = getValues([
    "username",
    "brandId",
    "playerCode"
  ])

  let TransactionTypeField = "transactionType"
  let transactionType = useWatch({
    control,
    name: TransactionTypeField
  })

  let IncludeInNetProfitField = "includeInNetProfit"

  let TransactionAmountField = "amount"
  return (
    <>
      <FieldValues margin="1rem">
        <Box>
          <Trans zh="用户名" en="Username" />
        </Box>
        <Box alignY="center">{username}</Box>

        <Box alignY="center">
          <Trans zh="交易类型" en="Transaction Type" />
        </Box>
        <Set>
          <PlayerAdjustBalanceTypeSelect
            name={TransactionTypeField}
            required
            onChange={(event) => {
              let type = event.target.value
              if (!showIncludeInNetProfitSetting(type)) {
                setValue(IncludeInNetProfitField, undefined)
              }
            }}
          />
        </Set>

        <Box alignY="center">
          <Trans zh="游戏类型" en="Game Type" />
        </Box>
        <Box>
          <PlatformBucketSelect name="bucketTypes[0]" platformId={brandId} />
        </Box>

        {showIncludeInNetProfitSetting(transactionType) && (
          <>
            <Box alignY="center">
              <Trans zh="需算入净盈利" en="Include in Net Profit" />
            </Box>
            <Checkbox name={IncludeInNetProfitField} defaultChecked={true} />
          </>
        )}

        <Box alignY="center">
          <Trans zh="交易金额" en="Amount" />
        </Box>
        <NumberInputField name={TransactionAmountField} min="0" step="0.01" />

        <Box alignY="center">
          <Trans zh="流水金额" en="Turnover Requirement Amount" />
        </Box>
        <NumberInputField name="bucketAmount" min="0" step="0.01" />

        <Box alignY="center">
          <Trans zh="备注" en="Remark" />
        </Box>
        <Input name="remark" />
      </FieldValues>
      <Input type="hidden" name="brandId" value={brandId} />
      <Input type="hidden" name="username" value={username} />
      <Input type="hidden" name="playerCode" value={playerCode} />
    </>
  )
}

const AddTurnoverRequirementDialog = ({
  brandId,
  username,
  playerCode,
  onSubmitted,
  dialog
}) => {
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    usePlayerAdjustIncreaseTurnoverRequirement(playerCode, formData)

  let title = useTrans({
    zh: "余额加分",
    en: "Add Balance"
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
      id="add-balance-dialog"
      defaultValues={{
        brandId,
        username,
        playerCode,
        transactionType: null
      }}
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
      <AddTurnoverRequirementFormBody />
    </FormDialog>
  )
}

const AddTurnoverRequirementFormBody = ({}) => {
  let { control, getValues } = useFormContext()

  let [username, brandId, playerCode] = getValues([
    "username",
    "brandId",
    "playerCode"
  ])

  return (
    <>
      <FieldValues margin="1rem">
        <Box>
          <Trans zh="用户名" en="Username" />
        </Box>
        <Box alignY="center">{username}</Box>

        <Box alignY="center">
          <Trans zh="流水金额" en="Turnover Requirement Amount" />
        </Box>
        <NumberInputField name="amount" min="0" step="0.01" />

        <Box alignY="center">
          <Trans zh="备注" en="Remark" />
        </Box>
        <Input name="remark" />
      </FieldValues>
      <Input type="hidden" name="brandId" value={brandId} />
      <Input type="hidden" name="username" value={username} />
      <Input type="hidden" name="playerCode" value={playerCode} />
    </>
  )
}
