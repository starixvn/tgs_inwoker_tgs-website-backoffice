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
import { FormattedNumberDecimal, Trans } from "../../i18n"
import { Table, pageCount, useTable } from "../../table"
import { textColumn } from "../../table/column/textColumn"
import AlertDialog from "../../dialog/Alert"
//TODO: use PageContent?
import PageContent from "../../page/Content"
import {
  ClearBucketStatusLabel,
  ClearBucketStatusSelect
} from "./ClearBucketStatus"
import { usePlayerAutoClearBucketList } from "../../player-management/player-list/client"
import dateTimeColumn from "../../table/column/dateTime"
import { numberDecimalColumn } from "../../table/column/numberColumn"

export const PlayerAutoClearBucketReport = ({ playerCode, prefetchedData }) => {
  let [status, setStatus] = useState()

  let { isLoading, data, error } = usePlayerAutoClearBucketList(
    playerCode,
    status,
    prefetchedData
      ? {
          fallbackData: prefetchedData
        }
      : null
  )

  let { state, setPageIndex, setSortOrder } = useTable({})
  let columns = useColumns({ items: data?.items })
  return (
    <PageContent
      title={<Trans zh="自动清流水报表" en="Auto Clear Wagering Report" />}
      actionBar={
        <ClearBucketStatusSelect
          value={status}
          onChange={(event) => {
            let value = event.target.value
            setStatus(value)
          }}
          disabled={isLoading}
        />
      }
    >
      <Table
        columns={columns}
        data={data?.items}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        stickyHead
      />
      {error && <AlertDialog {...error} />}
    </PageContent>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
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
      }),
      {
        Header: <Trans zh="钱包余额/剩余流水" en="Balance/Wagering" />,
        columns: [
          textColumn({
            id: "reviewing",
            accessor: (row) => row,
            Header: <Trans zh="审核中存款单" en="Reviewing" />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              return (
                <Box>
                  <FormattedNumberDecimal value={record?.reviewBalance} />/
                  <FormattedNumberDecimal value={record?.reviewBucketAmount} />
                </Box>
              )
            }
          }),
          numberDecimalColumn({
            id: "afterCleared",
            accessor: (row) => row,
            Header: <Trans zh="自动清流水后" en="After Cleared" />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              return (
                <Box>
                  <FormattedNumberDecimal value={record?.cleaningBalance} />/
                  <FormattedNumberDecimal
                    value={record?.cleaningBucketAmount}
                  />
                </Box>
              )
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
