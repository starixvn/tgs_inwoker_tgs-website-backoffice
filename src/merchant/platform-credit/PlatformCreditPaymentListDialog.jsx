import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Dialog
} from "bumbag"
import { useIsDisplayMenuByRoute, useUserLicenseeId } from "../../user/context"
import { Disclosure, EditDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { View } from "./menu"
import { usePlatformCreditPaymentList } from "./client"
import clone from "clone-deep"
import {
  useTrans,
  Trans,
  FormattedNumber,
  FormattedNumberDecimal
} from "../../i18n"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInput } from "../../input/NumberInput"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import textColumn from "../../table/column/textColumn"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import dateTimeColumn from "../../table/column/dateTime"

export const PlatformCreditPaymentListDialogDisclosure = ({
  record,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="历史" en="Payment Records" />
      </Disclosure>
      {dialog.visible && <ListDialog record={record} dialog={dialog} />}
    </>
  )
}

const ListDialog = ({ record, onSubmitted, dialog, ...props }) => {
  let title = useTrans({
    zh: "历史",
    en: "Payment Records"
  })
  let { id } = record
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    id
  })

  let { isLoading, data, error, mutate, deleteCache } =
    usePlatformCreditPaymentList(id, {
      ...toApiParams(state),
      sortby: "CreatedOn",
      orderby: SortOrder.Descending
    })

  let items = data?.items
  let columns = useColumns({ items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      id="platform-credit-payment-list-dialog"
      {...dialog}
      title={title}
      showCloseButton
      showActionButtons={false}
      hideOnClickOutside={false}
    >
      <Table
        id="platform-credit-payments"
        columns={columns}
        data={items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state?.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
    </Dialog.Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="操作时间" en="Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "amount",
        Header: <Trans zh="付款金额" en="Amount" />,
        disableSortBy: true,
        Cell: ({ value }) => <FormattedNumberDecimal value={value} />
      }),
      textColumn({
        accessor: "balance",
        Header: <Trans zh="额度余额" en="Balance" />,
        disableSortBy: true,
        Cell: ({ value }) => <FormattedNumberDecimal value={value} />
      })
    ],
    [JSON.stringify(items)]
  )
}
