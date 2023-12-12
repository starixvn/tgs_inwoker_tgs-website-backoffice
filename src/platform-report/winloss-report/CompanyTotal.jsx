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
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../dialog/Modal"
import { useWinlossReportCompanyTotal } from "./client"

export const CompanyTotalDialogDisclosure = ({
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
        <CompanyTotalDialog
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

const CompanyTotalDialog = ({ brandId, agentId, from, to, dialog }) => {
  let { data, isLoading, error, mutate, deleteCache } =
    useWinlossReportCompanyTotal({ brandId, agentId, from, to })

  let title = useTrans({
    zh: "公司总和",
    en: "Company Total"
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
        Footer: () => null,
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
        id: "company",
        Header: <Trans zh="公司" en="Company" />,
        headCell: {
          textAlign: "center"
        },
        Footer: () => null,
        columns: [
          numberDecimalColumn({
            accessor: "companyWinLoss",
            Header: <Trans zh="输赢" en="Winloss" />,
            disableSortBy: true,
            sumColumn: "companyWinLoss"
          }),
          numberDecimalColumn({
            accessor: "companySpecial",
            Header: <Trans zh="特别" en="Special" />,
            disableSortBy: true,
            sumColumn: "companySpecial"
          }),
          numberDecimalColumn({
            accessor: "companyTotal",
            Header: <Trans zh="总和" en="Total" />,
            disableSortBy: true,
            sumColumn: "companyTotal"
          })
        ]
      }
    ]
    return columns
  }, [JSON.stringify(items)])
}
