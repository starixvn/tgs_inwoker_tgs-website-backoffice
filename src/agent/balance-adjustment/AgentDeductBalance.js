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
  FieldStack,
  Group
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
import { useAgentAdjustReduceBalance } from "./client"
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
import AgentDeductBalanceType, {
  AgentDeductBalanceTypeSelect
} from "./AgentDeductBalanceType"
import { useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import { DeductBalanceTargetSelect } from "./AgentDeductBalanceTarget"
import AdjustType from "./AdjustType"
import { NumberInput } from "../../input/NumberInput"
import {
  AgentAdjustBalanceTypeSelect,
  isTransfer
} from "./AgentAdjustBalanceType"

export const AgentDeductBalanceDisclosure = ({
  brandId,
  agentId,
  username,
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
          agentId={agentId}
          username={username}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const DeductDialog = ({ brandId, agentId, username, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useAgentAdjustReduceBalance(agentId, formData)

  let title = useTrans({
    zh: "余额扣分",
    en: "Deduct Balance"
  })

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      adjustmentType: AdjustType.Subtract
    })
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
      <FormBody brandId={brandId} username={username} agentId={agentId} />
    </FormDialog>
  )
}

const FormBody = ({ brandId, username, agentId }) => {
  let { watch } = useFormContext()

  let typeFieldName = "transactionType"
  let type = watch(typeFieldName)
  let isTransferTransactionType = isTransfer(type)
  return (
    <>
      <Input type="hidden" name="brandId" value={brandId} />
      <Input type="hidden" name="username" value={username} />
      <Input type="hidden" name="id" value={agentId} />
      <FieldValues margin="1rem">
        <Text.Block alignY="center">
          <Trans zh="代理用户名" en="Agent Username" />
        </Text.Block>
        <Text.Block alignY="center">{username}</Text.Block>

        <Text.Block alignY="center">
          <Trans zh="交易类型" en="Transaction Type" />
        </Text.Block>
        <Set>
          {/* 
          <AgentAdjustBalanceTypeSelect name={typeFieldName} transferable required /> 
          */}
          <AgentDeductBalanceTypeSelect name={typeFieldName} required />
        </Set>

        {type == AgentDeductBalanceType.Transfer && (
          <>
            <Text.Block alignY="center">
              <Trans zh="转账用户名" en="Transfer Username" />
            </Text.Block>
            <Group>
              <DeductBalanceTargetSelect name="accountType" required />
              <Input name="targetName" required />
            </Group>
          </>
        )}

        <Text.Block alignY="center">
          <Trans zh="交易金额" en="Amount" />
        </Text.Block>
        <NumberInput name="amount" min="0" step="0.01" required />

        <Text.Block alignY="center">
          <Trans zh="备注" en="Remark" />
        </Text.Block>

        <Input name="remark" />
      </FieldValues>
    </>
  )
}
