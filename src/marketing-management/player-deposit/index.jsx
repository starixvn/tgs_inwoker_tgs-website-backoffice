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
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import BrandBar from "../../report/BrandBar"
import { SortOrder, fromOrderStringToNumber } from "../../table/order"
import { NumberInput } from "../../input/NumberInput"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { today, yesterday } from "../../date/range"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import {
  usePlayerDepositReportList,
  useFirstDepositPlayerList,
  useNoSecondDepositPlayerList,
  useDailyDepositPlayerList
} from "./client"
import numberColumn from "../../table/column/numberColumn"
import { PlayerListDialogDisclosure } from "./PlayerListDialog"
import { startOfNextDay } from "../../date/startOfNextDay"
import textColumn from "../../table/column/textColumn"
import { subDays, parse } from "date-fns"
import { upperFirst } from "lodash-es"

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
    <Set orientation="vertical" isFilled height="100%">
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

const mapSortBy = (value = "") => {
  switch (value) {
    case "reportDate":
      return "ReportDate"
    case "agentUserName":
      return "AgentId"
    case "firstDepositCount":
      return "FirstDepositPlayers"
    case "noSecondDepositCount":
      return "NoSecondDepositPlayers"
    case "depositCount":
      return "DepositPlayers"
    default:
      return value
  }
}

const BodyContent = ({ brandId }) => {
  let dateRange = yesterday()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    agentUsername: "",
    from: dateRange.start,
    to: dateRange.end,
    sortBy: [{ id: "reportDate", desc: false }]
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
    usePlayerDepositReportList({
      ...toApiParams(state, {
        toSortBy: mapSortBy,
        toOrderBy: fromOrderStringToNumber
      }),
      from,
      to: startOfNextDay(to)
    })

  let columns = useColumns({
    items: data?.items,
    brandId,
    agentUsername
  })
  return (
    <PageContent
      title={<Trans zh="玩家存款报表" en="Player Deposit Report" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            agentUsername={agentUsername}
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
        total={data?.items?.length > 0 && data?.total}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        stickyHead
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

  let DataRetentionDays = 90
  let todayRange = today()
  let minDate = subDays(todayRange.start, DataRetentionDays)

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
          />
          <DateInputRange
            id="date-range"
            showDateDropdownMenu
            minDate={minDate}
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

const toDate = (value) => {
  let date = parse(value, "yyyy/MM/dd", new Date())
  return date
}

const useColumns = ({ brandId, items = [] }) => {
  return useMemo(() => {
    let columns = [
      dateTimeColumn({
        id: "reportDate",
        accessor: "reportDate",
        toValue: toDate,
        dateFormat: "MM/dd",
        timeFormat: false,
        Header: <Trans zh="日期" en="Date" />
      }),
      textColumn({
        accessor: "agentUserName",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      numberColumn({
        id: "firstDepositCount",
        accessor: (row) => row,
        Header: <Trans zh="首存人数" en="First Deposit Count" />,
        TotalCell: ({ value }) => {
          return <FormattedNumber value={value} />
        },
        Cell: ({ value: record }) => {
          return (
            <PlayerListDialogDisclosure
              value={record.firstDepositCount}
              brandId={brandId}
              agentUsername={record?.agentUserName}
              date={record.reportDate}
              useFetch={useFirstDepositPlayerList}
            />
          )
        }
      }),
      numberColumn({
        id: "noSecondDepositCount",
        accessor: (row) => row,
        Header: (
          <Trans
            zh="没进行第二次存款玩家人数"
            en="No Second Deposit Player Count"
          />
        ),
        TotalCell: ({ value }) => {
          return <FormattedNumber value={value} />
        },
        Cell: ({ value: record }) => {
          return (
            <PlayerListDialogDisclosure
              value={record.noSecondDepositCount}
              brandId={brandId}
              agentUsername={record?.agentUserName}
              date={record.reportDate}
              useFetch={useNoSecondDepositPlayerList}
            />
          )
        }
      }),
      numberColumn({
        id: "depositCount",
        accessor: (row) => row,
        Header: <Trans zh="当日玩家存款人数" en="Deposit Player Count" />,
        TotalCell: ({ value }) => {
          return <FormattedNumber value={value} />
        },
        Cell: ({ value: record }) => {
          return (
            <PlayerListDialogDisclosure
              value={record.depositCount}
              brandId={brandId}
              agentUsername={record?.agentUserName}
              date={record.reportDate}
              useFetch={useDailyDepositPlayerList}
            />
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
