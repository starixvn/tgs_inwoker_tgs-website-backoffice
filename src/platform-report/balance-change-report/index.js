import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Level, Text, Link } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { API } from "./client"
import subDays from "date-fns/subDays"
import { startOfNextDay } from "../../date/startOfNextDay"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import startOfToday from "date-fns/startOfToday"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { urlWith } from "../../client"
import { isDev } from "../../env"
import sequenceColumn from "../../table/column/sequence"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

export const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <ReportContent brandId={brandId} />}
    </Set>
  )
}

const ReportContent = ({ brandId }) => {
  let dateRange = today()
  let DataRetentionDays = 14
  let minDate = subDays(dateRange.start, DataRetentionDays)
  let maxDate = startOfToday()

  let columns = useColumns({
    // items: data?.items
  })

  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            minDate={minDate}
            maxDate={maxDate}
            // maxRangeDays={QueryMaxRangeDays}
            // isLoading={isLoading}
            // search={({ start, end, ...data }) => {
            //   setState({
            //     pageIndex: 0,
            //     from: start,
            //     to: end,
            //     ...data
            //   })
            //   mutate()
            // }}
          />
          {/* {data?.items?.length > 0 && (
            <Box>
              <Button
                id="export-report"
                disabled={isLoading}
                use="a"
                href={urlWith(toSearchParams(), `${API}/export`)}
                download
              >
                <Trans zh="汇出" en="Export" />
              </Button>
            </Box>
          )} */}
        </Level>
      }
      title={<Trans zh="帳變報表" en="Balance Change Report" />}
    >
      {/* <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        foot={data?.items?.length > 0}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />} */}
    </PageContent>
  )
}

const SearchBar = ({
  brandId,
  username,
  start,
  end,
  minDate,
  maxDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      start,
      end
    }
  })

  let usernamePlaceholder = useTrans({
    zh: "用户名",
    en: "User name"
  })

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernamePlaceholder}
          />
          <DateInputRange
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            required
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, start, end, items = [] }) => {
  return useMemo(
    () => [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "transactionAmount",
        Header: <Trans zh="交易金额" en="Transaction amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "beforeAmount",
        Header: <Trans zh="余额 (前)" en="Before" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "afterAmount",
        Header: <Trans zh="余额 (后)" en="After" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "createdByUsername",
        Header: <Trans zh="操作者" en="Operator" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
