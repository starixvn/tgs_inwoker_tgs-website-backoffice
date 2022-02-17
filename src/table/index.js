import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import { css, Global } from "@emotion/react"
import { Icon, Table as _Table, Pagination, Set, Spinner, Box } from "bumbag"
import {
  useTable as _useTable,
  useSortBy as useTableSortBy,
  usePagination as useTablePagination,
  useFilters as useTableFilters,
  useRowState as useTableRowState
} from "react-table"
import { fromIsDescending, equalsDescending } from "./order"
import {
  faCaretUp,
  faCaretDown,
  faSlash,
  faTimes,
  faSearchMinus
} from "@fortawesome/free-solid-svg-icons"
import { Trans, useTrans } from "../i18n"

const DefaultState = {
  pageIndex: 0,
  pageSize: 20,
  sortBy: []
}

export const useTable = (initialState = {}) => {
  let [state, set] = useState({ ...DefaultState, ...initialState })

  const setPageIndex = (pageIndex) => {
    set((prevState) => {
      return { ...prevState, pageIndex }
    })
  }

  const setPageSize = (pageSize) => {
    set((prevState) => ({
      ...prevState,
      pageSize
    }))
  }

  const setState = (state) => {
    set((prevState) => ({ ...prevState, ...state }))
  }

  const setSortOrder = (sortBy) => {
    set((prevState) => {
      return { ...prevState, sortBy }
    })
  }

  return {
    state,
    setState,
    setPageIndex,
    setPageSize,
    setSortOrder
  }
}

/*
 pageIndex -> page
 pageSize -> rows
*/
export const toApiParams = (state) => {
  if (!state) {
    return undefined
  }

  let { pageIndex, pageSize, sortBy = [], ...restState } = state
  let page = pageIndex + 1
  let rows = pageSize
  let [sort] = sortBy
  let sortby = ""
  let orderby = ""
  if (sort) {
    sortby = sort?.id
    orderby = fromIsDescending(sort?.desc)
  }
  return {
    ...restState,
    page,
    rows,
    sortby: state?.sortby ?? sortby,
    orderby: state?.orderby ?? orderby
  }
}

export const Table = ({
  columns,
  data = [],
  getRowId,
  getRowProps,
  initialState,
  controlledState,
  useSortBy = useTableSortBy,
  manualSortBy = true,
  setSortOrder,
  disableMultiSort = true,
  usePagination = useTablePagination,
  pageCount,
  setPageIndex,
  manualPagination = true,
  useFilters = useTableFilters,
  manualFilters = true,
  isLoading,
  head = true,
  body = true,
  foot = false,
  children,
  stickyHead = false,
  stickyLeft = false,
  stickyRight = false,
  stickyFoot = false,
  components = {},
  getTableHeadProps,
  ...props
}) => {
  components = {
    ..._Table,
    ...components
  }

  let table = _useTable(
    {
      components,
      stickyHead,
      stickyLeft,
      stickyRight,
      stickyFoot,
      getTableHeadProps,
      columns,
      data,
      getRowId,
      getRowProps,
      initialState,
      useControlledState: (state) => {
        let pageIndex = controlledState?.pageIndex ?? state.pageIndex
        let pageSize = controlledState?.pageSize ?? state.pageSize

        return React.useMemo(
          () => ({
            ...state,
            pageIndex,
            pageSize
          }),
          [JSON.stringify(state), pageIndex]
        )
      },
      manualSortBy,
      disableMultiSort,
      manualPagination,
      pageCount,
      manualFilters
    },
    useFilters,
    useSortBy,
    usePagination
  )

  let { gotoPage, state: tableState } = table
  let { pageIndex } = tableState

  useEffect(() => {
    setSortOrder && setSortOrder(tableState?.sortBy)
  }, [JSON.stringify(tableState?.sortBy)])

  const getPage = () => pageIndex + 1

  let previousText = useTrans({
    zh: "前一页",
    en: "Previous page"
  })
  let nextText = useTrans({
    zh: "下一页",
    en: "Next page"
  })

  let isSticky = stickyHead || stickyFoot || stickyLeft > 0 || stickyRight > 0
  return (
    <>
      {isLoading && (
        <Box alignX="center">
          <Spinner />
        </Box>
      )}
      {!isLoading && (
        <Set
          orientation="vertical"
          position="relative"
          css={css`
            & div.bb-Table {
              overflow: ${isSticky ? "visible" : "auto"};
              border: 0;
            }

            & table.bb-Table {
              border-radius: 6px;
              overflow: ${isSticky ? "visible" : "auto"};
              border: 1px solid var(--bb-palette-white800, #000000);
            }
          `}
        >
          <_Table width="100%" {...table.getTableProps()} {...props}>
            {head === true && <Head table={table} />}
            {body === true && <Body table={table} />}
            {children}
            {foot === true && <Foot table={table} />}
          </_Table>
          {usePagination && pageCount > 0 && (
            <Pagination
              previousText={previousText}
              nextText={nextText}
              currentPage={getPage()}
              onChangePage={(page) => {
                let pageIndex = page - 1
                setPageIndex(pageIndex)

                gotoPage(pageIndex)
              }}
              numberOfPages={pageCount}
              css={css`
                z-index: 0;
              `}
            />
          )}
        </Set>
      )}
    </>
  )
}

