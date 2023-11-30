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
import { PlatformAccountFundTypeSelect } from "./PlatformAccountFundType"
import SearchButton from "../../button/SearchButton"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today } from "../../date/range"
import { usePlatformAccountFundList } from "./client"
import { subDays } from "date-fns"
import { AlertSettingDialogDisclosure } from "./AlertSettingDialog"
import { TopUpDialogDisclosure } from "./TopUpDialog"

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

  let todayRange = today()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    from: todayRange.start,
    to: todayRange.end
  })

  //TODO: need?
  /*
  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])
  */

  let { isLoading, data, error, mutate, deleteCache } =
    usePlatformAccountFundList(toApiParams(state))

  //TODO: how to get available height?
  let [ref, measure] = useMeasure()
  console.log("measure", measure)

  return (
    <Set ref={ref} orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          from={state.from}
          to={state.to}
          isLoading={isLoading}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate(null, true)
          }}
        />
        <Set>
          <AlertSettingDialogDisclosure />
          <TopUpDialogDisclosure />
        </Set>
      </Level>
      <Box flex="1 0 50%">{JSON.stringify(data)}</Box>
    </Set>
  )
}

//TODO: confirm api params
const SearchBar = ({ type, from, to, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      type,
      from,
      to
    }
  })

  const onSubmit = (data) => search?.(data)

  let QueryMaxRangeDays = 31
  let todayRange = today()
  let DataRetentionDays = 365
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <PlatformAccountFundTypeSelect name="type" />
          <DateInputRange
            showDateDropdownMenu
            maxRangeDays={QueryMaxRangeDays}
            minDate={minDate}
            maxDate={maxDate}
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
            dateDropdownMenuProps={{
              thisWeekProps: {
                end: maxDate
              },
              thisMonthProps: {
                end: maxDate
              }
            }}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}
