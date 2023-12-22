import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Link, Stack, Box, FieldStack } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDate,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import Modal from "../../dialog/Modal"
import AlertDialog from "../../dialog/Alert"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { usePlatformAccountFundCreditUsedDetail } from "./client"
import textColumn from "../../table/column/textColumn"
import { GameProviderTrans } from "../../trans/Game"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { sum } from "lodash-es"
import { FieldValues } from "../../layout/Grid"
import { DateFormat } from "../../date/format"
import { TimeTrans } from "../../trans/Date"
import { PlatformTrans } from "../../trans/Platform"

export const UsedCreditDetailDialog = ({
  brandId,
  brandCode,
  month,
  value,
  id,
  dialogId = "fund-credit-detail-dialog"
}) => {
  let dialog = useModalState()

  /*
  TODO: seems able to rm
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
        <DetailDialog
          brandId={brandId}
          brandCode={brandCode}
          month={month}
          dialog={dialog}
        />
      )}
    </>
  )
}

const DetailDialog = ({ brandId, brandCode, month, dialog, dialogId }) => {
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

  let total =
    items?.length > 0
      ? {
          profitAmount: sum(items.map(({ profitAmount }) => profitAmount))
        }
      : null

  let columns = useColumns({ items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  //TODO: time range? hardcode?
  return (
    <Modal
      id={dialogId}
      title={title}
      {...dialog}
      css={css`
        min-width: 40vw;
      `}
    >
      <FieldStack>
        <Box>
          <FieldValues>
            <Box>
              {/* <TimeTrans /> */}

              <Trans zh="計算區間" en="Settled between" />
            </Box>
            <Box>
              <FormattedDate format={DateFormat.YearMonth} value={month} />
            </Box>

            <Box>
              <PlatformTrans />
            </Box>
            <Box>{brandCode}</Box>
          </FieldValues>
        </Box>
        <Table
          columns={columns}
          data={items}
          total={total}
          stickyHead
          containerProps={{
            maxHeight: "70vh",
            minHeight: "max-content",
            overflow: "auto"
          }}
        />
      </FieldStack>
    </Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      textColumn({
        accessor: "gameProviderCode",
        Header: <GameProviderTrans />,
        TotalCell: () => <Trans zh="总计" en="Total" />,
        textAlign: "left",
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
