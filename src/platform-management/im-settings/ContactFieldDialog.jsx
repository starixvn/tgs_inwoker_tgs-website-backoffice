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
import { View, Update, ViewContactField, UpdateContactField } from "./menu"
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

export const ContactFieldDialogDisclosure = ({
  brandId,
  id,
  dialogId = "contact-field-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let viewAuth = useIsDisplayMenuByRoute([ViewContactField])
  let editable = useIsDisplayMenuByRoute([UpdateContactField])
  let readOnly = !editable
  if (!viewAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <ContactInfoTrans />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <ContactFieldDialog
            brandId={brandId}
            readOnly={readOnly}
            dialog={dialog}
            dialogId={dialogId}
          />
        </SWRConfig>
      )}
    </>
  )
}

const ContactFieldDialog = ({ brandId, dialog, dialogId, ...props }) => {
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
