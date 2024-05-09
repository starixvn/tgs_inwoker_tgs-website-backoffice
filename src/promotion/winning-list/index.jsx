import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set, Level } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import { useIsDisplayMenuByRoute, useUserBrandId } from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code, View } from "./menu"
import { useForm, FormProvider } from "react-hook-form"
import { usePromotionWinningList } from "./client"
import SearchButton from "../../button/SearchButton"
import AlertDialog from "../../dialog/Alert"
import DateTimeRangeInput, {
  DateInputRange
} from "../../date/DateTimeRangeInput"
import BrandBar from "../../report/BrandBar"
import textColumn from "../../table/column/textColumn"
import { InputField } from "../../input/Input"
import { today, yesterday } from "../../date/range"
import { startOfToday, subDays, endOfToday } from "date-fns"
import dateTimeColumn from "../../table/column/dateTime"
import { PromotionWinningDetailDialogDisclosure } from "./PromotionWinningDetailDialog"
import { Descending } from "../../table/order"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"
import {
  PromotionNameTrans,
  WinningContentTrans,
  WinningListTrans,
  WinningOrderIdTrans,
  usePromotionNameTrans
} from "../../trans/Promotion"
import { TimeTrans } from "../../trans/Date"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<WinningListTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    promotionName: "",
    userName: "",
    from: subDays(startOfToday(new Date()), 3),
    to: new Date()
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, emptyData } = usePromotionWinningList({
    ...toApiParams(state),
    sortby: "CreatedOn",
    orderby: Descending
  })

  let columns = useColumns({
    items: data?.items ?? [],
    brandId
  })

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          promotionName={state.promotionName}
          userName={state.userName}
          from={state.from}
          to={state.to}
          search={({ ...data } = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
      </Level>
      <Table
        id="winning-list"
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state?.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        stickyHead
      />
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const SearchBar = ({
  promotionName,
  userName,
  from,
  to,
  search,
  isLoading
}) => {
  let formMethods = useForm({
    defaultValues: { promotionName, userName, from, to }
  })

  let nameInputPlaceholder = usePromotionNameTrans()

  let usernameInputPlaceholder = useUserNameTrans()

  const onSubmit = (data) => search(data)

  let QueryMaxRangeDays = 31
  let todayRange = today()
  let DataRetentionDays = 90
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="promotionName"
            showEmptyFieldValueAddonAfter
            placeholder={nameInputPlaceholder}
            minLength={2}
            maxLength={256}
          />
          <InputField
            name="userName"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
            minLength={2}
            maxLength={256}
          />
          <DateTimeRangeInput
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

const useColumns = ({ items = [], brandId }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "recordId",
        Header: <WinningOrderIdTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <TimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "userName",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "promotionName",
        Header: <PromotionNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <WinningContentTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <PromotionWinningDetailDialogDisclosure
                brandId={brandId}
                recordId={record.recordId}
              />
            </Set>
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
