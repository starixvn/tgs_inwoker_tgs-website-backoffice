import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  FieldStack,
  Box,
  Set,
  useModalState,
  Button,
  Disclosure
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
import { LetterType, LetterTypeSelect } from "./LetterType"
import { useSendLetter } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { InputField } from "../../input/Input"
import { TextareaField } from "../../textarea"
import { PlayerSelect } from "../../player-management/player-list/PlayerSelect"
import { DoubleConfirmDialogDisclosure } from "./DoubleConfirmDialog"
import { SubjectTrans } from "../../trans/Field"

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
  let [letterType, setLetterType] = useState(LetterType.AllPlayers)
  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } = useSendLetter(
    brandId,
    letterType,
    formData
  )

  let title = useTrans({
    zh: "新增站內信",
    en: "Add Memo"
  })

  const onSubmit = ({ letterType, ...data } = {}) => {
    setLetterType(letterType)
    setSubmit(data)
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
        letterType: LetterType.AllPlayers,
        receivers: [],
        subject: "",
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
      <FormBody />
    </FormDialog>
  )
}

const GroupFieldBox = () => {
  let { control } = useFormContext()
  let brandId = useWatch({
    control,
    name: "brandId"
  })
  let letterType = useWatch({
    control,
    name: "letterType"
  })

  return (
    <>
      <Label required>
        <Trans zh="群组" en="Group" />
      </Label>
      <Set orientation="vertical" isFilled width="100%">
        <LetterTypeSelect />
        <GroupFieldBody brandId={brandId} letterType={letterType} />
      </Set>
    </>
  )
}

const GroupFieldBody = ({ brandId, letterType }) => {
  switch (letterType) {
    case LetterType.AllPlayers:
      return null
    case LetterType.DesignatedPlayers:
      return (
        <PlayerSelect
          brandId={brandId}
          name="receivers"
          isMulti={true}
          flex="1"
        />
      )
    default:
      return null
  }
}

const FormBody = ({}) => {
  return (
    <FieldValues>
      <GroupFieldBox />
      <Label name="subject" required>
        <SubjectTrans />
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
