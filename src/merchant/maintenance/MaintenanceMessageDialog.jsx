import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Spinner,
  FieldWrapper,
  Blockquote
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  Disclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { useFormContext, useWatch } from "react-hook-form"
import head from "../../list/head"
import { HtmlEditor } from "../../text/editor/HtmlEditor"
import { useBrandLanguageCodes } from "../../dialog/LocalizationDialog"
import Backdrop from "../../dialog/Backdrop"
import { useMaintenanceMessage, useUpdateMaintenanceMessage } from "./client"
import { TextareaField } from "../../textarea"

export const ViewMaintenanceMessageDisclosure = ({ id, ...props }) => {
  let dialog = useModalState()

  let readable = useIsDisplayMenuByRoute([View])
  if (!readable) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} />
      {dialog.visible && (
        <MaintenanceMessageFormDialog id={id} readOnly dialog={dialog} />
      )}
    </>
  )
}

export const EditMaintenanceMessageDisclosure = ({
  id,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} />
      {dialog.visible && (
        <MaintenanceMessageFormDialog
          id={id}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const MaintenanceMessageFormDialog = ({
  id,
  dialog,
  readOnly,
  onSubmitted,
  ...props
}) => {
  let {
    isLoading: isLoadingMessage,
    error: messageError,
    data: record,
    mutate: mutateMessage,
    deleteCache: deleteMessageCache
  } = useMaintenanceMessage(id)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateMaintenanceMessage(id, formData)

  let title = useTrans({
    zh: "公告内容",
    en: "Content"
  })

  const reset = () => {
    deleteMessageCache()
    mutateMessage(null, false)

    deleteCache()
    mutate(null, false)
    setSubmit(null)
  }

  if (isLoadingMessage) {
    return <LoadingBackdrop {...dialog} />
  }

  if (messageError) {
    return (
      <AlertDialog
        {...error}
        onClickClose={() => {
          reset()
          dialog.hide()
        }}
      />
    )
  }

  let editable = !readOnly
  return (
    <FormDialog
      defaultValues={clone(record)}
      onSubmit={(data) => {
        setSubmit(data)
      }}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
      showActionButtons={editable}
      footer={readOnly && <CloseButtonFooter dialog={dialog} alignX="right" />}
      {...props}
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ readOnly = false }) => {
  let { getValues } = useFormContext()
  let ContentField = "content"

  let editable = !readOnly
  return (
    <FieldStack>
      {readOnly && (
        <Blockquote whiteSpace="pre-wrap">{getValues(ContentField)}</Blockquote>
      )}
      {editable && <TextareaField name={ContentField} readOnly={readOnly} />}
    </FieldStack>
  )
}
