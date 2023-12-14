import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef
} from "react"
import { css, Global } from "@emotion/react"
import { Icon, Table, Box } from "bumbag"
import { useMeasure } from "react-use"
import {
  faCaretUp,
  faCaretDown,
  faSort
} from "@fortawesome/free-solid-svg-icons"

const isStickyNotApplicable = (cellWidth, maxWidth) => {
  return cellWidth * 2 > maxWidth
}

export const HeadCell = ({
  column,
  columnIndex,
  isFirstColumn,
  isLastColumn,
  table,
  ...props
}) => {
  const StickyHeadZIndex = 1
  let {
    stickyHead,
    stickyLeft,
    stickyRight,
    maxSize,
    setStickyColumn,
    hasCellDividers
  } = table

  let columnProps = column.getHeaderProps({
    ...column?.headCell,
    ...column?.getSortByToggleProps()
  })

  let isStickyLeft = stickyHead && stickyLeft && isFirstColumn
  let isStickyRight = stickyHead && stickyRight && isLastColumn
  //TODO: support multiple sticky columns?
  let isStickyCell = isStickyLeft || isStickyRight
  let [cellRef, cellRefMeasure] = useMeasure()

  if (
    isStickyCell &&
    Number.isFinite(maxSize?.width) &&
    Number.isFinite(cellRefMeasure?.width) &&
    isStickyNotApplicable(cellRefMeasure?.width, maxSize?.width)
  ) {
    isStickyCell = false
  }
  setStickyColumn(columnIndex, isStickyCell)

  return (
    <Table.HeadCell
      ref={cellRef}
      css={css`
        position: ${isStickyCell ? "sticky" : "static"};
        left: ${isStickyLeft ? 0 : "auto"};
        right: ${isStickyRight ? 0 : "auto"};
        z-index: ${isStickyCell ? StickyHeadZIndex + 1 : "auto"};
        background-color: var(--bb-palette-white600, #000000);
        border-right: ${hasCellDividers
          ? `1px solid var(--bb-palette-white800, #000000)`
          : "0"};
        border-bottom: ${hasCellDividers
          ? `1px solid var(--bb-palette-white800, #000000)`
          : "0"};
      `}
      {...props}
      {...columnProps}
    >
      <div
        css={css`
          overflow: hidden;
          text-overflow: ellipsis;
        `}
        {...column?.headCell?.bodyProps}
      >
        {column.render("Header")}
        {column.isSorted ? (
          column.isSortedDesc ? (
            <Icon icon={faCaretDown} color="blue" type="font-awesome" />
          ) : (
            <Icon icon={faCaretUp} color="blue" type="font-awesome" />
          )
        ) : (
          column.canSort &&
          !column.disableSortBy && (
            <Icon icon={faSort} type="font-awesome" opacity="0.4" />
          )
        )}
      </div>
    </Table.HeadCell>
  )
}

export default HeadCell
