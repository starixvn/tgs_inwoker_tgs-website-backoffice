import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Icon,
  FieldStack,
  Text,
  Set,
  List,
  Box,
  Alert,
  Columns,
  Stack,
  Link
} from "bumbag"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import Disclosure from "../../dialog/Disclosure"
import Modal from "../../dialog/Modal"
import { usePlatformAccountFundColumns } from "./index"
import { usePlatformAccountFundHistory } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"

const usePlatformAccountFundHistoryTrans = () =>
  useTrans({
    zh: "歷史記錄",
    en: "Fund Performance"
  })

export const FundChangeHistoryDialogDisclosure = ({
  brandId,
  id,
  dialogId = "fund-history"
}) => {
  let dialog = useModalState()

  let label = usePlatformAccountFundHistoryTrans()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        {label}
      </Disclosure>
      {dialog.visible && (
        <HistoryDialog
          brandId={brandId}
          dialog={dialog}
          dialogId={dialogId}
          title={label}
        />
      )}
    </>
  )
}

const HistoryDialog = ({ brandId, dialog, dialogId, title }) => {
  let { isLoading, data: items, error } = usePlatformAccountFundHistory(brandId)

  let { state, setPageIndex, setSortOrder } = useTable()

  let columns = usePlatformAccountFundColumns({
    items
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal
      id={dialogId}
      title={title}
      {...dialog}
      css={css`
        min-width: 75vw;
      `}
    >
      <Table
        columns={columns}
        data={items}
        controlledState={state}
        autoPaging={true}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        hasCellDividers
      />
    </Modal>
  )
}
