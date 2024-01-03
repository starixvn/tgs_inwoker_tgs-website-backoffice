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
  Spinner,
  FieldWrapper
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
import {
  ThirdPartyLiveChatProviderTrans,
  useThirdPartyLiveChatProviderTrans
} from "../../trans/Platform"

export const CreateOrEditLiveChatDialogDisclosure = ({ brandId, ...props }) => {
  let addDialog = useModalState()
  let updateDialog = useModalState()
  let deleteDialog = useModalState()

  let { isLoading, data, error, mutate, deleteCache } =
    usePlatformLiveChat(brandId)

  let record = data?.data
  let hasLiveChat = !!(!isLoading && record)

  let isDisplay = useIsDisplayMenuByRoute([ViewLiveChat])
  let editable = useIsDisplayMenuByRoute([UpdateLiveChat])
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
            <Disclosure {...addDialog} {...props}>
              <ThirdPartyLiveChatProviderTrans />
            </Disclosure>
          )}
          {hasLiveChat && !editable && (
            <Disclosure {...updateDialog} {...props}>
              <ThirdPartyLiveChatProviderTrans />
            </Disclosure>
          )}
          {hasLiveChat && editable && (
            <Group>
              <Disclosure {...updateDialog} {...props}>
                <ThirdPartyLiveChatProviderTrans />
              </Disclosure>
              <Disclosure
                id="delete-live-chat-dialog-disclosure"
                color="danger"
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
      id="delete-live-chat-dialog"
      defaultValues={{ brandId }}
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
      <ConfirmDeleteFormBody />
    </FormDialog>
  )
}

const ConfirmDeleteFormBody = () => {
  let { getValues } = useFormContext()
  let BrandIdField = "brandId"
  let brandId = getValues("brandId")
  return (
    <>
      <Alert
        title={<Trans zh={`确认删除`} en={`Confirm delete？`} />}
        type="warning"
        variant=""
      ></Alert>
      <Input type="hidden" name={BrandIdField} value={brandId} />
    </>
  )
}

const AddLiveChatDialog = ({ brandId, dialog, onSubmitted }) => {
  let readOnly = !useIsDisplayMenuByRoute([UpdateLiveChat])

  let title = useThirdPartyLiveChatProviderTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPlatformLiveChat(formData)

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
      id="add-live-chat-dialog"
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
      footer={
        readOnly ? <CloseButtonFooter alignX="right" dialog={dialog} /> : null
      }
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const EditLiveChatDialog = ({ brandId, record, dialog, onSubmitted }) => {
  let readOnly = !useIsDisplayMenuByRoute([UpdateLiveChat])

  let title = useThirdPartyLiveChatProviderTrans()

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
      id="edit-live-chat-dialog"
      defaultValues={{
        ...clone(record),
        brandId,
        setting: stringifyJSON(record?.setting)
      }}
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
      footer={
        readOnly ? <CloseButtonFooter alignX="right" dialog={dialog} /> : null
      }
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ readOnly }) => {
  let { getValues } = useFormContext()
  let BrandIdField = "brandId"
  let brandId = getValues("brandId")
  return (
    <>
      <FieldStack>
        <InputField
          name="name"
          readOnly={readOnly}
          label={<Trans zh="名称" en="Name" />}
        />
        <FieldWrapper label={<Trans zh="设定" en="Setting" />}>
          <JsonEditor
            name="setting"
            height="40vh"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </FieldWrapper>
      </FieldStack>
      <Input type="hidden" name={BrandIdField} value={brandId} />
    </>
  )
}
