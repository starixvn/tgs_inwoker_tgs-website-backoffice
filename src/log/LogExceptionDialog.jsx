import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Code,
  Card,
  FieldStack,
  FieldWrapper,
  Box
} from "bumbag"
import { useTrans } from "../i18n"
import { DetailDisclosure } from "../dialog/Disclosure"
import { useDetailTrans } from "../trans/Action"

export const LogExceptionDialogDisclosure = ({ value, ...props }) => {
  let dialog = useModalState()

  if (!value) {
    return "-"
  }

  return (
    <>
      <DetailDisclosure {...dialog} />
      {dialog.visible && <ExceptionDialog value={value} dialog={dialog} />}
    </>
  )
}

const ExceptionDialog = ({ value = "", dialog, ...props }) => {
  const title = useDetailTrans()

  return (
    <Dialog.Modal
      title={title}
      showActionButtons={false}
      hideOnClickOutside={false}
      showCloseButton
      width="80vw"
      maxWidth="80vw"
      {...dialog}
    >
      <Code isBlock wordBreak="break-word">
        {value}
      </Code>
    </Dialog.Modal>
  )
}
