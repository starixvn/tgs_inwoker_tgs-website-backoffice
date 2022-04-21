import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../user/context"
import Disclosure from "../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../i18n"
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../table"
import LoadingBackdrop from "../dialog/LoadingBackdrop"
import dateTimeColumn from "../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../table/column/numberColumn"
import AlertDialog from "../dialog/Alert"
import textColumn from "../table/column/textColumn"
import { formatDateTime } from "../date/format"
import { FieldValues } from "../layout/Grid"
import { formatNumberDecimal } from "../number/format"
import Separator from "../layout/Separator"
import { startOfNextDay } from "../date/startOfNextDay"

export const AdditionalExpenseDialogDisclosure = ({
  value,
  useFetch,
  searchParams,
  ...props
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <DetailDialog
          dialog={dialog}
          useFetch={useFetch}
          searchParams={searchParams}
        />
      )}
    </>
  )
}

const DetailDialog = ({ useFetch, searchParams, dialog, ...props }) => {
  let { state, setPageIndex, setSortOrder } = useTable()
  let { isLoading, data, error, mutate, deleteCache } = useFetch(searchParams)

  let items = data?.additionalExpenses
  let columns = useColumns({ items })

  let title = useTrans({
    zh: "额外支出细项",
    en: "Additional Expenses Detail"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
  }

  return (
    <Dialog.Modal
      title={title}
      hideOnClickOutside={false}
      {...dialog}
      showCloseButton
      placement="top"
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      {...props}
    >
      <FieldStack>
        <Table
          columns={columns}
          data={items}
          controlledState={state}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
        />
      </FieldStack>
    </Dialog.Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "additionalExpensesType",
        Header: <Trans zh="类型" en="Type" />,
        Cell: ({ value }) => <AdditionalExpenseTypeLabel value={value} />
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="金额" en="Amount" />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}

const AllAgent = "AllAgent"
const AllAgentTrans = {
  zh: "全民代理",
  en: "All Agent"
}

export const AdditionalExpenseType = {
  AllAgent
}

export const AdditionalExpenseTypeLabel = ({ value = "", ...props }) => {
  switch (value) {
    case AllAgent:
      return <Trans {...AllAgentTrans} {...props} />
    default:
      return value
  }
}
