import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Set,
  Card,
  Stack,
  Box,
  Dialog,
  useModalState,
  Alert,
  FieldStack
} from "bumbag"
import { ViewLiveChat, UpdateLiveChat } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import {
  useAddPlatformLiveChat,
  usePlatformLiveChat,
  useUpdatePlatformLiveChat
} from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { MessengerTypeSelect, MessengerTypeLabel } from "./MessengerTypeSelect"
import { Input, InputField } from "../../input/Input"
import { PhoneInput } from "../../input/PhoneInput"
import Backdrop from "../../dialog/Backdrop"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import { ImageLinkButton } from "../../button/LinkButton"
import { LiveChatTypeSelect } from "./LiveChatType"
import { JavaScriptEditor } from "../../text/editor/JavaScriptEditor"
import { useFormContext, useWatch } from "react-hook-form"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { TextareaField } from "../../textarea"
import { JsonEditor } from "../../text/editor/JsonEditor"

export const EditLiveChatDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewLiveChat])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure palette="primary" {...dialog} {...props}>
        <Trans zh="即时客服厂商" en="Live Chat Service Provider" />
      </Disclosure>
      {dialog.visible && <LiveChatDialog brandId={brandId} dialog={dialog} />}
    </>
  )
}

const LiveChatDialog = ({ brandId, dialog }) => {
  let readOnly = !useIsDisplayMenuByRoute([UpdateLiveChat])
  console.log("readOnly", readOnly)

  let title = useTrans({
    zh: "即时客服厂商",
    en: "Live Chat Service Provider"
  })

  let {
    isLoading: isLoadingLiveChat,
    data,
    error: liveChatError,
    mutate: mutateLiveChat,
    deleteCache: deleteLiveChatCache
  } = usePlatformLiveChat(brandId)

  let [isAdd, setAdd] = useState(true)

  //TODO: seprate two component
  useEffect(() => {
    console.log("isLoadingLiveChat", data)
    setAdd(data?.setting ? false : true)
  }, [data, isLoadingLiveChat])

  let [addFormData, setAddFormData] = useState()
  let [updateFormData, setUpdateFormData] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformLiveChat(brandId, updateFormData)

  if (isLoadingLiveChat) {
    return <LoadingBackdrop {...dialog} />
  }

  if (liveChatError) {
    return <AlertDialog {...liveChatError} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    if (isAdd) {
      setAddFormData(data)
    } else {
      setUpdateFormData(data)
    }
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setUpdateFormData(undefined)
  }

  return (
    <FormDialog
      defaultValues={clone(data)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      onSubmitted={dialog.hide}
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
