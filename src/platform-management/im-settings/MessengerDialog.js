import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Set, Card, Stack, Box, Dialog, useModalState, Alert } from "bumbag"
import { View, Update } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  Disclosure,
  AddIconDisclosure,
  ConfigIconDisclosure,
  DeleteIconDisclosure
} from "../../dialog/Disclosure"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import {
  useAddPlatformMessenger,
  useDeletePlatformMessenger,
  usePlatformMessengerList,
  useUpdatePlatformMessenger
} from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { MessengerTypeSelect, MessengerTypeLabel } from "./MessengerTypeSelect"
import { Input } from "../../input/Input"
import { PhoneInput } from "../../input/PhoneInput"
import Backdrop from "../../dialog/Backdrop"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import { ImageLinkButton } from "../../button/LinkButton"

export const MessengerDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure palette="primary" {...dialog} {...props}>
        <Trans zh="一般通訊軟體" en="Instant Messaging" />
      </Disclosure>
      {dialog.visible && (
        <InstantMessagingDialog brandId={brandId} dialog={dialog} />
      )}
    </>
  )
}

const InstantMessagingDialog = ({ brandId, dialog }) => {
  let title = useTrans({
    zh: "一般通訊軟體",
    en: "Instant Messaging"
  })

  let { isLoading, data, error, mutate, deleteCache } =
    usePlatformMessengerList(brandId)
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  let items = data ?? []
  return (
    <Dialog.Modal
      {...dialog}
      title={title}
      hideOnClickOutside={false}
      width="50vw"
      maxWidth="80vw"
      showCloseButton
    >
      <Stack>
        <TwoColumns>
          {items.map((item) => (
            <MessengerCard
              brandId={brandId}
              record={item}
              onSubmitted={mutate}
            />
          ))}
        </TwoColumns>
        <TwoColumns>
          <AddMessengerCard brandId={brandId} onSubmitted={mutate} />
        </TwoColumns>
      </Stack>
    </Dialog.Modal>
  )
}

const AddMessengerCard = ({ brandId, onSubmitted }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <Card alignX="center">
      <AddIconDisclosure
        id="add-instant-messaging-dialog-disclosure"
        {...dialog}
      />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </Card>
  )
}

const AddDialog = ({ brandId, dialog, onSubmitted, ...props }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPlatformMessenger(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        id="add-instant-messaging-dialog"
        defaultValues={{ brandId }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onSubmitted={onSubmitted}
        onCloseErrorAlert={reset}
        dialog={dialog}
        hideBackdrop={true}
      >
        <EditFormBody brandId={brandId} />
      </FormDialog>
    </Backdrop>
  )
}

const MessengerCard = ({ brandId, record, onSubmitted }) => {
  return (
    <Set orientation="horizontal">
      <Card flex="1">
        <FieldValues>
          <AppLabel />
          <Box alignY="center">
            <MessengerTypeLabel value={record?.type} />
          </Box>

          <PhoneLabel />
          <Box alignY="center">{record?.phone}</Box>

          <IdLabel />
          <Box>{record?.appId}</Box>

          <QRCodeLabel />
          <Box>
            <ImageLinkButton url={record?.qrCodeUrl} />
          </Box>
        </FieldValues>
      </Card>
      <Set orientation="horizontal" flex="0">
        <DeleteDialogDisclosure id={record?.id} onSubmitted={onSubmitted} />
        <EditDialogDisclosure record={record} onSubmitted={onSubmitted} />
      </Set>
    </Set>
  )
}

const DeleteDialogDisclosure = ({ id, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <DeleteIconDisclosure
        id="delete-instant-messaging-dialog-disclosure"
        {...dialog}
      />
      {dialog.visible && (
        <DeleteDialog id={id} onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const DeleteDialog = ({ id, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useDeletePlatformMessenger(formData)

  const onSubmit = () => {
    setSubmit(id)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        id="delete-instant-messaging-dialog"
        defaultValues={{ id }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onCloseErrorAlert={reset}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        dialog={dialog}
        hideBackdrop={true}
      >
        <DeleteFormBody />
      </FormDialog>
    </Backdrop>
  )
}

const DeleteFormBody = () => {
  return (
    <>
      <Alert
        title={<Trans zh={`确认删除`} en={`Confirm delete？`} />}
        type="warning"
        variant=""
      ></Alert>
      <Input type="hidden" name="id" />
    </>
  )
}

const EditDialogDisclosure = ({ brandId, record, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ConfigIconDisclosure
        id="edit-instant-messaging-dialog-disclosure"
        {...dialog}
        {...props}
      />
      {dialog.visible && (
        <EditDialog
          brandId={brandId}
          record={record}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const EditDialog = ({ brandId, record, dialog, onSubmitted, ...props }) => {
  let { id } = record
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformMessenger(id, formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        id="edit-instant-messaging-dialog"
        defaultValues={{ ...clone(record), brandId }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onSubmitted={onSubmitted}
        onCloseErrorAlert={reset}
        dialog={dialog}
        hideBackdrop={true}
      >
        <EditFormBody brandId={brandId} />
      </FormDialog>
    </Backdrop>
  )
}

const AppLabel = () => <Trans zh="通讯软体" en="App" />

const PhoneLabel = () => <Trans zh="手机号" en="Phone" />

const IdLabel = () => <Trans zh="ID" en="ID" />

const QRCodeLabel = () => <Trans zh="QR Code" en="QR Code" />

const EditFormBody = ({ brandId }) => {
  return (
    <>
      <Input type="hidden" name="brandId" />
      <Input type="hidden" name="id" />
      <FieldValues>
        <AppLabel />
        <MessengerTypeSelect name="type" required />

        <PhoneLabel />
        <PhoneInput name="phone" />

        <IdLabel />
        <Input name="appId" />

        <QRCodeLabel />
        <Box>
          <ImageUploadButton
            brandId={brandId}
            name="qrCodeUrl"
            label={<Trans zh="上传QR Code" en="Upload QR Code" />}
            prefix="messengerQRCode"
            showLocalizationAddonAfter={false}
          />
        </Box>
      </FieldValues>
    </>
  )
}
