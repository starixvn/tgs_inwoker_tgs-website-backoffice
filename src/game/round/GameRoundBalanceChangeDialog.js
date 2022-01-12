import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Dialog, Columns, Set, useModalState } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useTrans,
  Trans,
  FormattedNumber,
  useLangCode,
  FormattedNumberDecimal
} from "../../i18n"
import { useGameRoundBalanceChangeList } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import Disclosure from "../../dialog/Disclosure"
import dateTimeColumn from "../../table/column/dateTime"
import { TransactionTypeLabel } from "../../platform-report/balance-change-report/TransactionTypeSelect"
import textColumn from "../../table/column/textColumn"
import { numberDecimalColumn } from "../../table/column/numberColumn"

export const GameRoundBalanceChangeDialogDisclosure = ({
  roundId,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="游戏纪录" en="Game Record" />
      </Disclosure>
      {dialog.visible && (
        <GameRoundRecordDialog roundId={roundId} dialog={dialog} />
      )}
    </>
  )
}

export const GameRoundRecordDialog = ({ roundId, dialog, ...props }) => {
  let title = useTrans({
    zh: "游戏纪录",
    en: "Game Record"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({})
  let { isLoading, error, data } = useGameRoundBalanceChangeList(roundId)
  let columns = useColumns({ items: data?.items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      title={title}
      showCloseButton
      hideOnClickOutside={false}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      {...dialog}
    >
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
    </Dialog.Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      dateTimeColumn({
        Header: <Trans zh="操作时间" en="Operation Time" />,
        accessor: "recordedOn",
        disableSortBy: true
      }),
      textColumn({
        accessor: "transactionType",
        Header: <Trans zh="交易类型" en="Transaction Type" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          //TODO: use PlayerTransactionTypeLabel or GameActionLabel? or both?
          return <TransactionTypeLabel value={value} />
        }
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="交易金额" en="amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "beforeBalance",
        Header: <Trans zh="余额 (前)" en="Before" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "afterBalance",
        Header: <Trans zh="余额 (后)" en="After" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
