import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, useModalState, Level } from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import { AgentDividendDistributionTrans } from "../../trans/Vip"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { useAgentDividendList } from "./client"
import AutoSizer from "react-virtualized-auto-sizer"
import SearchButton from "../../button/SearchButton"
import textColumn from "../../table/column/textColumn"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"
import {
  AgentProfitSharingIntervalTrans,
  CumulativeNegativeDividendAmountTrans,
  DividendAmountTrans,
  NegativeDividendTrans,
  useAgentProfitSharingIntervalTrans,
  useNegativeDividendTrans
} from "../../trans/Agent"
import { formatYearMonthDay } from "../../date/format"
import dateTimeColumn from "../../table/column/dateTime"
import { VerifiedTimeTrans, useVerifiedTimeTrans } from "../../trans/Date"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { BalanceOfCurrentPeriodTrans, CSNoteTrans } from "../../trans/Field"
import { StatusTrans } from "../../trans/Status"
import { ActionTrans } from "../../trans/Action"
import {
  AgentDividendStatusLabel,
  AgentDividendStatusSelect
} from "./AgentDividendStatus"
import { VerifyAgentDividendDialogDisclosure } from "./VerifyAgentDividendDialog"
import {
  LiableOrNotSwitchLabel,
  LiableOrNotSwitchSelect
} from "../../switch/LiableOrNotSwitch"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { InputField } from "../../input/Input"
import { startOfNextDay } from "../../date/startOfNextDay"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<AgentDividendDistributionTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const FromField = "from"
const ToField = "to"
const ApprovedFromField = "approvedFrom"
const ApprovedToField = "approvedTo"

const Body = ({}) => {
  let brandId = usePlatformId()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    status: "ReadyToApprove",
    sortBy: [{ id: ToField, desc: true }]
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, emptyData } = useAgentDividendList({
    ...toApiParams(state),
    to: startOfNextDay(state.to),
    approvedTo: startOfNextDay(state.approvedTo)
  })

  let items = data?.items
  let columns = useColumns({
    items,
    mutate
  })

  let pageWidth = usePlatformPageContentWidth()

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          status={state.status}
          isLoading={isLoading}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate(undefined, true)
          }}
        />
      </Level>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={items}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(state?.pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                stickyHead
              />
            )
          }}
        </AutoSizer>
      </Box>
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const SearchBar = ({ status, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      negativeAgentDividendCarryForward: "",
      status
    }
  })

  let usenamePlaceholder = useUserNameTrans()
  let timeRangePlaceholder = useAgentProfitSharingIntervalTrans()
  let verifiedTimePlaceholder = useVerifiedTimeTrans()
  let liableOrNotPlaceholder = useNegativeDividendTrans()

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <AgentDividendStatusSelect name="status" />
          <InputField
            name="agentUsername"
            showEmptyFieldValueAddonAfter
            placeholder={usenamePlaceholder}
          />
          <DateInputRangeField
            label={timeRangePlaceholder}
            showDateDropdownMenu
            startProps={{
              name: FromField
            }}
            endProps={{
              name: ToField
            }}
          />
          <DateInputRangeField
            label={verifiedTimePlaceholder}
            showDateDropdownMenu
            startProps={{
              name: ApprovedFromField
            }}
            endProps={{
              name: ApprovedToField
            }}
          />
          <LiableOrNotSwitchSelect
            name="negativeAgentDividendCarryForward"
            placeholder={liableOrNotPlaceholder}
          />

          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], mutate }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "agentUsername",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "range",
        accessor: (row) => row,
        Header: <AgentProfitSharingIntervalTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let from = formatYearMonthDay(record?.from) ?? ""
          let to = formatYearMonthDay(record?.to)
          return `${from} - ${to}`
        }
      }),
      dateTimeColumn({
        accessor: "approvedOn",
        Header: <VerifiedTimeTrans />,
        placeholder: "-",
        disableSortBy: true
      }),
      textColumn({
        accessor: "negativeAgentDividendCarryForward",
        Header: <NegativeDividendTrans />,
        disableSortBy: true,
        Cell: LiableOrNotSwitchLabel
      }),
      numberDecimalColumn({
        accessor: "negativeAgentDividendAmount",
        Header: <CumulativeNegativeDividendAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "agentDividendAmount",
        Header: <BalanceOfCurrentPeriodTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "actualAgentDividendAmount",
        Header: <DividendAmountTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: AgentDividendStatusLabel
      }),
      textColumn({
        accessor: "remark",
        Header: <CSNoteTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        disableSortBy: true,
        Header: <ActionTrans />,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <VerifyAgentDividendDialogDisclosure
                record={record}
                onSubmitted={mutate}
              />
            </Set>
          )
        }
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
