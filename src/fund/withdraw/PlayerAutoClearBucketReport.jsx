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
  FieldStack
} from "bumbag"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { Table, pageCount, useTable } from "../../table"
import { textColumn } from "../../table/column/textColumn"
import AlertDialog from "../../dialog/Alert"
import PageContent from "../../page/Content"
import {
  ClearBucketStatusLabel,
  ClearBucketStatusSelect
} from "./ClearBucketStatus"
import { usePlayerAutoClearBucketList } from "../../player-management/player-list/client"
import dateTimeColumn from "../../table/column/dateTime"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import SequenceColumn from "../../table/column/sequence"

export const PlayerAutoClearBucketReport = ({
  playerCode,
  prefetchedData,
  ...props
}) => {
  let [status, setStatus] = useState()

  let {
    isLoading,
    data: items,
    error
  } = usePlayerAutoClearBucketList(
    playerCode,
    status,
    prefetchedData
      ? {
          fallbackData: prefetchedData
        }
      : null
  )

  let { state, setPageIndex, setSortOrder } = useTable({
    pageSize: 5
  })
  let columns = useColumns({ items })

  return (
    <PageContent
      title={<Trans zh="自动清流水报表" en="Auto Clear Wagering Report" />}
      actionBar={
        <Box>
          <ClearBucketStatusSelect
            value={status}
            onChange={(event) => {
              let value = event.target.value
              setStatus(value)
            }}
            disabled={isLoading}
          />
        </Box>
      }
      {...props}
    >
      <Table
        id="auto-clear-bucket"
        hasDividers
        hasCellDividers
        columns={columns}
        data={items}
        controlledState={state}
        autoPaging={true}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.id}
      />
      {error && <AlertDialog {...error} />}
    </PageContent>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      {
        id: "info",
        Header: "",
        columns: [
          dateTimeColumn({
            accessor: "createdOn",
            Header: <Trans zh="时间" en="Time" />,
            disableSortBy: true
          }),
          textColumn({
            accessor: "id",
            Header: <Trans zh="单号" en="Id." />,
            disableSortBy: true
          }),
          textColumn({
            accessor: "depositFormId",
            Header: <Trans zh="存款单号" en="Deposit ID." />,
            disableSortBy: true
          })
        ]
      },
      {
        id: "reviewingGroup",
        Header: <Trans zh="审核中存款单" en="Reviewing" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "reviewBalance",
            Header: <Trans zh="钱包余额" en="Balance" />,
            disableSortBy: true,
            headCellProps: {
              whiteSpace: "nowrap"
            }
          }),
          numberDecimalColumn({
            accessor: "reviewBucketAmount",
            Header: <Trans zh="剩余流水" en="Wagering" />,
            disableSortBy: true,
            headCellProps: {
              whiteSpace: "nowrap"
            }
          })
        ]
      },
      {
        id: "afterClearedGroup",
        Header: <Trans zh="自动清流水后" en="After Cleared" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "cleaningBalance",
            Header: <Trans zh="钱包余额" en="Balance" />,
            disableSortBy: true,
            headCellProps: {
              whiteSpace: "nowrap"
            }
          }),
          numberDecimalColumn({
            accessor: "cleaningBucketAmount",
            Header: <Trans zh="剩余流水" en="Wagering" />,
            disableSortBy: true,
            headCellProps: {
              whiteSpace: "nowrap"
            }
          })
        ]
      },
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => <ClearBucketStatusLabel value={value} />
      })
    ],
    [JSON.stringify(items)]
  )
}
