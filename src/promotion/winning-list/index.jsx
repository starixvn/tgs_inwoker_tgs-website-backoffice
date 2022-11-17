import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Text, Flex, Stack, Level } from "bumbag"
import { useIsDisplayMenuByRoute, useUserBrandId } from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code, View } from "./menu"
import { useForm, FormProvider } from "react-hook-form"
import { usePromotionWinningList } from "./client"
import SearchButton from "../../button/SearchButton"
import { PageContent } from "../../page/Content"
import AlertDialog from "../../dialog/Alert"
import { Trans, useTrans } from "../../i18n"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import BrandBar from "../../report/BrandBar"
import textColumn from "../../table/column/textColumn"
import { InputField } from "../../input/Input"
import { today, yesterday } from "../../date/range"
import { startOfToday, subDays } from "date-fns"
import dateTimeColumn from "../../table/column/dateTime"
import { PromotionWinningDetailDialogDisclosure } from "./PromotionWinningDetailDialog"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    promotionName: "",
    player: "",
    from: undefined,
    to: undefined
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  //TODO: sortby
  let { isLoading, data, error, mutate, deleteCache } = usePromotionWinningList(
    brandId ? { ...toApiParams(state) /*sortby: "number"*/ } : undefined
  )

  let columns = useColumns({
    items: data?.items ?? []
  })
  //TODO: page title
  return (
    <PageContent
      title={<Trans zh="中奖列表" en="Winning List" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
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
      }
    >
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
        getRowId={(row) => row.id}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ from, to, search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: { from, to }
  })

  let nameInputPlaceholder = useTrans({
    zh: "活动名",
    en: "Promotion name"
  })

  let usernameInputPlaceholder = useTrans({
    zh: "用户名",
    en: "user name"
  })

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
            name="name"
            showEmptyFieldValueAddonAfter
            placeholder={nameInputPlaceholder}
            minLength={2}
            maxLength={256}
          />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
            minLength={2}
            maxLength={256}
          />
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

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "orderId",
        Header: <Trans zh="中奖 ID" en="Order ID" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "dateTime",
        Header: <Trans zh="中奖时间" en="Date & Time" />
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="玩家用戶名" en="Username" />,
        disableSortBy: true
      }),
      /*
      textColumn({
        accessor: "type",
        Header: <Trans zh="活动类型" en="Promotion Type" />,
        disableSortBy: true
      }),
      */
      textColumn({
        accessor: "promotionId",
        Header: <Trans zh="活动 ID" en="Promotion ID" />,
        disableSortBy: true
      }),
      textColumn({
        id: "detail",
        accessor: (row) => row,
        Header: <Trans zh="详情" en="Detail" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Set alignX="center">
              <PromotionWinningDetailDialogDisclosure />
            </Set>
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
