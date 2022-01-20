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

export const GameActionDialogDisclosure = ({ roundId, ...props }) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="游戏纪录" en="Game Record" />
      </Disclosure>
      {dialog.visible && <GameActionDialog roundId={roundId} dialog={dialog} />}
    </>
  )
}

export const GameActionDialog = ({ roundId, dialog, ...props }) => {
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
      id="game-action-dialog"
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
        Header: <Trans zh="操作时间" en="Operation Time" />,
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
        Header: <Trans zh="帐变类型" en="Transaction Type" />,
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
