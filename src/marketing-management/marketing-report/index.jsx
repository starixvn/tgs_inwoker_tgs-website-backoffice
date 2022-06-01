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
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { yesterday } from "../../date/range"
import {
  usePlayerMarketingReport,
  useRegisteredPlayerList,
  useGamePlayerList
} from "./client"
import numberColumn from "../../table/column/numberColumn"
import { useFirstDepositPlayerList } from "../player-deposit/client"
import { RegisteredPlayerListDialogDisclosure } from "./RegisteredPlayerListDialog"
import { PlayerListDialogDisclosure as FirstDepositPlayerListDialogDisclosure } from "../player-deposit/PlayerListDialog"
import { GamePlayerListDialogDisclosure } from "./GamePlayerListDialog"

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
    usePlayerMarketingReport(toApiParams(state))

  let columns = useColumns({
    items: data?.items,
    brandId,
    agentUsername,
    from,
    to
  })
  return (
    <PageContent
      title={<Trans zh="市場報表" en="Marketing Report" />}
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
  let playerListDialogTitle = useTrans({
    zh: "玩家清單",
    en: "Player List"
  })

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
        id: "registeredCount",
        accessor: (row) => row,
        Header: <Trans zh="注册人数" en="Registered Count" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <RegisteredPlayerListDialogDisclosure
              value={record.registeredCount}
              brandId={brandId}
              agentUsername={agentUsername}
              date={record.reportDate}
              title={playerListDialogTitle}
              useFetch={useRegisteredPlayerList}
            />
          )
        }
      }),
      numberColumn({
        id: "firstFundInCount",
        accessor: (row) => row,
        Header: <Trans zh="首存人数" en="First Deposit Count" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <FirstDepositPlayerListDialogDisclosure
              value={record.registeredCount}
              brandId={brandId}
              agentUsername={agentUsername}
              date={record.reportDate}
              title={playerListDialogTitle}
              useFetch={useFirstDepositPlayerList}
            />
          )
        }
      }),
      numberColumn({
        id: "gameCount",
        accessor: (row) => row,
        Header: <Trans zh="游戏人数" en="Game Count" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <GamePlayerListDialogDisclosure
              value={record.registeredCount}
              brandId={brandId}
              agentUsername={agentUsername}
              date={record.reportDate}
              title={playerListDialogTitle}
              useFetch={useGamePlayerList}
            />
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
