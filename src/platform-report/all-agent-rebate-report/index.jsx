import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import { Heading, Stack, Box, Set } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  FormattedNumber,
  Trans,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import { Code } from "./menu"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { AllAgentRebateReport } from "./AllAgentRebateReport"

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
  let title = <Trans zh="全民代理返水报表" en="All Agent Rebate Report" />
  return (
    <PlatformPageContent title={title}>
      <ReportBody />
    </PlatformPageContent>
  )
}

const ReportBody = ({}) => {
  let brandId = usePlatformId()
  return <AllAgentRebateReport brandId={brandId} />
}
