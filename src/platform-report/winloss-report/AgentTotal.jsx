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
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../dialog/Modal"
import { useWinlossReportAgentTotal } from "./client"

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
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
  }

  return (
    <Modal title={title} {...dialog}>
      <Table
        columns={columns}
        data={data}
        // foot={data?.length > 0}
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
          return (
            <Set orientation="horizontal">
              <FormattedDate value={record?.from} />
              <FormattedDate value={record?.to} />
            </Set>
          )
        },
        Footer: () => <Trans zh="总计" en="Total" />,
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
        Header: <Trans zh="玩家" en="Player" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "playerWinLoss",
            Header: <Trans zh="输赢" en="Winloss" />,
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
        Header: <Trans zh="代理" en="Agent" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "agentWinLoss",
            Header: <Trans zh="输赢" en="Winloss" />,
            disableSortBy: true,
            sumColumn: "agentWinLoss"
          }),
          numberDecimalColumn({
            accessor: "agentSpecial",
            Header: <Trans zh="特别" en="Special" />,
            disableSortBy: true,
            sumColumn: "agentWinLoss"
          }),
          numberDecimalColumn({
            accessor: "agentTotal",
            Header: <Trans zh="总和" en="Total" />,
            disableSortBy: true,
            sumColumn: "agentWinLoss"
          })
        ]
      }
    ]
    return columns
  }, [JSON.stringify(items)])
}
