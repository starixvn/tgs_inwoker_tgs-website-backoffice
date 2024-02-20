import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Popover,
  Icon,
  List
} from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { AgentDividendDistributionTrans } from "../../trans/Vip"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

const Body = ({}) => {
  return (
    <PlatformPageContent
      title={<AgentDividendDistributionTrans />}
    ></PlatformPageContent>
  )
}

const AgentDividendDist = ({}) => {
  let brandId = usePlatformId()
}

export const CodeContentPair = [Code, Content]
