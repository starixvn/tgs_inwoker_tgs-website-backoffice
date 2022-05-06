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
  Box
} from "bumbag"
import { useIsDisplayMenuByRoute, useUserLicenseeId } from "../../user/context"
import { Disclosure, EditDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Update as UpdateMenu } from "./menu"
import { usePlatformCreditPayment } from "./client"
import clone from "clone-deep"
import { useTrans, Trans, FormattedNumber } from "../../i18n"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInput } from "../../input/NumberInput"

export const PlatformCreditPaymentDialogDisclosure = ({
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="付款" en="Payment" />
      </Disclosure>
      {dialog.visible && (
        <EditDialog record={record} dialog={dialog} onSubmitted={onSubmitted} />
      )}
    </>
  )
}

const EditDialog = ({ record, onSubmitted, dialog, ...props }) => {
  let title = useTrans({
    zh: "付款",
    en: "Payment"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    usePlatformCreditPayment(record?.id, formData)

  const onSubmit = ({ amount = 0 } = {}) => {
    setSubmit(amount)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="platform-credit-payment-dialog"
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      dialog={dialog}
      title={title}
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = () => {
  let { getValues } = useFormContext()
  let [licenseeName, brandName, brandCode, credit, balance] = getValues([
    "licenseeName",
    "brandName",
    "brandCode",
    "credit",
    "balance"
  ])
  return (
    <FieldValues marginLeft="1rem">
      <NormalLabel>
        <Trans zh="所属公司" en="Licensee Name" />
      </NormalLabel>
      <Box alignY="center">{licenseeName}</Box>

      <Trans zh="平台名称" en="Name" />
      <Box alignY="center">{brandName}</Box>

      <Trans zh="平台代码" en="Code" />
      <Box alignY="center">{brandCode}</Box>

      <NormalLabel>
        <Trans zh="平台额度" en="Credit" />
      </NormalLabel>
      <Box alignY="center">
        <FormattedNumber value={credit} />
      </Box>

      <NormalLabel>
        <Trans zh="额度余额" en="Balance" />
      </NormalLabel>
      <Box alignY="center">
        <FormattedNumber value={balance} />
      </Box>
      <NormalLabel>
        <Trans zh="付款金额" en="Payment amount" />
      </NormalLabel>
      <Box alignY="center">
        <NumberInput name="amount" required />
      </Box>
    </FieldValues>
  )
}
