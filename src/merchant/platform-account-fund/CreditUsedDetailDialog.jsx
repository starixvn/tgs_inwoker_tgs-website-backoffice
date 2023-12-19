import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Link } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import Modal from "../../dialog/Modal"
import AlertDialog from "../../dialog/Alert"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { usePlatformAccountFundCreditUsedDetail } from "./client"

export const CreditUsedDialog = ({
  brandId,
  month,
  value,
  id,
  dialogId = "fund-used-amount-detail-dialog"
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)

  return (
    <>
      <Disclosure id={id} use={Link} {...dialog}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <DetailDialog brandId={brandId} month={month} dialog={dialog} />
      )}
    </>
  )
}

const DetailDialog = ({ brandId, month, dialog, dialogId }) => {
  let title = useTrans({
    zh: "已使用額度詳情",
    en: "Used Credits Details"
  })

  let { state, setPageIndex, setSortOrder } = useTable({
    month
  })

  let { isLoading, data, error } = usePlatformAccountFundCreditUsedDetail(
    brandId,
    toApiParams(state)
  )

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      {JSON.stringify(data)}
    </Modal>
  )
}
