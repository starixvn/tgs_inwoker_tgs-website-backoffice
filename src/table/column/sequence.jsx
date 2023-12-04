import React from "react"
import { css } from "@emotion/react"
import { Text } from "bumbag"
import { Trans } from "../../i18n"
import { SequenceTrans } from "../../trans/Field"

export const SequenceHeader = () => <SequenceTrans />

const SequenceCell = ({
  state = {},
  value = {},
  row: { index: rowIndex }
} = {}) => {
  let { pageIndex, pageSize } = state
  let row = rowIndex + 1
  let sequence = pageIndex * pageSize + row
  return (
    <Text.Block
      css={css`
        white-space: nowrap;
      `}
    >
      {sequence}
    </Text.Block>
  )
}

export const SequenceColumn = ({ ...props } = {}) => {
  return {
    id: "sequence",
    accessor: (row) => row,
    Header: <SequenceHeader />,
    disableSortBy: true,
    Cell: SequenceCell,
    ...props
  }
}

export default SequenceColumn
