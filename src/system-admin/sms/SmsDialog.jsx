import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, FieldStack, Set, Icon, Box, Columns } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import { Disclosure, EditDisclosure } from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { FormDialog } from "../../form/FormDialog"
import { InputField } from "../../input/Input"
import { JsonEditor } from "../../text/editor/JsonEditor"
import { useAddSms, useUpdateSms } from "./client"
import { AddTrans, useAddTrans, useEditTrans } from "../../trans/Action"
import clone from "clone-deep"
import { stringifyJSON } from "../../text/json"

export const AddSmsDialogDisclosure = ({
  onSubmitted,
  id,
  dialogId = "add-sms-dialog"
}) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure {...dialog}>
        <AddTrans />
      </Disclosure>
      {dialog.visible && (
        <AddSmsDialog
          dialog={dialog}
          dialogId={dialogId}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const AddSmsDialog = ({ onSubmitted, dialog, dialogId }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useAddSms(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    mutate(undefined, false)
    setSubmit(null)
  }

  let add = useAddTrans()
  return (
    <FormDialog
      defaultValues={{
        name: "",
        code: "",
        setting: ""
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      id={dialogId}
      title={add}
    >
      <FormBody />
    </FormDialog>
  )
}

export const UpdateSmsDialogDisclosure = ({
  smsSettingId,
  record,
  onSubmitted,
  id,
  dialogId = "update-sms-dialog"
}) => {
  let dialog = useModalState()

  //TODO: readOnly auth

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)

  return (
    <>
      <EditDisclosure {...dialog} />
      {dialog.visible && (
        <UpdateSmsDialog
          smsSettingId={smsSettingId}
          record={record}
          dialog={dialog}
          dialogId={dialogId}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

//TODO: need ViewSmsDialog?
const UpdateSmsDialog = ({
  smsSettingId,
  record = {},
  onSubmitted,
  dialog,
  dialogId
}) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useUpdateSms(
    smsSettingId,
    formData
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    mutate(undefined, false)
    setSubmit(null)
  }

  let edit = useEditTrans()
  return (
    <FormDialog
      defaultValues={{
        ...clone(record),
        setting: stringifyJSON(record.setting)
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      id={dialogId}
      title={edit}
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({ readOnly }) => {
  return (
    <FieldStack>
      <FieldStack orientation="horizontal">
        <InputField name="name" label="Name" />
        <InputField name="code" label="Code" />
      </FieldStack>
      <JsonEditor
        name="setting"
        height="40vh"
        readOnly={readOnly}
        disabled={readOnly}
      />
    </FieldStack>
  )
}
