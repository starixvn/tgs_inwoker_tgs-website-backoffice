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
import { Disclosure } from "../../dialog/Disclosure"
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
import BrandIdSelect from "../platforms/BrandIdSelect"
import { TimeInput } from "../../date/TimeInput"
import { useUpdateMaintenance } from "./client"

export const MaintenanceTimeRangeDialogDisclosure = ({
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
      <Disclosure {...dialog} {...props}>
        <Trans zh="Maintenance" en="Maintenance" />
      </Disclosure>
      {dialog.visible && (
        <TimeRangeDialog onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const TimeRangeDialog = ({ dialog, onSubmitted, ...props }) => {
  let title = useTrans({
    zh: "维护时间",
    en: "Maintenance Time"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateMaintenance(formData)

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  return (
    <FormDialog
      defaultValues={{
        brandIds: [],
        beginTime: null,
        endTime: null
      }}
      onSubmit={({ brandId, ...data }) => {
        let form = {
          ...data,
          brandIds: [brandId]
        }
        setSubmit(form)
      }}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      {...props}
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({}) => {
  return (
    <FieldStack orientation="vertical">
      <BrandIdSelect name="brandId" />
      <FieldWrapper>
        <TimeInput name="beginTime" />
      </FieldWrapper>
      <FieldWrapper>
        <TimeInput name="endTime" />
      </FieldWrapper>
    </FieldStack>
  )
}
