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
    data: platformPlayerContactFields,
    error
  } = usePlatformPlayerContactFieldList(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} onClickClose={dialog.hide} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <SettingDialog
      brandId={brandId}
      platformPlayerContactFields={platformPlayerContactFields}
      dialog={dialog}
      {...props}
    />
  )
}

//TODO: init form default value
//TODO: select switch checkbox group?
//TODO: integrate update api
const SettingDialog = ({
  brandId,
  playerContactFields = [],
  platformPlayerContactFields,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useContactInfoTrans()
  let [formData, setSubmit] = useState()
  let {} = useUpdatePlatformPlayerContactFieldList(brandId, formData)

  const FieldName = "contacts"

  let defaultValues = {}
  Reflect.set(
    defaultValues,
    FieldName,
    Object.fromEntries(
      playerContactFields.map((field) => {
        let setting = platformPlayerContactFields.find(
          (item) => item.name === field
        )
        let visible = setting?.isVisualized ?? false
        return [field, visible]
      })
    )
  )

  console.log("defaultValues", defaultValues)

  const onSubmit = (data) => {
    //TODO:
    setSubmit(data)
  }

  const reset = () => {
    setSubmit(null)
    mutate(undefined, false)
  }

  return (
    <FormDialog
      defaultValues={defaultValues}
      {...dialog}
      title={title}
      id={dialogId}
      {...props}
    >
      <Stack>
        <Info />
        <Box>
          {playerContactFields.map((field) => {
            return <Switch name={`${FieldName}.${field}`} label={field} />
          })}
          {JSON.stringify(playerContactFields)}
        </Box>
        <Box>{JSON.stringify(platformPlayerContactFields)}</Box>
      </Stack>
    </FormDialog>
  )
}

const Info = () => {
  let title = useTrans({
    en: "Select up to 3 types",
    zh: "聯繫信息最多選取3種",
    vi: "chọn tối đa 3 loại"
  })
  return <Alert title={title} variant="bordered" />
}
