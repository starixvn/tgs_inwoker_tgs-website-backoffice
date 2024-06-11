import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, FieldStack, Set, Alert, Box, Columns } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import { DeleteDisclosure } from "../../dialog/Disclosure"
import { DeleteTrans, useDeleteTrans } from "../../trans/Action"
import { Trans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import Backdrop from "../../dialog/Backdrop"
import { SWRConfig } from "swr"

export const DeleteSmsDialogDisclosure = ({
  name,
  smsSettingId,
  useDelete,
  onSubmitted,
  id,
  dialogId = "delete-sms-dialog"
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <DeleteDisclosure {...dialog} />
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <DeleteSmsDialog
            name={name}
            smsSettingId={smsSettingId}
            useDelete={useDelete}
            dialog={dialog}
            dialogId={dialogId}
            onSubmitted={onSubmitted}
          />
        </SWRConfig>
      )}
    </>
  )
}

const DeleteSmsDialog = ({
  name,
  smsSettingId,
  useDelete,
  dialog,
  dialogId,
  onSubmitted
}) => {
  let title = useDeleteTrans()
  let [deleteId, setDeleteId] = useState()
  let { isLoading, result, error, mutate } = useDelete(deleteId)

  const onSubmit = () => {
    setDeleteId(smsSettingId)
  }

  const reset = () => {
    mutate(undefined, false)
    setDeleteId(null)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onCloseErrorAlert={reset}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        submitText={<DeleteTrans />}
        title={title}
        dialog={dialog}
        hideBackdrop
        id={dialogId}
        actionButtonsProps={{
          submitProps: {
            palette: "danger",
            variant: "outlined"
          }
        }}
      >
        <Alert
          title={
            <Trans
              zh={`确认删除 “${name}”`}
              en={`Confirm delete the “${name}”？`}
            />
          }
          type="warning"
          variant=""
        />
      </FormDialog>
    </Backdrop>
  )
}
