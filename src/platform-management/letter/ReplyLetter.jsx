import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  FieldStack,
  Box,
  Button,
  Text,
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
import Disclosure, {
  AddDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import { Update, View } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext } from "react-hook-form"
import { useAddLetter, useLetter, useReplyLetter } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { InputField } from "../../input/Input"
import Textarea, { TextareaField } from "../../textarea"
import Modal from "../../dialog/Modal"
import { isSentLetterBox } from "./LetterBoxType"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"

//TODO: need onSubmitted?
export const ReplyLetterDisclosure = ({
  brandId,
  letterBoxType,
  letterId,
  ...props
}) => {
  let dialog = useModalState()

  if (isSentLetterBox(letterBoxType)) {
    return null
  }

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <Trans zh="回覆" en="Reply" />
      </Disclosure>
      {dialog.visible && (
        <ReplyLetterDialog
          brandId={brandId}
          letterBoxType={letterBoxType}
          letterId={letterId}
          //   onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: onSubmitted??
const ReplyLetterDialog = ({
  brandId,
  letterId,
  letterBoxType,
  dialog,
  ...props
}) => {
  let { isLoading, data, error, mutate, deleteCache } = useLetter(
    brandId,
    letterBoxType,
    letterId
  )

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <ReplyLetterFormDialog
      brandId={brandId}
      letterId={letterId}
      letter={data}
      dialog={dialog}
      {...props}
    />
  )
}

const ReplyLetterFormDialog = ({
  brandId,
  letterId,
  letter,
  onSubmitted,
  dialog
}) => {
  let [data, setSubmit] = useState()

  let { result, isLoading, error, mutate, deleteCache } = useReplyLetter(
    brandId,
    letterId,
    data
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    setSubmit(null)
    deleteCache()
    mutate(null, false)
  }

  let title = useTrans({
    zh: "回覆",
    en: "Reply"
  })

  return (
    <FormDialog
      defaultValues={{
        content: ""
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
      minHeight="70vh"
      minWidth="80vw"
    >
      <ReplyLetterFormBody context={letter?.quotation ?? letter?.content} />
    </FormDialog>
  )
}

const ReplyLetterFormBody = ({ context }) => {
  return (
    <FieldValues paddingLeft="1rem">
      <Label>
        <Trans zh="內容" en="Content" />
      </Label>
      <Set orientation="vertical" isFilled height="100%">
        <Textarea
          name="content"
          autoFocus
          css={css`
            textarea {
              min-height: 30vh;
            }
          `}
        />
        <Textarea
          value={context}
          readOnly
          disabled
          css={css`
            textarea {
              min-height: 30vh;
            }
          `}
        />
      </Set>
    </FieldValues>
  )
}
