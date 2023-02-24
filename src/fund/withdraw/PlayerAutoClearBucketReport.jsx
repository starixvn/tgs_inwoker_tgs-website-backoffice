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
import { Trans } from "../../i18n"
import { Table, pageCount, useTable } from "../../table"
import { textColumn } from "../../table/column/textColumn"
import AlertDialog from "../../dialog/Alert"
//TODO: use PageContent?
import PageContent from "../../page/Content"
import { ClearBucketStatusSelect } from "./ClearBucketStatus"
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
      textColumn({
        accessor: "id",
        Header: <Trans zh="订单ID" en="Id" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="投注时间" en="Created On" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "subGameProviderName",
        Header: <Trans zh="子游戏厂商" en="Sub Game Provider" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "gameName",
        Header: <Trans zh="游戏名称" en="Game Name" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "settleAmount",
        Header: <Trans zh="派彩" en="Settle Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <Trans zh="玩家输赢金额" en="Player Win Loss" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
