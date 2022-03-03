import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Heading,
  PageContent as _PageContent,
  Box,
  Stack,
  Table,
  Card,
  Button,
  InputField,
  Set,
  Divider
} from "bumbag"
import { useMeasure } from "react-use"

export const PageContent = ({ title, actionBar, children, ...props }) => {
  let [bodyRef, { height }] = useMeasure()

  return (
    <_PageContent maxWidth="unset" {...props}>
      <Stack orientation="vertical" spacing="major-2">
        <Box>
          {title && (
            <Box marginBottom="major-3">
              <Heading use="h3">{title}</Heading>
            </Box>
          )}
          {actionBar && <Stack orientation="horizontal">{actionBar}</Stack>}
        </Box>
        <Box ref={bodyRef}>{children}</Box>
      </Stack>
    </_PageContent>
  )
}

export default PageContent
