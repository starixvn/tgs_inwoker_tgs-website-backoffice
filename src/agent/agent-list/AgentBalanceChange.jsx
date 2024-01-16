import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { useAgentBalanceChanges } from "./client"
import { Trans, useTrans } from "../../i18n"
import { pastWeek } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab as _Tab, TabPanel } from "../../tab"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import { endOfToday, subHours } from "date-fns"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { Select } from "../../select/Select"
import AlertDialog from "../../dialog/Alert"
import { BalanceChangeRecordsTrans, BalanceTrans } from "../../trans/User"
import {
  TransactionTypeTrans,
  useTransactionTypeTrans
} from "../../trans/Action"
import { TimeTrans } from "../../trans/Date"
import { TransactionAmountTrans } from "../../trans/Field"
import {
  BalanceChangeTypeReceiveCommitTrans,
  BalanceChangeTypeReceiveRollbackTrans,
  BalanceChangeTypeTransferRollbackTrans,
  BalanceChangeTypeTransferTrans,
  DepositTrans,
  WithdrawAndCanceledTrans,
  WithdrawCanceledTrans,
  WithdrawCompletedTrans,
  useBalanceChangeTypeReceiveCommitTrans,
  useBalanceChangeTypeReceiveRollbackTrans,
  useBalanceChangeTypeTransferRollbackTrans,
  useBalanceChangeTypeTransferTrans,
  useWithdrawAndCanceledTrans,
  useWithdrawCanceledTrans
} from "../../trans/Payment"

export const Key = "BalanceChange"

export const AgentBalanceChangeTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <BalanceChangeRecordsTrans />
    </_Tab>
  )
}

export const AgentBalanceChangePanel = ({ brandId, agentId, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = newDateRange()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    transactionType: "",
    from: dateRange.start,
    to: dateRange.end,
    brandId,
    agentId
  })

  let { pageSize, transactionType, from, to } = state
  let { isLoading, data, error, mutate, deleteCache } = useAgentBalanceChanges(
    isActive
      ? toApiParams({
          ...state,
          sortby: "recordedOn",
          orderby: Descending
        })
      : undefined
  )

  let columns = useColumns({ items: data?.items })

  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        <SearchBar
          transactionType={transactionType}
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
          id="balanceChange"
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

const SearchBar = ({
  transactionType,
  start,
  end,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      transactionType,
      start,
      end
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <AgentTransactionTypeSelect name="transactionType" />
          <DateTimeRangeInput />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

//TODO:1.41 new balance change api has same columns?
const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      dateTimeColumn({
        Header: <TimeTrans />,
        accessor: "recordedOn",
        disableSortBy: true
      }),
      textColumn({
        accessor: "transactionType",
        Header: <TransactionTypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <AgentTransactionTypeLabel value={value} />
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <TransactionAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "balance",
        Header: <BalanceTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )

const newDateRange = () => ({
  start: subHours(Date.now(), 1),
  end: endOfToday()
})

const Deposit = "Deposit"
const Deposited = "Deposited"

const Withdrawal = "Withdrawal"
const WithdrawLock = "WithdrawLock"
const WithdrawCommit = "WithdrawCommit"

const CancelWithdrawal = "CancelWithdrawal"
const WithdrawRollback = "WithdrawRollback"

const Transfer = "Transfer"
const TransferRollback = "TransferRollback"

const ReceiveCommit = "ReceiveCommit"
const ReceiveRollback = "ReceiveRollback"

//TODO: also Transfer & TransferRollback?

const Adjust = "CompanyAdjust"
const AdjustTrans = {
  zh: "调账",
  en: "Balance Adjustment"
}

//TODO:1.41 rm "Dividend"?
const Dividend = "Dividend"

const AgentDividend = "AgentDividend"
const DividendTrans = {
  zh: "分紅",
  en: "Profit sharing"
}

const AgentTransactionTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTransactionTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useWithdrawAndCanceledTrans(),
      value: Withdrawal
    },
    {
      label: useWithdrawCanceledTrans(),
      value: CancelWithdrawal
    },
    {
      label: useTrans(AdjustTrans),
      value: Adjust
    },
    {
      label: useTrans(DividendTrans),
      value: AgentDividend
    },
    {
      label: useBalanceChangeTypeTransferTrans(),
      value: Transfer
    },
    {
      label: useBalanceChangeTypeTransferRollbackTrans(),
      value: TransferRollback
    },
    {
      label: useBalanceChangeTypeReceiveCommitTrans(),
      value: ReceiveCommit
    },
    {
      label: useBalanceChangeTypeReceiveRollbackTrans(),
      value: ReceiveRollback
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

const AgentTransactionTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Deposit:
    case Deposited:
      return <DepositTrans />
    case Withdrawal:
    case WithdrawLock:
      return <WithdrawAndCanceledTrans />
    case WithdrawCommit:
      return <WithdrawCompletedTrans />
    case CancelWithdrawal:
    case WithdrawRollback:
      return <WithdrawCanceledTrans />
    case Transfer:
      return <BalanceChangeTypeTransferTrans />
    case TransferRollback:
      return <BalanceChangeTypeTransferRollbackTrans />
    case ReceiveCommit:
      return <BalanceChangeTypeReceiveCommitTrans />
    case ReceiveRollback:
      return <BalanceChangeTypeReceiveRollbackTrans />
    case Adjust:
      return <Trans {...AdjustTrans} />
    case Dividend:
    case AgentDividend:
      return <Trans {...DividendTrans} />
    default:
      return value
  }
}
