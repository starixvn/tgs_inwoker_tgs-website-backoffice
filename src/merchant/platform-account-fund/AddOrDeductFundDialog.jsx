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
  useUpdatePlatformAccountFund
} from "./fakeClient"
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

const PlatformCreditField = "platformCredit"
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

  //TODO: fetch latest data from api
  let {
    isLoading: isLoadingCreditData,
    data: creditData,
    error: creditDataError,
    mutate: mutateCreditData,
    deleteCache: deleteCreditDataCache
  } = usePlatformAccountFund(brandId)
  //TODO: rm fake platformCredit 100
  let formMethods = useForm({
    defaultValues: {
      platformCredit: 100
    }
  })
  let doubleConfirmDialog = useModalState()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformAccountFund(brandId, formData)

  if (isLoadingCreditData) {
    return <LoadingBackdrop {...dialog} />
  }
  if (creditDataError) {
    return <AlertDialog {...creditDataError} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    console.log("onSubmit", data)
    setSubmit(data)
  }

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

//TODO
const TypeField = "type"
const AddFund = {
  zh: "上分",
  en: "Add Fund"
}
const AddFundTrans = () => <Trans {...AddFund} />
const useAddFundTrans = () => useTrans(AddFund)

const DeductFund = {
  zh: "下分",
  en: "Deduct Fund"
}
const DeductFundTrans = () => <Trans {...DeductFund} />
const useDeductFundTrans = () => useTrans(DeductFund)

//TODO: import from client
const Type = {
  AddFund: "AddFund",
  DeductFund: "DeductFund"
}

const TypeSelect = ({
  name = TypeField,
  defaultValue = Type.AddFund,
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
      value: Type.AddFund
    },
    {
      label: useDeductFundTrans(),
      value: Type.DeductFund
    }
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

const CreditAmountField = "credit"
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

//TODO: confirm required = true?
const PaymentAmountField = "paymentAmount"
const PaymentAmountInput = ({
  name = PaymentAmountField,
  required = true,
  ...props
}) => <NumberInput name={name} required={required} {...props} />

const FormBody = ({}) => {
  let platformCredit = usePlatformCredit()
  let operator = useUsername()
  let estimatedCredit = useEstimatedCredit()
  return (
    <FieldStack marginLeft="1rem">
      <FieldValues>
        <Box>
          <Trans zh="平台" en="Platform" />
        </Box>
        <Box>TODO: Platform Code?</Box>

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
        <Textarea name="reamrk" />

        <Box alignY="center">
          <Trans zh="金額 (USD)" en="Amount (USD)" />
        </Box>
        <PaymentAmountInput />
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
