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
import { useUpdatePlatformCredit } from "./client"
import clone from "clone-deep"
import { useTrans, Trans } from "../../i18n"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInput } from "../../input/NumberInput"

export const EditPlatformCreditDialogDisclosure = ({
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
      <EditDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <EditDialog record={record} dialog={dialog} onSubmitted={onSubmitted} />
      )}
    </>
  )
}

const EditDialog = ({ record, onSubmitted, dialog, ...props }) => {
  let title = useTrans({
    zh: "编辑额度",
    en: "Edit Credit"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformCredit(record?.id, formData)

  const onSubmit = ({ credit } = {}) => {
    setSubmit(credit)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="platform-credit-dialog"
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
  let [licenseeName, brandName, brandCode] = getValues([
    "licenseeName",
    "brandName",
    "brandCode"
  ])
  return (
    <>
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
          <NumberInput name="credit" required min="0" />
        </Box>
      </FieldValues>
      <Input type="hidden" name="id" />
    </>
  )
}
