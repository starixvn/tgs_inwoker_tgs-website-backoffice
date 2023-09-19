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
import { Trans } from "../../i18n"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <PlatformDashboardPage />
}

export const CodeContentPair = [Code, Content]

export const PlatformDashboardPage = () => {
  return (
    <PlatformPageContent title={<Trans zh="Dashboard" en="Dashboard" />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  return "dashboard page"
}
