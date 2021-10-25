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
import { Disclosure } from "./Disclosure"
import { FormDialog } from "../form/FormDialog"
import { useTrans, Trans } from "../i18n"

export const DomainListDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="域名" en="Domain" />
      </Disclosure>
      {dialog.visible && <DomainListDialog dialog={dialog} />}
    </>
  )
}

export const DomainListDialog = ({ useFetch, useSubmit, dialog }) => {
  let title = useTrans({
    zh: "域名",
    en: "Domain"
  })
}