const defaultProps = () => ({})

const Head = ({ table }) => {
  let {
    headerGroups,
    components,
    getTableHeadProps = defaultProps,
    stickyHead,
    stickyLeft,
    stickyRight
  } = table
  let { Head } = components

  const StickyHeadZIndex = 1
  return (
    <Head
      css={css`
        position: ${stickyHead ? "sticky" : "relative"};
        top: 0;
        z-index: ${stickyHead ? StickyHeadZIndex : "auto"};
      `}
      {...getTableHeadProps()}
    >
      {headerGroups.map((headerGroup) => (
        <_Table.Row {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, columnIndex, list) => {
            let props = column.getHeaderProps({
              ...column?.headCell,
              ...column?.getSortByToggleProps()
            })

            let isFirst = columnIndex == 0
            let isLast = columnIndex == list.length - 1
            let isStickyLeft = stickyHead && stickyLeft && isFirst
            let isStickyRight = stickyHead && stickyRight && isLast
            //TODO: support multiple sticky columns?
            let isStickyCell = isStickyLeft || isStickyRight
            return (
              <_Table.HeadCell
                css={css`
                  position: ${isStickyCell ? "sticky" : "static"};
                  left: ${isStickyLeft ? 0 : "auto"};
                  right: ${isStickyRight ? 0 : "auto"};
                  z-index: ${isStickyCell ? StickyHeadZIndex + 1 : "auto"};
                  background-color: var(--bb-palette-white600, #000000);
                `}
                {...props}
              >
                {column.render("Header")}
                {column.isSorted ? (
                  column.isSortedDesc ? (
                    <Icon icon={faCaretDown} type="font-awesome" />
                  ) : (
                    <Icon icon={faCaretUp} type="font-awesome" />
                  )
                ) : (
                  ""
                )}
              </_Table.HeadCell>
            )
          })}
        </_Table.Row>
      ))}
    </Head>
  )
}

const Foot = ({ table }) => {
  let {
    footerGroups,
    components,
    getTableFootProps = defaultProps,
    stickyFoot,
    stickyLeft,
    stickyRight
  } = table
  let { Foot } = components

  return (
    <Foot fontWeight="semibold" {...getTableFootProps()}>
      {footerGroups.map((group) => (
        <_Table.Row {...group.getFooterGroupProps()}>
          {group.headers.map((column) => (
            <_Table.Cell
              {...column.getFooterProps({
                ...column?.footerCellProps
              })}
            >
              {column.render("Footer")}
            </_Table.Cell>
          ))}
        </_Table.Row>
      ))}
    </Foot>
  )
}

const Body = ({ table }) => {
  let {
    rows,
    getTableBodyProps,
    getRowProps = defaultProps,
    getColumnProps = defaultProps,
    getCellProps = defaultProps,
    prepareRow,
    columns,
    components,
    stickyLeft,
    stickyRight
  } = table
  let { Body, Row, Cell } = components
  return (
    <Body {...getTableBodyProps()}>
      {rows.map((row, rowIndex) => {
        prepareRow(row)

        return (
          <Row
            table={table}
            data-row-id={row.id}
            data-row-index={rowIndex}
            {...row.getRowProps(getRowProps(row))}
          >
            {row.cells.map((cell, cellIndex, list) => {
              //TODO: rename cell?.column?.cell to cellProps?
              let props = cell.getCellProps([
                {
                  ...cell?.column?.cell
                },
                getColumnProps(cell.column),
                getCellProps(cell)
              ])
              let columnId = cell?.column?.id || cell?.column?.accessor

              let isFirst = cellIndex == 0
              let isLast = cellIndex == list.length - 1
              let isStickyLeft = stickyLeft && isFirst
              let isStickyRight = stickyRight && isLast
              //TODO: support multiple sticky columns?
              let isStickyCell = isStickyLeft || isStickyRight
              return (
                <Cell
                  css={css`
                    position: ${isStickyCell ? "sticky" : "static"};
                    left: ${isStickyLeft ? 0 : "auto"};
                    right: ${isStickyRight ? 0 : "auto"};
                  `}
                  data-column-id={columnId}
                  {...props}
                >
                  {cell.render("Cell")}
                </Cell>
              )
            })}
          </Row>
        )
      })}
      {!rows.length && (
        <Row>
          <Cell textAlign="center" colSpan={columns.length}>
            <Trans zh="查无资料" en="No Search Result" />
          </Cell>
        </Row>
      )}
    </Body>
  )
}

export const pageCount = (pageSize, totalCount) => {
  if (!pageSize) {
    return
  }

  let numberOfPages = Math.ceil(totalCount / pageSize)
  return numberOfPages
}
