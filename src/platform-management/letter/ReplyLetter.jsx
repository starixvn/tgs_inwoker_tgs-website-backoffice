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
import { useLetter, useReplyLetter } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { InputField } from "../../input/Input"
import Textarea, { TextareaField } from "../../textarea"
import Modal from "../../dialog/Modal"
import { isSentBox } from "./BoxType"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { DoubleConfirmDialogDisclosure } from "./DoubleConfirmDialog"

export const ReplyLetterDisclosure = ({
  brandId,
  boxType,
  letterId,
  onSubmitted,
  id,
  dialogId = "reply-letter-dialog",
  ...props
}) => {
  let dialog = useModalState()

  if (isSentBox(boxType)) {
    return null
  }

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <Trans zh="回覆" en="Reply" />
      </Disclosure>
      {dialog.visible && (
        <ReplyLetterDialog
          brandId={brandId}
          boxType={boxType}
          letterId={letterId}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const ReplyLetterDialog = ({
  brandId,
  letterId,
  boxType,
  dialog,
  onSubmitted,
  dialogId,
  ...props
}) => {
  let { isLoading, data, error, mutate, deleteCache } = useLetter(
    brandId,
    boxType,
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
      dialogId={dialogId}
      onSubmitted={onSubmitted}
      {...props}
    />
  )
}

const ReplyLetterFormDialog = ({
  brandId,
  letterId,
  letter,
  onSubmitted,
  dialog,
  dialogId
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
    mutate(undefined, false)
  }

  let title = useTrans({
    zh: "回覆",
    en: "Reply"
  })

  return (
    <FormDialog
      id={dialogId}
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
      actionButtonsProps={{
        cancelProps: {
          display: "none"
        },
        addonButtons: (
          <>
            <DoubleConfirmDialogDisclosure dialog={dialog} />
          </>
        )
      }}
      placement="top"
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
