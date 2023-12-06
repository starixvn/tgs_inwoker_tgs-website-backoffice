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
import { TransactionTypeTrans } from "../../trans/Action"
import { BalanceAfterTrans, BalanceBeforeTrans } from "../../trans/User"
import { TimeTrans } from "../../trans/Date"

export const GameActionDialogDisclosure = ({
  roundId,
  id,
  dialogId,
  ...props
}) => {
  let dialog = useModalState()

  if (!roundId) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <Trans zh="游戏纪录" en="Game Record" />
      </Disclosure>
      {dialog.visible && (
        <GameActionDialog
          roundId={roundId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

export const GameActionDialog = ({
  roundId,
  dialog,
  dialogId = "game-action-dialog",
  ...props
}) => {
  let title = useTrans({
    zh: "游戏纪录",
    en: "Game Record"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    roundId
  })
  let { isLoading, error, data } = useGameRoundBalanceChangeList(
    toApiParams(state)
  )
  let columns = useColumns({ items: data?.items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      id={dialogId}
      title={title}
      showCloseButton
      hideOnClickOutside={false}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      minWidth="60vw"
      {...dialog}
    >
      <Table
        id="game-action"
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
        accessor: "recordedOn",
        Header: <TimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "externalTransactionId",
        Header: (
          <Trans zh="External Transaction ID" en="External Transaction ID" />
        ),
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameActionType",
        Header: <TransactionTypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
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
        Header: <BalanceBeforeTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "afterBalance",
        Header: <BalanceAfterTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
