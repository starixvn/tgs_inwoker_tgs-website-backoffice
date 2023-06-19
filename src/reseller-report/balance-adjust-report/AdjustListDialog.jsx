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
import { formatDateTime, formatYearMonthDay } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../dialog/Modal"
import { usePlatformAdjustList } from "./client"
import sequenceColumn from "../../table/column/sequence"
import { isPlayer } from "./UserType"
import { PlayerAdjustBalanceTypeLabel } from "../../player-management/balance-adjustment/PlayerAdjustBalanceType"

export const AdjustListDialogDisclosure = ({
  value,
  brandId,
  userType,
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
        <AdjustListDialog
          brandId={brandId}
          userType={userType}
          from={from}
          to={to}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: search bar
const AdjustListDialog = ({ brandId, userType, from, to, dialog }) => {
  let { data, isLoading, error, mutate, deleteCache } = usePlatformAdjustList(
    brandId,
    userType,
    { from, to }
  )

  let title = useTrans({
    zh: "调帐报表",
    en: "Balance Adjust Report"
  })

  let columns = useColumns({ items: data, userType })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  //TODO: table pagination
  //TODO: stickyHead?
  return (
    <Modal title={title} {...dialog}>
      <Table
        columns={columns}
        data={data?.items}
        // pageCount={pageCount(pageSize, data?.totalCount)}
        // hasCellDividers
      />
    </Modal>
  )
}

const useColumns = ({ items = [], userType }) => {
  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="时间" en="Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "userName",
        Header: <Trans zh="用戶名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        id: "adjustType",
        accessor: (row) => row,
        Header: <Trans zh="调帐类型" en="Adjust Type" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          //TODO: agent adjustType???
          return isPlayer(userType) ? (
            <PlayerAdjustBalanceTypeLabel value={record?.adjustType} />
          ) : (
            record?.adjustType
          )
        }
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="金额" en="Amount" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "operator",
        Header: <Trans zh="操作者" en="Adjust By" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
