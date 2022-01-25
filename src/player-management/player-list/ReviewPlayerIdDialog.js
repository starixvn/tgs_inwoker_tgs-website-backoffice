import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Box,
  Text,
  Dialog,
  useModalState,
  FieldStack,
  Link
} from "bumbag"
import Disclosure, { VerifyDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import Backdrop from "../../dialog/Backdrop"
import { Trans, useTrans } from "../../i18n"
import clone from "clone-deep"
import { FieldValues } from "../../layout/Grid"
import { usePlayer } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"

export const ReviewPlayerIdDialogDisclosure = ({
  playerCode,
  record,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <VerifyDisclosure {...dialog} />
      {dialog.visible && (
        <PlayerDialog playerCode={playerCode} record={record} dialog={dialog} />
      )}
    </>
  )
}

const PlayerDialog = ({ playerCode, dialog, ...props }) => {
  let { isLoading, data, error, mutate, deleteCache } = usePlayer(playerCode)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={deleteCache} />
  }

  return (
    <ReviewDialog
      {...props}
      playerCode={playerCode}
      record={data}
      dialog={dialog}
    />
  )
}

const ReviewDialog = ({ playerCode, record = {}, dialog, ...props }) => {
  let [formData, setSubmit] = useState()
  //TODO: api

  //TODO: reset form
  const reset = () => {
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "审核身分证",
    en: "Verify Player ID"
  })

  let hasAttchment = !!record?.attachmentUrl
  return (
    <FormDialog
      defaultValues={clone(record)}
      onCloseErrorAlert={reset}
      title={title}
      dialog={dialog}
    >
      <FieldValues>
        <Trans zh="真实姓名" en="Real name" />
        <Box>{record?.realName}</Box>

        <Trans zh="身分证" en="IC Number" />
        <Box>{record?.idNumber}</Box>

        <Trans zh="附件" en="Attachment" />
        <Box>
          {hasAttchment && (
            <Link href={record.attachmentUrl} target="_blank">
              <Trans zh="连结" en="Link" />
            </Link>
          )}
          {!hasAttchment && "-"}
        </Box>
      </FieldValues>
    </FormDialog>
  )
}
