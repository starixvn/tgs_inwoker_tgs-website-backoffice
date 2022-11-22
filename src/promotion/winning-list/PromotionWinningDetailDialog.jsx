import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState } from "bumbag"
import { DetailDisclosure } from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import { Modal } from "../../dialog/Modal"
import { usePromotionWinningDetail } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { JsonEditor } from "../../text/editor/JsonEditor"

export const PromotionWinningDetailDialogDisclosure = ({
  id,
  dialogId = "promotion-winning-detail-dialog",
  recordId,
  ...props
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <DetailDisclosure {...dialog} />
      {dialog.visible && (
        <DetailDialog recordId={recordId} dialog={dialog} dialogId={dialogId} />
      )}
    </>
  )
}

const DetailDialog = ({ recordId, dialog, dialogId }) => {
  let title = useTrans({
    zh: "中奖内容",
    en: "Winnings"
  })

  let { isLoading, data, error } = usePromotionWinningDetail(recordId)
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }
  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog} minWidth="40vw">
      <JsonEditor height="30vh" value={data} disabled />
    </Modal>
  )
}
