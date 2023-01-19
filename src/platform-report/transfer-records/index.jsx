import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  Text,
  Link,
  FieldStack,
  Alert,
  List,
  Popover,
  Icon
} from "bumbag"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Trans, useTrans, FormattedNumberDecimal } from "../../i18n"
import { Code } from "./menu"
import DownloadButton from "../../button/DownloadButton"
import { useTable, Table, pageCount, toApiParams } from "../../table"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  let title = <Trans zh="转帐纪录" en="Transfer Records" />

  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={title}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()
  return (
    <Set orientation="vertical" isFilled height="100%">
      {brandId}
    </Set>
  )
}
