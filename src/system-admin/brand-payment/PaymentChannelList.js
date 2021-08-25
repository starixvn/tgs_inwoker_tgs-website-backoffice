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
import { usePaymentChannelList } from "../../payment/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans, useTrans } from "../../i18n"
import { AddPaymentChannelDisclosure } from "./PaymentChannel"

export const PaymentChannelListDialog = ({ dialog, onSubmitted }) => {
  let title = useTrans({
    zh: "支付通道列表",
    en: "Payment Channel List"
  })

  let { isLoading, data, error, mutate, deleteCache } = usePaymentChannelList()

  let items = data
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
      <AddPaymentChannelDisclosure onSubmitted={onSubmitted} />
    </Box>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "id",
        Header: <Trans zh="ID" en="ID" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "code",
        Header: <Trans zh="支付通道代码" en="Payment Channel Code" />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
