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
import { useAgentAdjustIncreaseBalance } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { FieldValues } from "../../layout/Grid"
import Separator from "../../layout/Separator"
import { Update } from "./menu"
import FormDialog from "../../form/FormDialog"
import AddBalanceTypeSelect from "./AgentAddBalanceType"
import { useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import AdjustType from "./AdjustType"
import { NumberInput } from "../../input/NumberInput"
import { AgentAdjustBalanceTypeSelect } from "./AgentAdjustBalanceType"
import {
  AddBalanceTrans,
  RemarkTrans,
  TransactionTypeTrans
} from "../../trans/Action"
import { TransactionAmountTrans } from "../../trans/Field"
import { AgentUsernameTrans } from "../../trans/Agent"

export const AgentAddBalanceDisclosure = ({
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
        <AddBalanceTrans />
      </Disclosure>
      {dialog.visible && (
        <AddDialog
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

const AddDialog = ({ brandId, agentId, username, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useAgentAdjustIncreaseBalance(agentId, formData)

  let title = useTrans({
    zh: "余额加分",
    en: "Add Balance"
  })

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      adjustmentType: AdjustType.Add
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }
  return (
    <FormDialog
      id="add-balance-dialog"
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
      <Input type="hidden" name="brandId" value={brandId} />
      <Input type="hidden" name="username" value={username} />
      <Input type="hidden" name="id" value={agentId} />
      <FieldValues margin="1rem">
        <AgentUsernameTrans />
        <Box alignY="center">{username}</Box>

        <Box alignY="center">
          <TransactionTypeTrans />
        </Box>
        <Set>
          <AddBalanceTypeSelect name="transactionType" required />
          {/* 
          <AgentAdjustBalanceTypeSelect name="transactionType" required /> 
          */}
        </Set>

        <Text.Block alignY="center">
          <TransactionAmountTrans />
        </Text.Block>
        <NumberInput name="amount" min="0" step="0.01" required />

        <Text.Block alignY="center">
          <RemarkTrans />
        </Text.Block>
        <Input name="remark" />
      </FieldValues>
    </FormDialog>
  )
}
