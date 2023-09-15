import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { usePlatformTopGameList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { textColumn } from "../../table/column/textColumn"
import { Trans } from "../../i18n"
import { numberDecimalColumn } from "../../table/column/numberColumn"

export const TopGameTable = ({ brandId }) => {
  //TODO: sort options?
  let { state, setState, setPageIndex, setSortOrder } = useTable({})

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  //TODO: handle api error
  let { data: items = [], isLoading, error } = usePlatformTopGameList(brandId)
  let columns = useColumns({ items })

  //TODO: sort options?
  return (
    <Table
      columns={columns}
      data={items}
      initialState={state}
      controlledState={state}
      setPageIndex={setPageIndex}
      setSortOrder={setSortOrder}
      isLoading={isLoading}
    />
  )
}

//TODO: columns, sort options here?
const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        id: "name",
        accessor: (row) => row,
        Header: <Trans zh="游戏厂商 / 游戏名称" en="Provider / Game Name" />,
        disableSortBy: true,
        Cell: ({ value: game }) => {
          let abbr = game?.providerAbbr ?? ""
          let name = game?.gameName ?? ""
          return abbr && name ? `${abbr} / ${name}` : ""
        }
      }),
      numberDecimalColumn({
        accessor: "bet",
        Header: <Trans zh="投注" en="Bet" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLoss",
        Header: <Trans zh="赢输" en="W/L" />,
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
