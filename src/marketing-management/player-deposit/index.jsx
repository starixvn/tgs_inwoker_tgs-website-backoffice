import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  Flex,
  Button,
  Text,
  Switch,
  Input,
  Stack,
  Dialog,
  Level
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import BrandBar from "../../report/BrandBar"
import { SortOrder } from "../../table/order"
import { NumberInput } from "../../input/NumberInput"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { yesterday } from "../../date/range"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { usePlayerDepositCountList } from "./client"
import numberColumn from "../../table/column/numberColumn"

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
        id="page-merchant-bar"
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  let dateRange = yesterday()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    agentUsername: "",
    from: dateRange.start,
    to: dateRange.end
  })

  const reset = () => {
    mutate(null)
    deleteCache()
  }

  useEffect(() => {
    reset()
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { agentUsername, from, to } = state
  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerDepositCountList(toApiParams(state))

  let columns = useColumns({
    items: data?.items,
    brandId,
    agentUsername,
    from,
    to
  })
  return (
    <PageContent
      title={<Trans zh="玩家存款报表" en="Player Deposit Report" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            from={state?.from}
            to={state?.to}
            search={(data) => {
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
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  brandId,
  agentUsername,
  from,
  to,
  search,
  isLoading,
  ...props
}) => {
  let QueryMaxRangeDays = 31

  let agentUsernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent Username"
  })

  let formMethods = useForm({
    defaultValues: {
      agentUsername,
      from,
      to
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="agentUsername"
            autoFocus
            showEmptyFieldValueAddonAfter
            placeholder={agentUsernamePlaceholder}
            required
          />
          <DateInputRange
            showDateDropdownMenu
            maxRangeDays={QueryMaxRangeDays}
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
            required
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, items = [], agentUsername }) => {
  return useMemo(() => {
    let columns = [
      dateTimeColumn({
        accessor: "reportDate",
        dateFormat: "MM/dd",
        timeFormat: false,
        Header: <Trans zh="日期" en="Date" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "firstFundInCount",
        Header: <Trans zh="首存人数" en="First Deposit Count" />,
        disableSortBy: true
      }),
      numberColumn({
        // accessor: "registeredCount",
        id: "noSecondDepositCount",
        accessor: (row) => row,
        Header: (
          <Trans
            zh="没进行第二次存款玩家人数"
            en="No Second Deposit Player Count"
          />
        ),
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return record.registeredCount
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
