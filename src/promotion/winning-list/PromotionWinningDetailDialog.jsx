import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Label } from "bumbag"
import { DetailDisclosure } from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import { Modal } from "../../dialog/Modal"
import { usePromotionWinningDetail } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { JsonEditor } from "../../text/editor/JsonEditor"
import { FieldValues } from "../../layout/Grid"

export const PromotionWinningDetailDialogDisclosure = ({
  id,
  dialogId = "promotion-winning-detail-dialog",
  brandId,
  recordId,
  ...props
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <DetailDisclosure {...dialog} />
      {dialog.visible && (
        <DetailDialog
          brandId={brandId}
          recordId={recordId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const DetailDialog = ({ brandId, recordId, dialog, dialogId }) => {
  let title = useTrans({
    zh: "中奖内容",
    en: "Winnings"
  })

  let { isLoading, data, error } = usePromotionWinningDetail(brandId, recordId)
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }
  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  let record = data?.data
  return (
    <Modal id={dialogId} title={title} {...dialog} minWidth="40vw">
      <FieldValues>
        <Trans zh="奖项名称" en="Winning Content" />
        <span>{record?.winningPrize}</span>
      </FieldValues>
    </Modal>
  )
}
