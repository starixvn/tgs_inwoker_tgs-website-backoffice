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
import { ViewAllAgent, UpdateAllAgent } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure, DeleteDisclosure } from "../../dialog/Disclosure"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { FieldValues, TwoColumns } from "../../layout/Grid"
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
import { useAllAgentSetting } from "../../agent/all-agent/client"

export const AllAgentDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewAllAgent])
  let editable = useIsDisplayMenuByRoute([UpdateAllAgent])
  if (!isDisplay) {
    return null
  }

  let readOnly = !editable
  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="全民代理设定" en="All Agent Setting" />
      </Disclosure>
      {dialog.visible && (
        <AllAgentDialog brandId={brandId} readOnly={readOnly} dialog={dialog} />
      )}
    </>
  )
}

const AllAgentDialog = ({ brandId, readOnly, dialog, ...props }) => {
  let { isLoading, data, error, mutate, deleteCache } =
    useAllAgentSetting(brandId)

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.close} />
  }

  return (
    <AllAgentSettingDialog
      brandId={brandId}
      record={data}
      dialog={dialog}
      onSubmitted={reset}
      dialog={dialog}
      {...props}
    />
  )
}

const AllAgentSettingDialog = ({ brandId, record, onSubmitted, dialog }) => {
  let title = useTrans({
    zh: "全民代理",
    en: "All Agent"
  })

  return (
    <Dialog.Modal
      title={title}
      showCloseButton
      hideOnClickOutside={false}
      {...dialog}
    >
      <DialogBody />
    </Dialog.Modal>
  )
}

const DialogBody = ({ brandId, onSubmitted }) => {
  return "TODO: form body"
}
