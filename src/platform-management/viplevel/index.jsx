import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Level, Stack } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import AutoSizer from "react-virtualized-auto-sizer"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { View } from "./menu"
import { Code } from "./menu"
import { toApiParams, useTable, Table, pageCount } from "../../table"
import { ViewButton, EditButton, AddButton } from "./edit"
import textColumn from "../../table/column/textColumn"
import { useVipLevelList } from "../../vip-levels/client"
import AlertDialog from "../../dialog/Alert"
import { ActionTrans } from "../../trans/Action"
import { VipLevelTrans } from "../../trans/Vip"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<VipLevelTrans />}>
      <BodyContent />
    </PlatformPageContent>
  )
}

const FrontendLobbyVipLimit = 10

const BodyContent = ({}) => {
  let brandId = usePlatformId()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, emptyData } = useVipLevelList({
    ...toApiParams(state),
    sortby: "level"
  })

  let columns = useColumns({ brandId, items: data?.items, mutate })

  let pageWidth = usePlatformPageContentWidth()
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <Box></Box>
        <Box alignX="right">
          {data?.items?.length < FrontendLobbyVipLimit && (
            <AddButton
              id="add-vip-level-dialog-disclosure"
              brandId={brandId}
              onSubmitted={mutate}
            />
          )}
        </Box>
      </Level>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={data?.items}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(state?.pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                stickyHead
              />
            )
          }}
        </AutoSizer>
      </Box>
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const useColumns = ({ brandId, items = [], mutate }) => {
  let hasAnyMenu = useHasSubMenuByRoute()

  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "name",
        Header: <VipLevelTrans />,
        disableSortBy: true
      })
    ]

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        accessor: (row) => row,
        disableSortBy: true,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Set alignX="center">
              <ViewButton
                id="view-vip-level-dialog-disclosure"
                record={value}
              />
              <EditButton
                id="edit-vip-level-dialog-disclosure"
                brandId={brandId}
                record={value}
                onSubmitted={mutate}
              />
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items)])
}
