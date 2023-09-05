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
  List,
  Columns
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
import { PlatformOverview } from "./PlatformOverview"

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

//TODO: layout?
const Body = () => {
  return (
    <Columns>
      <Columns.Column>
        <WelcomeBox />
        <PlatformOverview />
      </Columns.Column>
      <Columns.Column>
        <PlayerTableBox />
      </Columns.Column>
      <Columns.Column>
        <GameTableBox />
      </Columns.Column>
    </Columns>
  )
}

const WelcomeBox = () => {
  return "TODO: Brand Code"
}

const PlayerTableBox = () => {
  return "player table"
}

const GameTableBox = () => {
  return "game table"
}
