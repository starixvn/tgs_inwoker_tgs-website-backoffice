import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Button,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure, DeleteDisclosure } from "../../dialog/Disclosure"
import { usePaymentList } from "../../payment/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import Backdrop from "../../dialog/Backdrop"
import { DeleteText } from "../../button/ActionButtons"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import dateTimeColumn from "../../table/column/dateTime"
import { AddPaymentDisclosure, EditPaymentDisclosure } from "./Payment"

export const PaymentListDialog = ({ dialog, onSubmitted }) => {
  let title = useTrans({
    zh: "支付厂商列表",
    en: "Payment Provider List"
  })
  let { isLoading, data, error, mutate, deleteCache } = usePaymentList()

  let items = data ?? []
  let columns = useColumns({ items, mutate })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      title={title}
      showCloseButton
      {...dialog}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      hideOnClickOutside={false}
      width="60vw"
      maxWidth="80vw"
    >
      <FieldStack>
        <ActionBar onSubmitted={mutate} />
        <Table columns={columns} data={items} />
      </FieldStack>
    </Dialog.Modal>
  )
}

const ActionBar = ({ onSubmitted }) => {
  return (
    <Box alignX="right">
      {/* <AddPaymentDisclosure onSubmitted={onSubmitted} /> */}
    </Box>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "code",
        Header: <Trans zh="支付厂商代码" en="Payment Provider Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="支付厂商名称" en="Payment Provider Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "description",
        Header: <Trans zh="简介" en="Description" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "updatedOn",
        Header: <Trans zh="最新更新" en="Updated On" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "updatedByUsername",
        Header: <Trans zh="更改者" en="Updated By" />,
        disableSortBy: true
      })
    ]

    if (hasUpdateAuth) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          Header: <Trans zh="Actions" en="Actions" />,
          disableSortBy: true,
          Cell: ({ value }) => (
            <Set alignX="center">
              {/* <EditPaymentDisclosure record={value} /> */}
              {/* <DeleteDialogDisclosure record={value} onSubmitted={mutate} /> */}
            </Set>
          )
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}
