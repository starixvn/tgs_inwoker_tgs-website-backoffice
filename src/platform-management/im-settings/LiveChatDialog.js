import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Set,
  Card,
  Stack,
  Box,
  Text,
  Dialog,
  Icon,
  useModalState,
  Alert,
  FieldStack,
  Group,
  Spinner
} from "bumbag"
import { ViewLiveChat, UpdateLiveChat } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure, DeleteDisclosure } from "../../dialog/Disclosure"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import {
  useAddPlatformLiveChat,
  usePlatformLiveChat,
  useUpdatePlatformLiveChat,
  useDeletePlatformLiveChat
} from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { Input, InputField } from "../../input/Input"
import Backdrop from "../../dialog/Backdrop"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import { ImageLinkButton } from "../../button/LinkButton"
import { useFormContext, useWatch } from "react-hook-form"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { JsonEditor } from "../../text/editor/JsonEditor"
import { stringifyJSON } from "../../text/json"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export const CreateOrEditLiveChatDialogDisclosure = ({ brandId, ...props }) => {
  let addDialog = useModalState()
  let updateDialog = useModalState()
  let deleteDialog = useModalState()

  let { isLoading, data, error, mutate, deleteCache } =
    usePlatformLiveChat(brandId)

  let record = data?.data
  let hasLiveChat = !!(!isLoading && record)

  let isDisplay = useIsDisplayMenuByRoute([ViewLiveChat])
  if (!isDisplay) {
    return null
  }

  const onSubmitted = (record) => {
    deleteCache()
    mutate(record)
  }

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          {!hasLiveChat && (
            <Disclosure
              palette="primary"
              isLoading={isLoading}
              disabled={isLoading}
              {...addDialog}
              {...props}
            >
              <Trans zh="即时客服厂商" en="Live Chat Service Provider" />
            </Disclosure>
          )}
          {hasLiveChat && (
            <Group>
              <Disclosure
                palette="primary"
                isLoading={isLoading}
                disabled={isLoading}
                {...updateDialog}
                {...props}
              >
                <Trans zh="即时客服厂商" en="Live Chat Service Provider" />
              </Disclosure>
              <Disclosure
                color="danger"
                isLoading={isLoading}
                {...deleteDialog}
              >
                <Icon icon={faTimes} type="font-awesome" />
              </Disclosure>
            </Group>
          )}
        </>
      )}
      {addDialog.visible && (
        <AddLiveChatDialog
          brandId={brandId}
          dialog={addDialog}
          onSubmitted={onSubmitted}
        />
      )}
      {updateDialog.visible && (
        <EditLiveChatDialog
          brandId={brandId}
          record={record}
          dialog={updateDialog}
          onSubmitted={onSubmitted}
        />
      )}
      {deleteDialog.visible && (
        <DeleteDialog
          brandId={brandId}
          dialog={deleteDialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const DeleteDialog = ({ brandId, dialog, onSubmitted }) => {
  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } =
    useDeletePlatformLiveChat(formData)

  const onSubmit = () => {
    reset()

    setSubmit(brandId)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        onSubmitted?.(undefined)

        reset()
      }}
      dialog={dialog}
    >
      <Alert
        title={<Trans zh={`确认删除`} en={`Confirm delete？`} />}
        type="warning"
        variant=""
      ></Alert>
    </FormDialog>
  )
}

const AddLiveChatDialog = ({ brandId, dialog, onSubmitted }) => {
  let readOnly = !useIsDisplayMenuByRoute([UpdateLiveChat])

  let title = useTrans({
    zh: "新增即时客服厂商",
    en: "Add Live Chat Service Provider"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPlatformLiveChat(formData)

  const onSubmit = (data) => {
    setSubmit({ brandId, ...data })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{ brandId, setting: stringifyJSON({}) }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={() => {
        onSubmitted?.(formData)

        reset()
      }}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      width="60vw"
      maxWidth="80vw"
      showActionButtons={readOnly ? false : true}
      footer={readOnly ? <CloseButtonFooter alignX="right" /> : null}
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const EditLiveChatDialog = ({ brandId, record, dialog, onSubmitted }) => {
  let readOnly = !useIsDisplayMenuByRoute([UpdateLiveChat])

  let title = useTrans({
    zh: "即时客服厂商",
    en: "Live Chat Service Provider"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformLiveChat(brandId, formData)

  const onSubmit = (data) => {
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
        ...clone(record),
        setting: stringifyJSON(record?.setting)
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={() => {
        console.log("onSubmitted formData", formData)
        onSubmitted?.(formData)

        reset()
      }}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      width="60vw"
      maxWidth="80vw"
      showActionButtons={readOnly ? false : true}
      footer={readOnly ? <CloseButtonFooter alignX="right" /> : null}
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ readOnly }) => {
  return (
    <FieldStack>
      <InputField name="name" readOnly={readOnly} />
      <JsonEditor
        name="setting"
        height="40vh"
        readOnly={readOnly}
        disabled={readOnly}
      />
    </FieldStack>
  )
}
