import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Text,
  Link
} from "bumbag"
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
import { Select } from "../../select/Select"
import { NumberInput as _NumberInput } from "../../input/NumberInput"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import {
  usePlatformAccountFund,
  /*
  TODO: why hook error
  useUpdatePlatformAccountFund,
  */
  useAddPlatformAccountFund,
  useDeductPlatformAccountFund,
  TxType
} from "./client"
import Modal from "../../dialog/Modal"
import { ConfirmText } from "../../button/ActionButtons"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"

const AddOrDeductFund = {
  zh: "上/下分",
  en: "Add/Deduct Fund"
}
const AddOrDeductFundTrans = () => <Trans {...AddOrDeductFund} />
const useAddOrDeductFundTrans = () => useTrans(AddOrDeductFund)

export const AddOrDeductFundDialogDisclosure = ({ brandId, onSubmitted }) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <AddOrDeductFundTrans />
      </Disclosure>
      {dialog.visible && (
        <AddOrDeductFundDialog
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

const AddOrDeductFundDialog = ({ brandId, onSubmitted, dialog }) => {
  let title = useAddOrDeductFundTrans()

  let formRef = useRef()
  //TODO: reload fund data?
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
      type: TxType.Add
    }
  })
  let doubleConfirmDialog = useModalState()

  let [type, setType] = useState(TxType.Add)
  let useFetch = useAddPlatformAccountFund
  if (type === TxType.Deduct) {
    useFetch = useDeductPlatformAccountFund
  }

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useFetch(
    fundData?.brandId,
    formData
  )

  if (isLoadingFundData) {
    return <LoadingBackdrop {...dialog} />
  }
  if (fundDataError) {
    return <AlertDialog {...fundDataError} onClickClose={dialog.hide} />
  }

  const onSubmit = ({ brandCode, creditAvailable, type, confirm, ...data }) => {
    setType(type)
    setSubmit(data)
  }

  //TODO: also reset txType?
  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
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

//TODO: rm from onSubmit data
const TypeField = "type"
const AddFund = {
  zh: "上分",
  en: "Add Fund"
}
const useAddFundTrans = () => useTrans(AddFund)

const DeductFund = {
  zh: "下分",
  en: "Deduct Fund"
}
const useDeductFundTrans = () => useTrans(DeductFund)

const TypeSelect = ({
  name = TypeField,
  defaultValue = TxType.Add,
  required = true,
  placeholder,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useAddFundTrans(),
      value: TxType.Add
    }
    /*
    {
      label: useDeductFundTrans(),
      value: TxType.Deduct
    }
    */
  ]

  return (
    <Select
      name={name}
      options={options}
      defaultValue={defaultValue}
      required={required}
      placeholder={placeholder}
      {...props}
    />
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

const CreditAmountField = "amount"
const CreditAmountInput = ({
  name = CreditAmountField,
  required = true,
  ...props
}) => <NumberInput name={name} required={required} {...props} />

const useCreditAmount = (name = CreditAmountField) => {
  let { control } = useFormContext()
  let value = useWatch({
    control,
    name
  })
  return value
}

const useEstimatedCredit = () => {
  let platformCredit = usePlatformCredit()
  let creditAmount = useCreditAmount()
  if (!Number.isFinite(creditAmount)) {
    return null
  }

  return platformCredit + creditAmount
}

const AmountField = "money"
const AmountInput = ({ name = AmountField, required = true, ...props }) => (
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
          <Trans zh="平台" en="Platform" />
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
        <TypeSelect width="100%" />

        <Box alignY="center">
          <Trans zh="額度" en="Credits" />
        </Box>
        <CreditAmountInput />

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
        <AmountInput />
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
