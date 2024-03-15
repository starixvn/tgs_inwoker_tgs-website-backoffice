import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Box } from "bumbag"
import { matchSorter } from "match-sorter"
import { head } from "lodash"

const paris = [
  [
    "WaitingPayment",
    css`
      background: #ffa843;
    `
  ],
  [
    "Review",
    css`
      background: #ffd643;
    `
  ],
  [
    "Approved",
    css`
      background: #58b95c;
    `
  ],
  [
    "Paid",
    css`
      background: #58b95c;
    `
  ],
  [
    "Rejected",
    css`
      background: #ce6f6b;
    `
  ],
  [
    "Invalid",
    css`
      background: #e8e8ee;
    `
  ]
]

export const LabelColorBox = ({ value = "", children, ...props }) => {
  let variantStyle = head(matchSorter(paris, value, { keys: [([key]) => key] }))
  return (
    <Box
      css={css`
        border-radius: 5px;
        padding: 0.25rem 0.75rem;
        white-space: nowrap;
        ${variantStyle}
      `}
      {...props}
    >
      {children}
    </Box>
  )
}
