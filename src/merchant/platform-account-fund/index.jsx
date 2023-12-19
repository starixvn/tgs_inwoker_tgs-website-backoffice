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
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
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
import { FundActionDialogDisclosure } from "./FundActionDialog"
import AutoSizer from "react-virtualized-auto-sizer"
import { usePlatformAccountFund } from "./client"
import { TimeTrans } from "../../trans/Date"
import { DateFormat } from "../../date/format"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { FundChangeHistoryDialogDisclosure } from "./FundChangeHistoryDialog"
import { isObject } from "lodash-es"
import { FundActionDetailDialogDisclosure } from "./FundActionDetailDialog"

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

  let items = isObject(data) ? [data] : []
  let columns = usePlatformAccountFundColumns({
    brandId,
    items
  })

  let pageWidth = usePlatformPageContentWidth()
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Set>
        <FundActionDialogDisclosure brandId={brandId} onSubmitted={mutate} />
        {/* 
        TODO
        <AlertSettingDialogDisclosure brandId={brandId} /> 
        */}
        <FundChangeHistoryDialogDisclosure brandId={brandId} />
      </Set>
      <Text.Block fontSize="400" paddingTop="1rem">
        <Trans zh="當月資金" en="Fund of the month" />
      </Text.Block>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth

            return (
              <Table
                id="platform-fund"
                columns={columns}
                data={items}
                maxSize={{ height, width }}
                isLoading={isLoading}
                hasCellDividers
              />
            )
          }}
        </AutoSizer>
      </Box>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

export const usePlatformAccountFundColumns = ({ brandId, items = [] }) => {
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
      },
      {
        id: "credit",
        Header: <Trans zh="平台額度" en="Platform Credits" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "initialAmount",
            Header: <Trans zh="期初額度" en="Opening Balance" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            id: "addedAndDeducted",
            accessor: (row) => row,
            Header: <Trans zh="上/下分" en="Added/Deducted" />,
            disableSortBy: true,
            Cell: ({ value: record }) => {
              return (
                <FundActionDetailDialogDisclosure
                  brandId={brandId}
                  month={record?.month}
                  value={record?.creditAmount - record?.debitAmount}
                />
              )
            }
          })
        ]
      },
      {
        id: "used",
        Header: "",
        columns: [
          numberDecimalColumn({
            accessor: "creditUsed",
            Header: <Trans zh="已使用額度" en="Used Credits" />,
            disableSortBy: true
          })
        ]
      },
      {
        id: "usedPercentage",
        Header: "",
        columns: [
          numberDecimalPercentageColumn({
            accessor: "creditUsedPer",
            Header: <Trans zh="已使用額度比例" en="Used Credits P/T" />,
            disableSortBy: true
          })
        ]
      }
    ],
    [JSON.stringify(items)]
  )
}
