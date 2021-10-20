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
import { useBrand, useUpdateBrand } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { useFormContext, useWatch, useFieldArray } from "react-hook-form"

export const PlatformDomainDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let readable = useIsDisplayMenuByRoute([View])
  if (!readable) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="域名" en="Domain" />
      </Disclosure>
      {dialog.visible && (
        <LoadingViewOrEditDialog brandId={brandId} dialog={dialog} />
      )}
    </>
  )
}

const LoadingViewOrEditDialog = ({ brandId, dialog, ...props }) => {
  let { isLoading, data: brand, error, mutate, deleteCache } = useBrand(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={deleteCache} />
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
  }

  return (
    <ViewOrEditDialog
      brandId={brandId}
      record={record}
      onSubmitted={reset}
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
    zh: "域名",
    en: "Domain"
  })

  let { domains = [] } = record
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useUpdateBrand(
    brandId,
    formData
  )

  const onSubmit = ({ domains: [] }) => {
    setSubmit({
      ...record,
      domains
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{ domains: clone(domains) }}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      onClickClose={reset}
      dialog={dialog}
      title={title}
      showActionButtons={readOnly ? false : true}
      footer={readOnly ? <CloseButtonFooter alignX="right" /> : null}
    >
      <FormBody />
    </FormDialog>
  )
}

const DomainFieldArrayName = "domains"
const FormBody = ({ readOnly }) => {
  let { control } = useFormContext()
  let fieldArray = useFieldArray({
    name: DomainFieldArrayName,
    control,
    keyName: "_id"
  })

  return (
    <FieldStack>
      {fieldArray.fields.map((field, index) => (
        <DomainInputField
          key={field._id}
          field={field}
          index={index}
          fieldArray={fieldArray}
          readOnly={readOnly}
        />
      ))}
      {readOnly && !fieldArray.fields.length && (
        <Trans zh="无资料" en="No Data" />
      )}
    </FieldStack>
  )
}

const DomainInputField = ({ field, index, fieldArray, readOnly, ...props }) => {
  return <InputField name={`${DomainFieldArrayName}.${index}`} />
}
