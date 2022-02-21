import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Box,
  Text,
  Dialog,
  useModalState,
  FieldStack,
  Link,
  Button,
  Divider
} from "bumbag"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import Disclosure, { VerifyDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import Backdrop from "../../dialog/Backdrop"
import { Trans, useTrans } from "../../i18n"
import clone from "clone-deep"
import { FieldValues } from "../../layout/Grid"
import { usePlayer, usePlayerIdentity, useVerifyPlayerID } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Textarea, { TextareaField } from "../../textarea"
import Separator from "../../layout/Separator"

export const ReviewPlayerIdDialogDisclosure = ({
  playerCode,
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <VerifyDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <PlayerDialog
          playerCode={playerCode}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const PlayerDialog = ({ playerCode, dialog, ...props }) => {
  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerIdentity(playerCode)

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
  let defaultValues = clone(record)
  let formMethods = useForm({ defaultValues })
  let { setValue } = formMethods

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useVerifyPlayerID(
    record.formId,
    formData
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "身分证审核",
    en: "ID Verification"
  })

  let hasAttchment = !!record?.attachmentUrl
  return (
    <FormDialog
      id="review-player-id-dialog"
      formMethods={formMethods}
      onSubmit={onSubmit}
      actionButtonsProps={{
        submitProps: {
          "data-type": "approve"
        }
      }}
      onClickSubmit={(event) => {
        //TODO: backend api field name
        setValue("reviewResponse", "Approve")
      }}
      addonButtons={
        <Button
          type="submit"
          data-type="reject"
          onClick={() => {
            //TODO: backend api field name
            setValue("reviewResponse", "Reject")
          }}
          palette="danger"
          variant="outlined"
        >
          <Trans zh="拒绝" en="Reject" />
        </Button>
      }
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      title={title}
      dialog={dialog}
      {...props}
    >
      <FieldStack>
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
        <Divider />
        <TextareaField name="remark" label={<Trans zh="备注" en="Remark" />} />
      </FieldStack>
    </FormDialog>
  )
}
