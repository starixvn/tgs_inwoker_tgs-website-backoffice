import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { usePlatformAccountFundActionDetail } from "./client"
import Modal from "../../dialog/Modal"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { toDate } from "../../date/toDate"
import { startOfNextMonth } from "../../date/startOfNextMonth"

const AddedDeductedDetail = {
  zh: "上/下分詳情",
  en: "Added/Deducted Details"
}
const FundActionDetailTrans = () => <Trans {...AddedDeductedDetail} />
const useFundActionDetailTrans = () => useTrans(AddedDeductedDetail)

export const FundActionDetailDialogDisclosure = ({
  brandId,
  month,
  onSubmitted,
  id,
  dialogId = "fund-action-detail-dialog"
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure {...dialog}>
        <FundActionDetailTrans />
      </Disclosure>
      {dialog.visible && (
        <DetailDialog
          brandId={brandId}
          month={month}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const DetailDialog = ({ brandId, month, dialog, dialogId }) => {
  let title = useFundActionDetailTrans()

  let startOn = toDate(month)
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    startOn,
    endOn: startOfNextMonth(startOn)
  })

  let toSearchParams = (state) => {
    let { page, rows, ...rest } = toApiParams(state)
    return {
      pageNumber: page,
      pageSize: rows,
      ...rest
    }
  }
  let { isLoading, data, error } = usePlatformAccountFundActionDetail(
    brandId,
    toSearchParams(state)
  )

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      {JSON.stringify(data)}
    </Modal>
  )
}
