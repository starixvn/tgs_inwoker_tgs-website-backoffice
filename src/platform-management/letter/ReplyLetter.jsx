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
import { TextareaField } from "../../textarea"
import Modal from "../../dialog/Modal"
import { isSentLetterBox } from "./LetterBoxType"

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
          //   onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: wait for op-api
const ReplyLetterDialog = ({ brandId, letterId, dialog }) => {
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
      // onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
    >
      <ReplyLetterFormBody />
    </FormDialog>
  )
}

const ReplyLetterFormBody = ({}) => {}
