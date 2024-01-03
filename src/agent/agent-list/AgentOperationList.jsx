import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { FieldValues } from "../../layout/Grid"
import { Trans, FormattedDateTime, FormattedNumber, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import { useAgent, useAgentOperations, useUpdateAgent } from "./client"
import { pastWeek } from "../../date/range"
import { Table, useTable, toApiParams, pageCount } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import textColumn from "../../table/column/textColumn"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Descending } from "../../table/order"
import { endOfDay } from "date-fns"
import { ActionTypeTrans, OperatorTrans } from "../../trans/Action"
import { TimeTrans } from "../../trans/Date"

const Key = "AgentOperationList"

//TODO:1.40 > rm AgentOperationListTab
export const AgentOperationListTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="操作记录" en="Operating records" />
    </_Tab>
  )
}

export const AgentOperationListPanel = ({
  agentId,
  brandId,
  record,
  ...props
}) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = pastWeek()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: endOfDay(dateRange.end)
  })

  let { pageSize, from, to } = state
  let { isLoading, data, error, mutate, deleteCache } = useAgentOperations(
    isActive ? agentId : undefined,
    toApiParams({ ...state, sortby: "CreatedOn", orderby: Descending })
  )

  let columns = useColumns({ items: data?.items })

  return (
    <TabPanel tabId={Key} {...props}>
      <Stack>
        <SearchBar
          start={from}
          end={to}
          search={({ start, end, ...data } = {}) => {
            setState({
              pageIndex: 0,
              from: start,
              to: end,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </TabPanel>
  )
}

const SearchBar = ({ start, end, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      dateTimeColumn({
        accessor: "createdOn",
        Header: <TimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "operation",
        Header: <ActionTypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => (
          <AgentOperationLabel value={value} data-type={value} />
        )
      }),
      textColumn({
        accessor: "createdByUsername",
        Header: <OperatorTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )

const AgentOperation = {
  Info: "Info",
  Contact: "Contact",
  Password: "Password",
  PayPassword: "PayPassword",
  Bank: "Bank",
  Agent: "Agent"
}

const AgentOperationLabel = ({ value, ...props }) => {
  switch (value) {
    case AgentOperation.Info:
      return <Trans zh="修改代理信息" en="Edit Agent Info" {...props} />
    case AgentOperation.Contact:
      return <Trans zh="修改联系信息" en="Edit Contact Info" {...props} />
    case AgentOperation.Password:
      return <Trans zh="修改登入密码" en="Change Login Password" {...props} />
    case AgentOperation.PayPassword:
      return (
        <Trans zh="修改提款密码" en="Change Withdrawal Password" {...props} />
      )
    case AgentOperation.Bank:
      return <Trans zh="修改银行卡信息" en="Edit Bank" {...props} />
    case AgentOperation.Agent:
      return <Trans zh="修改上级" en="Edit Upper Level Agent" {...props} />
    default:
      return value
  }
}
