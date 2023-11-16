import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Flex, Set, Button, Text, Icon, Level } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans, useTrans } from "../../i18n"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import { View, Update } from "./menu"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import AlertDialog from "../../dialog/Alert"
import { useMeasure } from "react-use"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<Trans zh="平台資金" en="Account Funds" />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  let brandId = usePlatformId()
  //TODO: how to get available height?
  let [ref, measure] = useMeasure()
  console.log("measure", measure)

  return (
    <Set ref={ref} orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile"></Level>
      <Box flex="1 0 50%"></Box>
    </Set>
  )
}

const SearchBar = ({ search, ...props }) => {
  let formMethods = useForm({
    defaultValues: {}
  })
}
