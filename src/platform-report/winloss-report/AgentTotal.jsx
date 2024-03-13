import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack,
  Popover,
  Icon,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime, formatYearMonthDay } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../dialog/Modal"
import { useWinlossReportAgentTotal } from "./client"
import { AgentTrans } from "../../trans/Agent"
import { TotalTrans } from "../../trans/Field"
import { WinLossTrans } from "../../trans/Game"
import { PlayerTrans } from "../../trans/Player"

export const AgentTotalDialogDisclosure = ({
  value,
  brandId,
  agentId,
  from,
  to
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <>
      <Disclosure use={Link} {...dialog}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <AgentTotalDialog
          brandId={brandId}
          agentId={agentId}
          from={from}
          to={to}
          dialog={dialog}
        />
      )}
    </>
  )
}

const AgentTotalDialog = ({ brandId, agentId, from, to, dialog }) => {
  let { data, isLoading, error, mutate, deleteCache } =
    useWinlossReportAgentTotal({ brandId, agentId, from, to })

  let title = useTrans({
    zh: "代理总和",
    en: "Agent Total"
  })

  let columns = useColumns({ items: data })

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
        data={data}
        foot={data?.length > 0}
        hasCellDividers
      />
    </Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        id: "settlePeriod",
        accessor: (row) => row,
        Header: <Trans zh="結算區間" en="Settle Period" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let start = formatYearMonthDay(record?.from)
          let end = formatYearMonthDay(record?.to)
          return <Text.Block>{`${start} - ${end}`}</Text.Block>
        },
        Footer: () => <TotalTrans />,
        footerCellProps: {
          textAlign: "center"
        }
      }),
      numberDecimalPercentageColumn({
        accessor: "percentage",
        Header: <Trans zh="佔成" en="P/T" />,
        disableSortBy: true,
        Footer: () => {
          return null
        }
      }),
      {
        id: "player",
        Header: <PlayerTrans />,
        headCell: {
          textAlign: "center"
        },
        Footer: () => null,
        columns: [
          numberDecimalColumn({
            accessor: "playerWinLoss",
            Header: <WinLossTrans />,
            disableSortBy: true,
            sumColumn: "playerWinLoss"
          }),
          numberDecimalColumn({
            accessor: "playerSpecial",
            Header: <Trans zh="特别" en="Special" />,
            disableSortBy: true,
            sumColumn: "playerSpecial"
          })
        ]
      },
      {
        id: "agent",
        Header: <AgentTrans />,
        headCell: {
          textAlign: "center"
        },
        Footer: () => null,
        columns: [
          numberDecimalColumn({
            accessor: "agentWinLoss",
            Header: <WinLossTrans />,
            disableSortBy: true,
            sumColumn: "agentWinLoss"
          }),
          numberDecimalColumn({
            accessor: "agentSpecial",
            Header: <Trans zh="特别" en="Special" />,
            disableSortBy: true,
            sumColumn: "agentSpecial"
          }),
          numberDecimalColumn({
            accessor: "agentTotal",
            Header: <Trans zh="总和" en="Total" />,
            disableSortBy: true,
            sumColumn: "agentTotal"
          })
        ]
      }
    ]
    return columns
  }, [JSON.stringify(items)])
}
