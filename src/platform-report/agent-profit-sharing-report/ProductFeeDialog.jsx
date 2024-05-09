import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Text, useModalState, FieldStack, Link } from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import { Table, toApiParams, useTable } from "../../table"
import { useAgentDividendProductFee } from "./client"
import { ProductFeeTrans, useProductFeeTrans } from "../../trans/Platform"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Modal from "../../dialog/Modal"
import { FormattedNumberDecimal } from "../../i18n"
import { startOfNextDay } from "../../date/startOfNextDay"
import { AgentUsernameTrans } from "../../trans/Agent"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import {
  CardGameTrans,
  EGameTrans,
  LiveDealerTrans,
  LotteryTrans,
  SportsbookTrans,
  VirtualSportsTrans
} from "../../trans/Game"

export const ProductFeeDialogDisclosure = ({
  agentId,
  agentDividendPercentage,
  from,
  to,
  username,
  value,
  id,
  dialogId = "product-fee-dialog",
  use = Link
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} use={use}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <ProductFeeDialog
          agentId={agentId}
          agentDividendPercentage={agentDividendPercentage}
          from={from}
          to={to}
          username={username}
          value={value}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const ProductFeeDialog = ({
  agentId,
  agentDividendPercentage,
  from,
  to,
  username,
  value,
  dialog,
  dialogId
}) => {
  let { state } = useTable({
    agentId,
    agentDividendPercentage,
    from,
    to: startOfNextDay(to)
  })

  let { data, isLoading, error } = useAgentDividendProductFee(
    toApiParams(state)
  )

  let items = data ? [data] : []
  let columns = useColumns({ items })
  let title = useProductFeeTrans()

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      <FieldStack marginLeft="1rem">
        <FieldValues>
          <AgentUsernameTrans />
          <Box alignY="center">{username}</Box>

          <ProductFeeTrans />
          <Box alignY="center">{formatNumberDecimal(value)}</Box>
        </FieldValues>
        <Table columns={columns} data={items} controlledState={state} />
      </FieldStack>
    </Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      numberDecimalColumn({
        accessor: "liveDealerAmount",
        Header: <LiveDealerTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "sportsAmount",
        Header: <SportsbookTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "slotAmount",
        Header: <EGameTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "cardGameAmount",
        Header: <CardGameTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "virtualSportsAmount",
        Header: <VirtualSportsTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "lotteryAmount",
        Header: <LotteryTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
