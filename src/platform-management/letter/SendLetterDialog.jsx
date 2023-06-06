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
import { SendLetterType, SendLetterTypeSelect } from "./SendLetterType"
import { useSendLetter } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { InputField } from "../../input/Input"
import { TextareaField } from "../../textarea"

export const SendLetterDialogDisclosure = ({
  brandId,
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
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <SendDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const SendDialog = ({ brandId, dialog, onSubmitted }) => {
  let [sendLetterType, setLetterBoxType] = useState(SendLetterType.AllPlayers)
  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } = useSendLetter(
    brandId,
    sendLetterType,
    formData
  )

  let title = useTrans({
    zh: "新增站內信",
    en: "Add Memo"
  })

  //TODO: receivers
  const onSubmit = ({ sendLetterType, receiver, ...data } = {}) => {
    setLetterBoxType(sendLetterType)
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
        sendLetterType: SendLetterType.AllPlayers,
        receivers: [],
        subject: "subject",
        content: "content"
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      placement="top"
      minWidth="80vw"
    >
      <FormBody />
    </FormDialog>
  )
}

const GroupFieldBox = () => {}

//TODO: need readOnly?
const FormBody = ({ readOnly = false }) => {
  return (
    <FieldValues>
      <Label required>
        <Trans zh="群组" en="Group" />
      </Label>
      <Box>
        <SendLetterTypeSelect />
        <InputField name="receiver" required />
      </Box>
      <Label name="subject" required>
        <Trans zh="主题" en="Subject" />
      </Label>
      <InputField name="subject" required disabled={readOnly} />
      <Label name="content" required>
        <Trans zh="内容" en="Content" />
      </Label>
      <TextareaField
        name="content"
        css={css`
          textarea {
            min-height: 45vh;
          }
        `}
      />
    </FieldValues>
  )
}
