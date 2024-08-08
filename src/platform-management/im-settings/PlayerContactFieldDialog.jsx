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
  DropdownMenu,
  Group,
  FieldStack,
  SwitchGroup
} from "bumbag"
import {
  View,
  Update,
  ViewPlayerContactField,
  UpdatePlayerContactField
} from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  AddDisclosure,
  DeleteDisclosure,
  Disclosure
} from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import { SWRConfig } from "swr"
import { ContactInfoTrans, useContactInfoTrans } from "../../trans/User"
import { useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Modal from "../../dialog/Modal"
import {
  usePlatformPlayerContactFieldList,
  usePlayerContactFieldList,
  useUpdatePlatformPlayerContactFieldList
} from "./client"
import Switch from "../../switch/Switch"
import { TwoColumns } from "../../layout/Grid"
import { useFormContext, useWatch } from "react-hook-form"

export const PlayerContactFieldDialogDisclosure = ({
  brandId,
  id,
  dialogId = "player-contact-field-dialog",
  ...props
}) => {
  let dialog = useModalState()
  let {
    isLoading,
    data: playerContactFields,
    error
  } = usePlayerContactFieldList()
  //TODO: error > alert dialog & disable btn

  let viewAuth = useIsDisplayMenuByRoute([ViewPlayerContactField])
  let editable = useIsDisplayMenuByRoute([UpdatePlayerContactField])
  let readOnly = !editable
  if (!viewAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure
        id={id}
        isLoading={isLoading}
        disabled={isLoading || error}
        {...dialog}
        {...props}
      >
        <ContactInfoTrans />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <FetchDialog
            brandId={brandId}
            playerContactFields={playerContactFields}
            readOnly={readOnly}
            dialog={dialog}
            dialogId={dialogId}
          />
        </SWRConfig>
      )}
      {error && <AlertDialog {...error} />}
    </>
  )
}

const FetchDialog = ({ brandId, dialog, ...props }) => {
  let {
    isLoading,
    data: record,
    error
  } = usePlatformPlayerContactFieldList(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <SettingDialog
      brandId={brandId}
      record={record}
      dialog={dialog}
      {...props}
    />
  )
}

const ContactFieldsName = "contacts"

const SettingDialog = ({
  brandId,
  playerContactFields = [],
  record = [],
  dialog,
  dialogId,
  ...props
}) => {
  let title = useContactInfoTrans()
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } =
    useUpdatePlatformPlayerContactFieldList(brandId, formData)

  //TODO: move to a fn?
  let defaultValues = {}
  Reflect.set(
    defaultValues,
    ContactFieldsName,
    Object.fromEntries(
      playerContactFields.map((field) => {
        let setting = record.find((item) => item.name === field)
        let visible = setting?.isVisualized ?? false
        return [field, visible]
      })
    )
  )

  const onSubmit = (data) => {
    let formData = Reflect.get(data, ContactFieldsName)
    setSubmit(formData)
  }

  const reset = () => {
    setSubmit(null)
    mutate(undefined, false)
  }

  return (
    <FormDialog
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      id={dialogId}
      {...props}
    >
      <Stack>
        <Info />
        <TwoColumns>
          <ContactFieldSelectGroup items={playerContactFields} />
        </TwoColumns>
      </Stack>
    </FormDialog>
  )
}

const MaxContactFieldSize = 3
const ContactFieldSelectGroup = ({
  name = ContactFieldsName,
  max = MaxContactFieldSize,
  items = []
}) => {
  let { control } = useFormContext()

  let fields = useWatch({
    control,
    name
  })

  let selectedSize = Object.entries(fields).reduce((size, [_, selected]) => {
    return selected ? size + 1 : size
  }, 0)

  return items.map((field) => {
    let selected = Reflect.get(fields, field)
    let disabled = !(selectedSize < max || selected)
    return (
      <Switch
        key={field}
        name={`${ContactFieldsName}.${field}`}
        label={field}
        disabled={disabled}
      />
    )
  })
}

const Info = () => {
  let title = useTrans({
    en: "Select up to 3 types",
    zh: "聯繫信息最多選取3種",
    vi: "chọn tối đa 3 loại"
  })
  return <Alert title={title} variant="bordered" />
}
