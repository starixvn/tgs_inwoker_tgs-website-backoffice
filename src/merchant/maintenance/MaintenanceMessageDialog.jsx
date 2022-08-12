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

export const ViewMaintenanceMessageDisclosure = ({
  brandMaintenanceId,
  dialogId,
  ...props
}) => {
  let dialog = useModalState()

  let readable = useIsDisplayMenuByRoute([View])
  if (!readable) {
    return null
  }

  return (
    <>
      <ViewDisclosure id={`${dialogId}-disclosure`} {...dialog} />
      {dialog.visible && (
        <MaintenanceMessageFormDialog
          brandMaintenanceId={brandMaintenanceId}
          dialogId={dialogId}
          readOnly
          dialog={dialog}
        />
      )}
    </>
  )
}

export const EditMaintenanceMessageDisclosure = ({
  brandMaintenanceId,
  onSubmitted,
  dialogId,
  ...props
}) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <EditDisclosure id={`${dialogId}-disclosure`} {...dialog} />
      {dialog.visible && (
        <MaintenanceMessageFormDialog
          brandMaintenanceId={brandMaintenanceId}
          dialogId={dialogId}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const MaintenanceMessageFormDialog = ({
  brandMaintenanceId,
  dialog,
  readOnly,
  onSubmitted,
  dialogId,
  ...props
}) => {
  let {
    isLoading: isLoadingMessage,
    error: messageError,
    data: record,
    mutate: mutateMessage,
    deleteCache: deleteMessageCache
  } = useMaintenanceMessage(brandMaintenanceId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateMaintenanceMessage(brandMaintenanceId, formData)

  let title = useTrans({
    zh: "公告内容",
    en: "Content"
  })

  const reset = () => {
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
      id={dialogId}
      showActionButtons={editable}
      footer={readOnly && <CloseButtonFooter dialog={dialog} alignX="right" />}
      {...props}
    >
      <FormBody readOnly={readOnly} message={record?.content} />
    </FormDialog>
  )
}

const MinHeight = "35vh"
const MinWidth = "35vw"

const FormBody = ({ readOnly = false, message = "" }) => {
  let { getValues } = useFormContext()
  let ContentField = "content"

  let editable = !readOnly
  return (
    <FieldStack height="100%">
      {readOnly && (
        <Blockquote
          id={ContentField}
          minWidth={MinWidth}
          minHeight={MinHeight}
          whiteSpace="pre-wrap"
        >
          {message}
        </Blockquote>
      )}
      {editable && (
        <TextareaField
          name={ContentField}
          readOnly={readOnly}
          minWidth={MinWidth}
          minHeight={MinHeight}
          css={css`
            min-height: ${MinHeight};

            & .bb-FieldWrapper,
            & .bb-TextareaWrapper,
            & .bb-Textarea {
              min-height: ${MinHeight};
            }
          `}
        />
      )}
    </FieldStack>
  )
}
