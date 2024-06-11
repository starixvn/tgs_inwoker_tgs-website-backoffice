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
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useFormContext, useWatch, useFieldArray } from "react-hook-form"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import { DomainListDialog } from "../../dialog/DomainListDialog"

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
  let editable = useIsDisplayMenuByRoute([Update])
  let readOnly = !editable

  let { isLoading, data: record, error, mutate } = useBrand(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  const onSubmit = (domains) => {
    let currencyCodes = (record?.currencies ?? []).map(({ code }) => code)
    let result = { ...record, domains, currencyCodes }
    return result
  }

  const reset = () => {
    mutate(undefined, false)
  }

  return (
    <DomainListDialog
      domains={record.domains}
      readOnly={readOnly}
      onSubmit={onSubmit}
      useFetch={(formData) => useUpdateBrand(brandId, formData)}
      onSubmitted={reset}
      dialog={dialog}
      {...props}
    />
  )
}
