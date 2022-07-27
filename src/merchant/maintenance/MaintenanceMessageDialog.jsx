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
  FieldWrapper
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

export const ViewMaintenanceMessageDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let readable = useIsDisplayMenuByRoute([View])
  if (!readable) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} />
      {dialog.visible && (
        <MaintenanceMessageFormDialog
          brandId={brandId}
          readOnly
          dialog={dialog}
        />
      )}
    </>
  )
}

export const EditMaintenanceMessageDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} />
      {dialog.visible && (
        <MaintenanceMessageFormDialog brandId={brandId} dialog={dialog} />
      )}
    </>
  )
}

const MaintenanceMessageFormDialog = ({ brandId, dialog, ...props }) => {
  let title = useTrans({
    zh: "公告内容",
    en: "Content"
  })

  //1. load 預設維護內容

  return <FieldStack>
    <TextareaField />
  </FieldStack>
}

const FormBody = ({ readOnly = false }) => {
  let editable = !readOnly
}
