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
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Input from "../../input/Input"
import Textarea from "../../textarea"
import Checkbox from "../../checkbox"
import { RemarkTrans } from "../../trans/Action"
import { Select } from "../../select/Select"
import { NumberInput } from "../../input/NumberInput"
import { useFormContext, useWatch } from "react-hook-form"

const AddOrDeductFund = {
  zh: "上/下分",
  en: "Add/Deduct Fund"
}
const AddOrDeductFundTrans = () => <Trans {...AddOrDeductFund} />
const useAddOrDeductFundTrans = () => useTrans(AddOrDeductFund)

export const AddOrDeductFundDialogDisclosure = ({ brandId }) => {
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
        <AddOrDeductFundDialog brandId={brandId} dialog={dialog} />
      )}
    </>
  )
}

//TODO: double confirm dialog -> submit
//TODO: use brandId to get data?
const AddOrDeductFundDialog = ({ brandId, dialog }) => {
  let title = useAddOrDeductFundTrans()

  //TODO: defaultValues
  return (
    <FormDialog defaultValues={{}} dialog={dialog} title={title}>
      <FormBody />
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

//TODO: useWatchCreditAmount
const CreditAmountField = "credit"
const CreditAmountInput = ({
  name = CreditAmountField,
  registerOptions = {
    valueAsNumber: true
  },
  min = "0.01",
  step = "0.01",
  required = true,
  ...props
}) => {
  return (
    <NumberInput
      name={name}
      registerOptions={registerOptions}
      min={min}
      step={step}
      required={required}
      {...props}
    />
  )
}

//TODO
const useCreditAmount = (name = CreditAmountField) => {
  let { control } = useFormContext()
  let value = useWatch({
    control,
    name
  })
  return value
}

//TODO
const useCalcUpdatedCredit = () => {}

const FormBody = ({}) => {
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
        <Box>TODO: fake PlatformCredits</Box>

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
        <Box>TODO: calcPlatformCredit</Box>

        <Box>
          <Trans zh="操作者" en="Operated By" />
        </Box>
        <Box>TODO: current username</Box>

        <Box>
          <RemarkTrans />
        </Box>
        <Textarea name="reamrk" />

        <Box>
          <Trans zh="金額 (USD)" en="Amount (USD)" />
        </Box>
        <NumberInput
          name="amount"
          registerOptions={{
            valueAsNumber: true
          }}
          min="0.01"
          step="0.01"
          required
        />
      </FieldValues>
      <Box>
        <ConfirmCheckbox />
      </Box>
    </FieldStack>
  )
}

//TODO: validation
const ConfirmCheckbox = ({ name = "confirm" }) => {
  return (
    <Checkbox
      name={name}
      required
      label={
        <Trans
          zh="我確認有收到上述金額(USD)"
          en="I have received the amount(USD) mentioned above."
        />
      }
    />
  )
}
