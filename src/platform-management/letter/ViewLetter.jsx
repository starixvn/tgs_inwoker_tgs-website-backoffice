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
import { AddDisclosure, ViewDisclosure } from "../../dialog/Disclosure"
import { Update, View } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext } from "react-hook-form"
import { useAddLetter, useLetter } from "./client"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Input, { InputField } from "../../input/Input"
import Textarea, { TextareaField } from "../../textarea"
import Modal from "../../dialog/Modal"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"

export const ViewLetterDisclosure = ({
  brandId,
  letterBoxType,
  letterId,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <ViewDialog
          brandId={brandId}
          letterBoxType={letterBoxType}
          letterId={letterId}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ViewDialog = ({ brandId, letterBoxType, letterId, dialog }) => {
  let { isLoading, data, error, mutate, deleteCache } = useLetter(
    brandId,
    letterBoxType,
    letterId
  )

  let title = useTrans({
    zh: "查看",
    en: "View"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal
      title={title}
      {...dialog}
      placement="top"
      minHeight="70vh"
      minWidth="80vw"
    >
      <FieldValues marginLeft="1rem">
        <Label>
          <Trans zh="主旨" en="Subject" />
        </Label>
        <Input name="subject" value={data?.subject} readOnly disabled />
        <Label>
          <Trans zh="內容" en="Content" />
        </Label>
        <Textarea
          name="content"
          value={data?.content}
          readOnly
          disabled
          css={css`
            textarea {
              min-height: 50vh;
            }
          `}
        />
      </FieldValues>
    </Modal>
  )
}
