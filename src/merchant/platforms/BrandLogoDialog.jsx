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
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { useBrandLogo, useUpdateBrandLogo } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { useFormContext, useWatch } from "react-hook-form"

export const BrandLogoDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let readable = useIsDisplayMenuByRoute([View])
  if (!readable) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="Logo" en="Logo" />
      </Disclosure>
      {dialog.visible && (
        <LoadingViewOrEditDialog brandId={brandId} dialog={dialog} />
      )}
    </>
  )
}

const LoadingViewOrEditDialog = ({ brandId, dialog, ...props }) => {
  let { isLoading, data: record, error, deleteCache } = useBrandLogo(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={deleteCache} />
  }

  return (
    <ViewOrEditDialog
      brandId={brandId}
      record={record}
      onSubmitted={deleteCache}
      dialog={dialog}
      {...props}
    />
  )
}

const ViewOrEditDialog = ({
  brandId,
  record = {},
  dialog,
  onSubmitted,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])
  let readOnly = !editable

  let title = useTrans({
    zh: "Logo 管理",
    en: "Logo Management"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } = useUpdateBrandLogo(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      id="platform-logo-dialog"
      defaultValues={{ ...clone(record), brandId }}
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
      title={title}
      showActionButtons={readOnly ? false : true}
      footer={
        readOnly ? <CloseButtonFooter alignX="right" dialog={dialog} /> : null
      }
      minWidth="40vw"
      maxWidth="70vw"
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ readOnly }) => {
  let { control } = useFormContext()

  let MobileField = "mobile"
  let mobile = useWatch({
    control,
    name: MobileField
  })

  let DesktopField = "desktop"
  let desktop = useWatch({
    control,
    name: DesktopField
  })

  let LoadingField = "loading"
  let loadingIconUrl = useWatch({
    control,
    name: LoadingField
  })
  return (
    <FieldStack>
      <InputField
        name="mobile"
        readOnly={readOnly}
        label={<Trans zh="手机版 Logo" en="Mobile Logo" />}
        showEmptyFieldValueAddonAfter
      />
      <InputField
        name={DesktopField}
        readOnly={readOnly}
        label={<Trans zh="桌面版 Logo" en="Desktop Logo" />}
        showEmptyFieldValueAddonAfter
      />
      <InputField
        name={LoadingField}
        readOnly={readOnly}
        label={<Trans zh="Loading Logo" en="Loading Logo" />}
        showEmptyFieldValueAddonAfter
      />
    </FieldStack>
  )
}
