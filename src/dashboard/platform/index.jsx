import React, { useState, useEffect, useMemo, useLayoutEffect } from "react"
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
  List,
  Columns,
  useBreakpoint,
  useBreakpointValue
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
import { Overview } from "./Overview"
import { TopPlayerTable } from "./TopPlayerTable"
import { TopGameTable } from "./TopGameTable"
import { useMeasure } from "react-use"

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
  //TODO: title with brand code?
  return (
    <PlatformPageContent>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  return (
    <Columns>
      <Columns.Column spread={3}>
        <WelcomeBox />
        <Overview />
      </Columns.Column>
      <Columns.Column spread={9}>
        <Columns>
          <Columns.Column>
            <PlayerTableBox />
          </Columns.Column>
          <Columns.Column>
            <GameTableBox />
          </Columns.Column>
        </Columns>
      </Columns.Column>
    </Columns>
  )
}

const WelcomeBox = () => {
  let isMobile = useBreakpoint("mobile")
  let isDesktop = useBreakpoint("desktop")
  let isWidescreen = useBreakpoint("widescreen")
  let isFullHD = useBreakpoint("fullHD")
  return "TODO: Brand Code"
}

const PlayerTableBox = () => {
  let id = usePlatformId()
  return <TopPlayerTable brandId={id} />
}

const GameTableBox = () => {
  let id = usePlatformId()
  return <TopGameTable brandId={id} />
}
