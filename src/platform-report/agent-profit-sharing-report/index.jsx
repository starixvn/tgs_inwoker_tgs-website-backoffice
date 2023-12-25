import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
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
  List
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  Trans,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import { Code } from "./menu"
import { PlatformAgentProfitSharingReport } from "./PlatformAgentProfitSharingReport"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { AgentProfitSharingReportTrans } from "../../trans/Agent"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()

  if (!isDisplay) {
    return null
  }

  return <Report />
}

export const CodeContentPair = [Code, Content]

const Report = () => {
  let title = <AgentProfitSharingReportTrans />
  return (
    <PlatformPageContent title={title}>
      <ReportBody />
    </PlatformPageContent>
  )
}

const ReportBody = ({}) => {
  let brandId = usePlatformId()
  return <PlatformAgentProfitSharingReport brandId={brandId} />
}
