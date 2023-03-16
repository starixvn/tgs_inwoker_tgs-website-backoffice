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
  Table,
  Pagination,
  Set,
  Spinner,
  Box,
  DropdownMenu,
  Button,
  Popover,
  Group
} from "bumbag"

const defaultProps = () => ({})

//TODO: sticky cell support isHoverable
export const Cell = ({
  cell,
  columnIndex,
  isFirstColumn,
  isLastColumn,
  isFirstRow,
  isLastRow,
  table
}) => {
  let {
    stickyLeft,
    stickyRight,
    maxSize,
    isStickyColumn,
    hasCellDividers,
    getColumnProps = defaultProps,
    getCellProps = defaultProps
  } = table

  let cellProps = cell.getCellProps([
    {
      ...cell?.column?.cell
    },
    getColumnProps(cell.column),
    getCellProps(cell)
  ])
  let columnId = cell?.column?.id || cell?.column?.accessor

  let isStickyLeft = stickyLeft && isFirstColumn
  let isStickyRight = stickyRight && isLastColumn
  //TODO: support multiple sticky columns?
  let isStickyCell = isStickyLeft || isStickyRight
  if (isStickyCell) {
    isStickyCell = isStickyColumn(columnIndex)
  }

  return (
    <Table.Cell
      css={css`
        position: ${isStickyCell ? "sticky" : "static"};
        left: ${isStickyLeft ? 0 : "auto"};
        right: ${isStickyRight ? 0 : "auto"};
        border-right: ${hasCellDividers
          ? `1px solid var(--bb-palette-white800, #000000)`
          : "0"};
        border-bottom: ${hasCellDividers
          ? `1px solid var(--bb-palette-white800, #000000)`
          : "0"};
      `}
      data-column-id={columnId}
      {...cellProps}
    >
      {cell.render("Cell")}
    </Table.Cell>
  )
}

export default Cell
