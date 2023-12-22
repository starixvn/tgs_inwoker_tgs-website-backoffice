import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Stack, FieldStack, Card, Set, Icon, Box } from "bumbag"
import { useIsDisplayMenuByRoute, useUsername } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Input from "../../input/Input"
import Textarea from "../../textarea"
import Checkbox from "../../checkbox"
import { CancelTrans, RemarkTrans, SubmitTrans } from "../../trans/Action"
import { NumberInput as _NumberInput } from "../../input/NumberInput"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { usePlatformAccountFund, useUpdatePlatformAccountFund } from "./client"
import Modal from "../../dialog/Modal"
import { ConfirmText } from "../../button/ActionButtons"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import {
  FundAction,
  FundActionSelect,
  isAddFund,
  isDeductFund,
  useFundAction
} from "./FundAction"
import { PlatformTrans } from "../../trans/Platform"

const AddOrDeductFund = {
  zh: "上/下分",
  en: "Add/Deduct Fund"
}
const AddOrDeductFundTrans = () => <Trans {...AddOrDeductFund} />
const useAddOrDeductFundTrans = () => useTrans(AddOrDeductFund)

export const FundActionDialogDisclosure = ({
  brandId,
  onSubmitted,
  id,
  dialogId = "fund-action-dialog"
}) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure {...dialog}>
        <AddOrDeductFundTrans />
      </Disclosure>
      {dialog.visible && (
        <AddDeductFundDialog
          brandId={brandId}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const PlatformCreditField = "creditAvailable"
const usePlatformCredit = (name = PlatformCreditField) => {
  let { control } = useFormContext()
  let value = useWatch({
    control,
    name
  })
  return value
}

const AddDeductFundDialog = ({ brandId, onSubmitted, dialog, dialogId }) => {
  let title = useAddOrDeductFundTrans()

  let formRef = useRef()

  let {
    isLoading: isLoadingFundData,
    data: fundData,
    error: fundDataError,
    mutate: mutateFundData,
    deleteCache: deleteFundDataCache
  } = usePlatformAccountFund(brandId)

  let formMethods = useForm({
    defaultValues: {
      brandCode: fundData?.brandCode,
      creditAvailable: fundData?.creditAvailable,
      type: FundAction.Add,
      expansions: {}
    }
  })
  let doubleConfirmDialog = useModalState()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformAccountFund(brandId, formData?.type, formData)

  if (isLoadingFundData) {
    return <LoadingBackdrop {...dialog} />
  }

  if (fundDataError) {
    return <AlertDialog {...fundDataError} onClickClose={dialog.hide} />
  }

  const onSubmit = ({ brandCode, creditAvailable, confirm, ...data }) => {
    setSubmit(data)
  }
  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id={dialogId}
      formRef={formRef}
      formMethods={formMethods}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      onSubmitted={onSubmitted}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      actionButtonsProps={{
        submitText: <SubmitTrans />,
        submitProps: {
          type: "button",
          onClick: () => {
            formMethods.trigger().then((validated) => {
              if (validated) {
                doubleConfirmDialog.show()
              }
            })
          },
          isLoading,
          disabled: isLoading
        }
      }}
      title={title}
    >
      <FormBody />
      {doubleConfirmDialog.visible && (
        <Modal
          id="double-confirm-dialog"
          showActionButtons
          actionButtonsProps={{
            submitText: <Trans zh="確定" en="Yes, I'm sure" />,
            cancelText: <CancelTrans />,
            onClickSubmit: () => {
              doubleConfirmDialog.hide()
              formRef.current.requestSubmit()
            }
          }}
          {...doubleConfirmDialog}
        >
          <Set orientation="horizontal" alignY="center">
            <Icon icon="warning" color="warning" fontSize="1.25rem" />
            <Trans
              zh="確定執行上/下分?"
              en="Are you sure to add/ deduct the platform credits?"
            />
          </Set>
        </Modal>
      )}
    </FormDialog>
  )
}

const NumberInputStyle = css`
  & input {
    text-align: right;
  }
`

const NumberInput = ({
  registerOptions = {
    valueAsNumber: true
  },
  min = "0.01",
  step = "0.01",
  ...props
}) => {
  return (
    <_NumberInput
      registerOptions={registerOptions}
      min={min}
      step={step}
      css={NumberInputStyle}
      {...props}
    />
  )
}

const AmountField = "amount"
const AmountInput = ({ name = AmountField, required = true, ...props }) => (
  <NumberInput name={name} required={required} {...props} />
)

const useCreditAmount = (name = AmountField) => {
  let { control } = useFormContext()
  let value = useWatch({
    control,
    name
  })
  return value
}

const useEstimatedCredit = () => {
  let platformCredit = usePlatformCredit()
  let type = useFundAction()
  let amount = useCreditAmount()
  if (!Number.isFinite(amount)) {
    return null
  }

  if (isAddFund(type)) {
    return platformCredit + amount
  } else if (isDeductFund(type)) {
    return platformCredit - amount
  }
  return null
}

const MoneyField = "money"
const MoneyInput = ({ name = MoneyField, required = true, ...props }) => (
  <NumberInput name={name} required={required} {...props} />
)

const FormBody = ({}) => {
  let { getValues } = useFormContext()

  let platformCredit = usePlatformCredit()
  let operator = useUsername()
  let estimatedCredit = useEstimatedCredit()
  return (
    <FieldStack marginLeft="1rem">
      <FieldValues>
        <Box>
          <PlatformTrans />
        </Box>
        <Box>{getValues("brandCode")}</Box>

        <Box>
          <Trans zh="平台額度" en="Platform Credits" />
        </Box>
        <Box alignX="right">
          <FormattedNumberDecimal value={platformCredit} />
        </Box>

        <Box alignY="center">
          <Trans zh="操作類型" en="Type" />
        </Box>
        <FundActionSelect width="100%" />

        <Box alignY="center">
          <Trans zh="額度" en="Credits" />
        </Box>
        <AmountInput />

        <Box>
          <Trans zh="平台額度(操作後)" en="Platform Credits (Updated)" />
        </Box>
        <Box alignX="right">
          <FormattedNumberDecimal value={estimatedCredit} placeholder="-" />
        </Box>

        <Box>
          <Trans zh="操作者" en="Operated By" />
        </Box>
        <Box>{operator}</Box>

        <Box>
          <RemarkTrans />
        </Box>
        <Textarea name="remark" />

        <Box alignY="center">
          <Trans zh="金額 (USD)" en="Amount (USD)" />
        </Box>
        <MoneyInput />
      </FieldValues>
      <Box>
        <ConfirmCheckbox />
      </Box>
    </FieldStack>
  )
}

const ConfirmCheckbox = ({ name = "confirm", required = true }) => {
  return (
    <Checkbox
      name={name}
      required={required}
      label={
        <Trans
          zh="我確認有收到上述金額(USD)"
          en="I have received the amount(USD) mentioned above."
        />
      }
    />
  )
}
