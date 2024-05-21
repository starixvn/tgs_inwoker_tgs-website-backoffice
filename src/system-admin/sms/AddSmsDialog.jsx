import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Stack, FieldStack, Card, Set, Icon, Box } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import { Disclosure } from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { FormDialog } from "../../form/FormDialog"

export const AddSmsDialogDisclosure = ({
  onSubmitted,
  id,
  dialogId = "add-sms-dialog"
}) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure {...dialog}>Add</Disclosure>
      {dialog.visible && (
        <AddDialog
          dialog={dialog}
          dialogId={dialogId}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const AddDialog = ({ onSubmitted, dialog, dialogId }) => {
  return <FormDialog dialog={dialog} id={dialogId}></FormDialog>
}
