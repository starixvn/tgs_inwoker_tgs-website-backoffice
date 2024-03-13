import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Alert } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { usePlayerBalanceChangeUnsaved } from "./client"
import AlertDialog from "../../dialog/Alert"
import { BalanceChangeUnsaved } from "./menu"
import Modal from "../../dialog/Modal"
import { Table, pageCount, toApiParams, useTable } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { PlayerTransactionTypeLabel } from "./PlayerBalanceChange"
import { TimeTrans } from "../../trans/Date"
import { RemarkTrans, TransactionTypeTrans } from "../../trans/Action"
import { NetProfitTrans, TransactionAmountTrans } from "../../trans/Field"
import { BalanceTrans } from "../../trans/User"
import Checkbox from "../../checkbox"
import textColumn from "../../table/column/textColumn"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import dateTimeColumn from "../../table/column/dateTime"

const UnsavedData = {
  zh: "未寫入資料",
  en: "Unsaved Data"
}
const UnsavedDataTrans = () => <Trans {...UnsavedData} />
const useUnsavedDataTrans = () => useTrans(UnsavedData)

export const BalanceChangeUnsavedDataDisclosure = ({ playerCode }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([BalanceChangeUnsaved])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <UnsavedDataTrans />
      </Disclosure>
      {dialog.visible && (
        <UnsavedDialog playerCode={playerCode} dialog={dialog} />
      )}
    </>
  )
}

const UnsavedDialog = ({ playerCode, dialog, ...props }) => {
  let title = useUnsavedDataTrans()
  let { state, setState, setPageIndex, setSortOrder } = useTable()

  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerBalanceChangeUnsaved(playerCode, toApiParams(state))

  let columns = useColumns({ items: data?.items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal title={title} {...dialog}>
      <Table
        columns={columns}
        data={data?.items}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        initialState={state}
        controlledState={state}
        isLoading={isLoading}
      />
    </Modal>
  )
}

export const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      dateTimeColumn({
        accessor: "recordedOn",
        Header: <TimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "transactionId",
        Header: "Id",
        disableSortBy: true
      }),
      textColumn({
        accessor: "transactionType",
        Header: <TransactionTypeTrans />,
        disableSortBy: true,
        Cell: PlayerTransactionTypeLabel
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <TransactionAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "lockAmount",
        Header: "Lock Amount",
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "balance",
        Header: <BalanceTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "lockedBalance",
        Header: "Locked Balance",
        disableSortBy: true
      }),
      textColumn({
        accessor: "includeInNetProfit",
        Header: <NetProfitTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Box alignX="center">
              <Checkbox checked={value} inputProps={{ readOnly: true }} />
            </Box>
          )
        }
      }),
      textColumn({
        accessor: "remark",
        Header: <RemarkTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalTransactionId",
        Header: "External Id",
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
