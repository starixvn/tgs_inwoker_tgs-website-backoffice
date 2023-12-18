import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Flex, Set, Button, Text, Icon, Level, Heading } from "bumbag"
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
import { PlatformAccountFundTypeSelect } from "./PlatformAccountFundType"
import SearchButton from "../../button/SearchButton"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today } from "../../date/range"
import { subDays } from "date-fns"
import { AlertSettingDialogDisclosure } from "./AlertSettingDialog"
import { AddOrDeductFundDialogDisclosure } from "./AddOrDeductFundDialog"
import AutoSizer from "react-virtualized-auto-sizer"
import { usePlatformAccountFund } from "./client"
import { TimeTrans } from "../../trans/Date"
import { DateFormat } from "../../date/format"

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

  //TODO: auto update data every 5 mins?
  let { isLoading, data, error, mutate, deleteCache } =
    usePlatformAccountFund(brandId)

  let pageWidth = usePlatformPageContentWidth()
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Set>
        <AddOrDeductFundDialogDisclosure brandId={brandId} />
        <AlertSettingDialogDisclosure brandId={brandId} />
      </Set>
      <Text.Block fontWeight="bold" fontSize="400" paddingTop="1rem">
        <Trans zh="當月資金" en="Fund of the month" />
      </Text.Block>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return JSON.stringify(data)
            // return <Table />
          }}
        </AutoSizer>
      </Box>
    </Set>
  )
}

//TOOD: table
const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      {
        id: "time",
        Header: "",
        columns: [
          dateTimeColumn({
            accessor: "month",
            Header: <TimeTrans />,
            disableSortBy: true,
            dateFormat: DateFormat.YearMonth,
            timeFormat: ""
          })
        ]
      }
    ],
    [JSON.stringify(items)]
  )
}
