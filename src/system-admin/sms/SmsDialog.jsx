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
import { useAddSms, useUpdateSms } from "../../sms/client"
import { AddTrans, useAddTrans, useEditTrans } from "../../trans/Action"
import clone from "clone-deep"
import { stringifyJSON } from "../../text/json"
import Backdrop from "../../dialog/Backdrop"
import { SMSProviderCodeTrans, SMSProviderNameTrans } from "../../trans/Sms"

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
      <Disclosure id={id} {...dialog}>
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
    <Backdrop {...dialog}>
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
        hideBackdrop
        id={dialogId}
        title={add}
        css={css`
          min-width: 50vw;
        `}
      >
        <FormBody />
      </FormDialog>
    </Backdrop>
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

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

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
    <Backdrop {...dialog}>
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
        hideBackdrop
        id={dialogId}
        title={edit}
        css={css`
          min-width: 50vw;
        `}
      >
        <FormBody />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = ({ readOnly }) => {
  return (
    <Columns>
      <Columns.Column>
        <FieldStack>
          <InputField name="name" label={<SMSProviderNameTrans />} required />
          <InputField name="code" label={<SMSProviderCodeTrans />} required />
        </FieldStack>
      </Columns.Column>
      <Columns.Column>
        <JsonEditor
          name="setting"
          height="40vh"
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
      </Columns.Column>
    </Columns>
  )
}
