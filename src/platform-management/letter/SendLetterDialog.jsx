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
import { useFormContext, useWatch } from "react-hook-form"
import { SendLetterType, SendLetterTypeSelect } from "./SendLetterType"
import { useSendLetter } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { InputField } from "../../input/Input"
import { TextareaField } from "../../textarea"
import { PlayerSelect } from "../../player-management/player-list/PlayerSelect"

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

//TODO: player multi select
//TODO: receivers
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

  //TODO: rm hardcode
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

//TODO: change based on form.sendLetterType
const GroupFieldBox = () => {
  let { control } = useFormContext()
  let brandId = useWatch({
    control,
    name: "brandId"
  })
  let sendLetterType = useWatch({
    control,
    name: "sendLetterType"
  })
  console.log("sendLetterType", sendLetterType)
  return (
    <>
      <Label required>
        <Trans zh="群组" en="Group" />
      </Label>
      <Set isFilled>
        <SendLetterTypeSelect />
        <GroupFieldBody brandId={brandId} sendLetterType={sendLetterType} />
      </Set>
    </>
  )
}

//TODO: how flex true?
const GroupFieldBody = ({ brandId, sendLetterType }) => {
  switch (sendLetterType) {
    case SendLetterType.AllPlayers:
      return null
    case SendLetterType.DesignatedPlayers:
      return (
        <PlayerSelect
          brandId={brandId}
          name="receivers"
          isMulti={true}
          width="100%"
        />
      )
    default:
      return null
  }
}

//TODO: need readOnly?
const FormBody = ({ readOnly = false }) => {
  return (
    <FieldValues>
      <GroupFieldBox />
      <Label name="subject" required>
        <Trans zh="主题" en="Subject" />
      </Label>
      <InputField name="subject" required />
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
