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
  Box
} from "bumbag"
import { useIsDisplayMenuByRoute, useUserLicenseeId } from "../../user/context"
import { Disclosure, EditDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Update as UpdateMenu } from "./menu"

export const PlatformCreditDialogDisclosure = ({
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} />
      {dialog.visible && (
        <EditDialog
          brandId={record?.id}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const EditDialog = ({ brandId, onSubmitted, ...props }) => {

}


const 