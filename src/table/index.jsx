import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef
} from "react"
import { css, Global } from "@emotion/react"
import {
  Icon,
  Table as _Table,
  Pagination,
  Set,
  Spinner,
  Box,
  DropdownMenu,
  Button,
  Popover,
  Group
} from "bumbag"
import {
  useTable as _useTable,
  useSortBy as useTableSortBy,
  usePagination as useTablePagination,
  useFilters as useTableFilters,
  useRowState as useTableRowState,
  useColumnOrder
} from "react-table"
import { fromIsDescending, equalsDescending } from "./order"
import { Trans, useTrans } from "../i18n"
import clone from "clone-deep"
import { useScrollbarWidth } from "react-use"
import { get } from "lodash-es"
import { Cell } from "./Cell"
import { HeadCell } from "./HeadCell"
import { ActionBar } from "./ActionBar"

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
export const toApiParams = (state, configs = {}) => {
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
    if (configs.toSortBy) {
      sortby = configs.toSortBy(sortby)
    }

    orderby = fromIsDescending(sort?.desc)
    if (configs.toOrderBy) {
      orderby = configs.toOrderBy(orderby)
    }
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
  total,
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
  autoPaging = false,
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
  containerProps = {},
  maxSize,
  minHeight,
  tableContainerProps,
  tableBorder = "1px solid var(--bb-palette-white800, #000000)",
  toggleColumnHidden = false,
  columnOrder = false,
  hasCellDividers,
  ...props
}) => {
  components = {
    ..._Table,
    Cell,
    HeadCell,
    ...components
  }

  let stickyColumnRecord = {}

  let setStickyColumn = (columnIndex, isSticky) => {
    Reflect.set(stickyColumnRecord, columnIndex, isSticky)
  }

  let isStickyColumn = (columnIndex) => {
    let isSticky = stickyColumnRecord[columnIndex] ?? false
    return isSticky
  }

  let pageSize = controlledState?.pageSize ?? initialState?.pageSize
  if (
    autoPaging &&
    Number.isFinite(pageSize) &&
    data?.length > pageSize &&
    !Number.isFinite(pageCount)
  ) {
    pageCount = toPageCount(pageSize, data?.length)

    let pageIndex = controlledState?.pageIndex ?? initialState?.pageIndex
    if (Number.isFinite(pageIndex) && Number.isFinite(pageCount)) {
      let startIndex = pageIndex * pageSize
      let endIndex = startIndex + pageSize
      data = data.slice(startIndex, endIndex)
    }
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
      total,
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
      manualFilters,
      maxSize,
      setStickyColumn,
      isStickyColumn,
      toggleColumnHidden,
      columnOrder,
      hasCellDividers
    },
    useFilters,
    useSortBy,
    usePagination,
    useColumnOrder
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

  let scrollbarWidth = useScrollbarWidth()
  // TODO: how to measure height + margin?
  // let [paginationRef, paginationMeasure] = useMeasure()
  const PaginationHeight = 60

  if (data?.length > 5 && !Number.isFinite(minHeight)) {
    minHeight = 5 * 50
  }

  let isSticky = stickyHead || stickyFoot || stickyLeft > 0 || stickyRight > 0

  //Note. if table all use hasCellDividers, then "border-collapse" can set to "separate" instead of " ${hasCellDividers ? "separate" : "collapse"}"
  return (
    <>
      {isLoading && (
        <Box
          alignX="center"
          css={css`
            width: ${Number.isFinite(maxSize?.width)
              ? `${maxSize?.width}px`
              : "100%"};
          `}
        >
          <Spinner />
        </Box>
      )}
      {!isLoading && (
        <Set
          {...containerProps}
          orientation="vertical"
          position="relative"
          css={css`
            & div.bb-Table {
              overflow: ${isSticky ? "visible" : "auto"};
              border: 0;
              border-radius: 0;
            }

            & table.bb-Table {
              overflow: ${isSticky ? "visible" : "auto"};
              border: ${tableBorder};
              border-collapse: ${hasCellDividers ? "separate" : "collapse"};
            }
          `}
        >
          <ActionBar table={table} />
          <div
            css={css`
              width: ${Number.isFinite(maxSize?.width)
                ? `${maxSize?.width}px`
                : "100%"};
              height: ${Number.isFinite(maxSize?.height) &&
              Number.isFinite(minHeight)
                ? `${Math.max(
                    maxSize?.height - PaginationHeight - scrollbarWidth,
                    minHeight
                  )}px`
                : "max-content"};
              overflow: ${maxSize ? "auto" : isSticky ? "visible" : "auto"};
            `}
          >
            <_Table width="100%" {...table.getTableProps()} {...props}>
              {head === true && <Head table={table} />}
              {total && <TotalBody table={table} />}
              {body === true && <Body table={table} />}
              {children}
              {foot === true && <Foot table={table} />}
            </_Table>
          </div>
          {usePagination && pageCount > 0 && (
            <Pagination
              // ref={paginationRef}
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
                width: max-content;
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
    stickyHead
  } = table
  let { Head, HeadCell } = components

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
            let isFirst = columnIndex == 0
            let isLast = columnIndex == list.length - 1
            return (
              <HeadCell
                key={columnIndex}
                column={column}
                columnIndex={columnIndex}
                isFirstColumn={isFirst}
                isLastColumn={isLast}
                table={table}
              />
            )
          })}
        </_Table.Row>
      ))}
    </Head>
  )
}

