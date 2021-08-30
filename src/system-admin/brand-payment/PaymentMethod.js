import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  FieldWrapper,
  Columns,
  DropdownMenu
} from "bumbag"
import Disclosure, {
  AddDisclosure,
  EditDisclosure
} from "../../dialog/Disclosure"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { useAddPaymentMethod } from "../../payment/client"
import { Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { Update } from "./menu"
import { useFormContext } from "react-hook-form"
import { Input, InputField } from "../../input/Input"
import { TextareaField } from "../../textarea"
import { FormDialog } from "../../form/FormDialog"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"

export const AddPaymentMethodDisclosure = ({ onSubmitted }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} />
      {dialog.visible && (
        <AddDialog dialog={dialog} onSubmitted={onSubmitted} />
      )}
    </>
  )
}

const AddDialog = ({ dialog, onSubmitted }) => {
  let title = useTrans({
    zh: "新增支付方式",
    en: "Add Payment Method"
  })
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPaymentMethod(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={{}}
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onSubmitted={onSubmitted}
        onCloseErrorAlert={reset}
        title={title}
        dialog={dialog}
        width="40vw"
      >
        <FormBody />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = ({}) => {
  let { getValues } = useFormContext()
  let IdFieldName = "id"
  let id = getValues(IdFieldName)
  let isAdd = !id
  let isEdit = !isAdd
  return (
    <FieldStack>
      <InputField name="code" label="Code" readOnly={isEdit} />
      <InputField name="bankType" label="Bank Type" readOnly={isEdit} />
      <Input type="hidden" name={IdFieldName} value={id} />
    </FieldStack>
  )
}
