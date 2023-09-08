import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { usePlatformTopPlayerList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { textColumn } from "../../table/column/textColumn"

export const TopPlayerTable = ({ brandId }) => {
  //TODO: sort options?
  let { state, setState, setPageIndex, setSortOrder } = useTable({})

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  //TODO: handle api error
  let { data: items = [], isLoading, error } = usePlatformTopPlayerList(brandId)
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
        Header: <Trans zh="玩家用戶名" en="Player" />,
        accessor: "username",
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
