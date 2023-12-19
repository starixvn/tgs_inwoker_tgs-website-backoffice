import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Link, Stack, Box } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import Modal from "../../dialog/Modal"
import AlertDialog from "../../dialog/Alert"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { usePlatformAccountFundCreditUsedDetail } from "./client"
import textColumn from "../../table/column/textColumn"
import { GameProviderTrans } from "../../trans/Game"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { sum } from "lodash-es"

export const CreditUsedDialog = ({
  brandId,
  month,
  value,
  id,
  dialogId = "fund-used-amount-detail-dialog"
}) => {
  let dialog = useModalState()

  /*
  TODO: ?
  let isEmpty = Number.isFinite(value) && value === 0
  if (isEmpty) {
    return <FormattedNumber value={value} />
  }
  */

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} use={Link} {...dialog}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <DetailDialog brandId={brandId} month={month} dialog={dialog} />
      )}
    </>
  )
}

const DetailDialog = ({ brandId, month, dialog, dialogId }) => {
  let title = useTrans({
    zh: "已使用額度詳情",
    en: "Used Credits Details"
  })

  let { state, setPageIndex, setSortOrder } = useTable({
    month
  })

  let {
    isLoading,
    data: items,
    error
  } = usePlatformAccountFundCreditUsedDetail(brandId, toApiParams(state))

  //TODO: items -> total
  let total =
    items?.length > 0
      ? {
          profitAmount: sum(items.map(({ profitAmount }) => profitAmount))
        }
      : null
  console.log("total", total)
  let columns = useColumns({ items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      <Stack>
        <Box></Box>
        <Table columns={columns} data={items} total={total} />
      </Stack>
    </Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      textColumn({
        accessor: "gameProviderCode",
        Header: <GameProviderTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "profitAmount",
        Header: (
          <Trans
            zh="公司輸贏(負值以0表示)"
            en="Company W/L (Any negative result will be considered as 0)"
          />
        ),
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
