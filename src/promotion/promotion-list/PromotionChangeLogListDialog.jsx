import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Label, Set } from "bumbag"
import Disclosure, { DetailDisclosure } from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import { Modal } from "../../dialog/Modal"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { JsonEditor } from "../../text/editor/JsonEditor"
import { ChangeLog } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { useChangeLogList, useChangeLogDetail } from "./client"

export const PromotionChangeLogListDialog = ({
  id,
  dialogId = "promotion-change-list-dialog",
  promotionId,
  ...props
}) => {
  let hasAuth = useIsDisplayMenuByRoute([ChangeLog])
  let dialog = useModalState()

  if (!hasAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <Trans zh="日志" en="Logs" />
      </Disclosure>
      {dialog.visible && (
        <ChangeListDialog
          promotionId={promotionId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

export const ChangeListDialog = ({
  promotionId,
  dialog,
  dialogId,
  ...props
}) => {
  let { isLoading, data: items } = useChangeLogList(
    promotionId ? { promotionId } : undefined
  )

  //TODO: table and dialog
}

//TODO
const ChangeLogDetailDisclosure = () => {}
