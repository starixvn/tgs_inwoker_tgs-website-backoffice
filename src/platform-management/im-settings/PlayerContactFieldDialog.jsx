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
  Level
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
  usePlayerContactFieldList
} from "./client"

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
          <SettingDialog
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
  let { isLoading } = usePlatformPlayerContactFieldList(brandId)
}

const SettingDialog = ({ brandId, dialog, dialogId, ...props }) => {
  let title = useContactInfoTrans()

  return (
    <FormDialog title={title} {...dialog} id={dialogId} {...props}>
      <Stack>
        <Info />
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
