import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { FieldStack, useModalState } from "bumbag"
import { AddDisclosure } from "../../dialog/Disclosure"
import { useAddPaymentChannel } from "../../payment/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Trans, useTrans } from "../../i18n"
import { FormDialog } from "../../form/FormDialog"
import Backdrop from "../../dialog/Backdrop"
import { useFormContext } from "react-hook-form"
import { Input, InputField } from "../../input/Input"
import { Update } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"

export const AddPaymentChannelDisclosure = ({ onSubmitted }) => {
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
    zh: "新增支付通道",
    en: "Add Payment Channel"
  })
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPaymentChannel(formData)

  const onSubmit = ({ code = "" }) => {
    setSubmit(code)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={{}}
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        onCloseErrorAlert={reset}
        title={title}
        dialog={dialog}
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
      <Input type="hidden" name={IdFieldName} value={id} />
    </FieldStack>
  )
}
