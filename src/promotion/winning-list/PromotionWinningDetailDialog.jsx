import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState } from "bumbag"
import { DetailDisclosure } from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import { Modal } from "../../dialog/Modal"

export const PromotionWinningDetailDialogDisclosure = ({
  id,
  dialogId = "promotion-winning-detail-dialog",
  detailId,
  ...props
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <DetailDisclosure {...dialog} />
      {dialog.visible && (
        <DetailDialog detailId={detailId} dialog={dialog} dialogId={dialogId} />
      )}
    </>
  )
}

const DetailDialog = ({ detailId, dialog, dialogId }) => {
  let title = useTrans({
    zh: "详情",
    en: "Detail"
  })

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      Detail
    </Modal>
  )
}