//TODO: need stickyLeft or stickyRight?
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

const TotalBody = ({ table }) => {
  let {
    total,
    getTableBodyProps,
    columns,
    components,
    stickyLeft,
    stickyRight,
    maxSize
  } = table
  let { Body, Row } = components

  return (
    <Body
      id="total"
      {...getTableBodyProps()}
      css={css`
        font-weight: 600;
        background-color: var(--bb-palette-white600, #000000);
        border-bottom: 1px solid var(--bb-palette-white800, #000000);
      `}
    >
      <Row table={table}>
        {columns.map((column, columnIndex, list) => {
          let columnId = column?.totalId ?? column?.id ?? column?.accessor

          //TODO: rename cell?.column?.cell to cellProps?
          let props = clone(column?.cell ?? {})

          let isFirst = columnIndex == 0
          let isLast = columnIndex == list.length - 1
          let isStickyLeft = stickyLeft && isFirst
          let isStickyRight = stickyRight && isLast
          let isStickyCell = isStickyLeft || isStickyRight

          let Body = column.TotalCell ?? column.Cell
          let value = column?.toTotal ? column.toTotal(total) : total[columnId]
          return (
            <_Table.Cell
              key={columnId}
              css={css`
                position: ${isStickyCell ? "sticky" : "static"};
                left: ${isStickyLeft ? 0 : "auto"};
                right: ${isStickyRight ? 0 : "auto"};
              `}
              data-column-id={columnId}
              data-type="total"
              {...props}
            >
              <Body value={value} />
            </_Table.Cell>
          )
        })}
      </Row>
    </Body>
  )
}

const Body = ({ table }) => {
  let {
    rows,
    getTableBodyProps,
    getRowProps = defaultProps,
    prepareRow,
    columns,
    allColumns,
    components
  } = table
  let { Body, Row } = components
  return (
    <Body {...getTableBodyProps()}>
      {rows.map((row, rowIndex, rows) => {
        prepareRow(row)

        let isFirstRow = rowIndex === 0
        let isLastRow = rowIndex === rows.length - 1
        return (
          <Row
            table={table}
            data-row-id={row.id}
            data-row-index={rowIndex}
            {...row.getRowProps(getRowProps(row))}
          >
            {row.cells.map((cell, cellIndex, columns) => {
              let isFirstColumn = cellIndex == 0
              let isLastColumn = cellIndex == columns.length - 1
              return (
                <components.Cell
                  cell={cell}
                  key={cellIndex}
                  columnIndex={cellIndex}
                  isFirstColumn={isFirstColumn}
                  isLastColumn={isLastColumn}
                  isFirstRow={isFirstRow}
                  isLastRow={isLastRow}
                  table={table}
                />
              )
            })}
          </Row>
        )
      })}
      {!rows.length && (
        <Row>
          <_Table.Cell textAlign="center" colSpan={allColumns.length}>
            <Trans zh="查无资料" en="No Search Result" />
          </_Table.Cell>
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

const toPageCount = pageCount
