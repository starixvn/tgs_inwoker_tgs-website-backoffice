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
import { Disclosure } from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import { SWRConfig } from "swr"
import {
  ContactInfoTrans,
  useContactInfoTrans,
  useLineTrans,
  useMessengerTrans,
  useQQTrans,
  useTelegramTrans,
  useViberTrans,
  useWeChatTrans,
  useWhatsAppTrans,
  useZaloTrans
} from "../../trans/User"
import { useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
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
  readOnly,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useContactInfoTrans()
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } =
    useUpdatePlatformPlayerContactFieldList(brandId, formData)

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
      showActionButtons={readOnly ? false : true}
      id={dialogId}
      {...props}
    >
      <Stack>
        <Info />
        <TwoColumns>
          <ContactFieldSelectGroup
            items={playerContactFields}
            readOnly={readOnly}
          />
        </TwoColumns>
      </Stack>
    </FormDialog>
  )
}

const Contact = {
  Line: "Line",
  Viber: "Viber",
  Telegram: "Telegram",
  FacebookMessenger: "FacebookMessenger",
  WhatsApp: "WhatsApp",
  Qq: "Qq",
  Wechat: "Wechat",
  Zalo: "Zalo"
}

const useContactLabel = (field = "") => {
  switch (field) {
    case Contact.Line:
      return useLineTrans()
    case Contact.Viber:
      return useViberTrans()
    case Contact.Telegram:
      return useTelegramTrans()
    case Contact.FacebookMessenger:
      return useMessengerTrans()
    case Contact.WhatsApp:
      return useWhatsAppTrans()
    case Contact.Qq:
      return useQQTrans()
    case Contact.Wechat:
      return useWeChatTrans()
    case Contact.Zalo:
      return useZaloTrans()
  }
}

const MaxContactFieldSize = 3
const ContactFieldSelectGroup = ({
  name = ContactFieldsName,
  max = MaxContactFieldSize,
  items = [],
  readOnly
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
    let label = useContactLabel(field)
    let selected = Reflect.get(fields, field)
    let disabled = !(selectedSize < max || selected)
    return (
      <Switch
        key={field}
        name={`${ContactFieldsName}.${field}`}
        label={label}
        disabled={disabled || readOnly}
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
