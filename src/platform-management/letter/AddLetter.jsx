import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  FieldStack,
  Box,
  Button,
  Text,
  Modal,
  Set,
  useModalState,
  Columns,
  Heading,
  Level,
  Dialog
} from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useUserBrandId,
  useUserLicenseeId,
  useUserResellerId,
  useUserRoleType
} from "../../user/context"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { AddDisclosure } from "../../dialog/Disclosure"
import { Update } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext } from "react-hook-form"
import { useAddLetter } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { InputField } from "../../input/Input"
import { TextareaField } from "../../textarea"

export const AddLetterDisclosure = ({ brandId, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: need onSubmitted?
//TODO: receiver is playerCode(4ujz9vxp0m1y) or username(Phyllis1684475339619)?
const AddDialog = ({ brandId, dialog }) => {
  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } = useAddLetter(
    brandId,
    formData
  )

  let title = useTrans({
    zh: "新增站內信",
    en: "Add Memo"
  })

  const onSubmit = ({ receiver, ...data } = {}) => {
    setSubmit({
      ...data,
      receivers: [receiver]
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{
        brandId,
        receivers: [],
        subject: "subject",
        content: "content"
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      title={title}
      dialog={dialog}
    >
      <FormBody />
    </FormDialog>
  )
}

//TODO: readOnly?
const FormBody = ({ readOnly = false }) => {
  return (
    <FieldStack>
      <Label required>receiver</Label>
      <InputField name="receiver" required />
      <Label name="subject" required>
        <Trans zh="主题" en="Subject" />
      </Label>
      <InputField name="subject" required disabled={readOnly} />
      <Label name="content" required>
        <Trans zh="内容" en="Content" />
      </Label>
      <TextareaField name="content" />
    </FieldStack>
  )
}
