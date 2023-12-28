import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Link } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { usePlatformAccountFundActionDetail } from "./client"
import Modal from "../../dialog/Modal"
import AlertDialog from "../../dialog/Alert"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { toDate } from "../../date/toDate"
import { startOfNextMonth } from "../../date/startOfNextMonth"
import dateTimeColumn from "../../table/column/dateTime"
import { TimeTrans } from "../../trans/Date"
import textColumn from "../../table/column/textColumn"
import { OperatorTrans, RemarkTrans } from "../../trans/Action"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { FundActionLabel } from "./FundAction"
import { PlatformTrans } from "../../trans/Platform"

const AddedDeductedDetail = {
  zh: "上/下分詳情",
  en: "Added/Deducted Details"
}
const FundActionDetailTrans = () => <Trans {...AddedDeductedDetail} />
const useFundActionDetailTrans = () => useTrans(AddedDeductedDetail)

export const FundActionDetailDialogDisclosure = ({
  brandId,
  month,
  value,
  id,
  dialogId = "fund-action-detail-dialog"
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
        <DetailDialog
          brandId={brandId}
          month={month}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const DetailDialog = ({ brandId, month, dialog, dialogId }) => {
  let title = useFundActionDetailTrans()

  let startOn = toDate(month)
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    startOn,
    endOn: startOfNextMonth(startOn)
  })

  let toSearchParams = (state) => {
    let { page, rows, ...rest } = toApiParams(state)
    return {
      pageNumber: page,
      pageSize: rows,
      ...rest
    }
  }
  let { isLoading, data, error } = usePlatformAccountFundActionDetail(
    brandId,
    toSearchParams(state)
  )

  let items = data?.items ?? []
  let columns = useColumns({
    items
  })

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      <Table
        id="fund-detail"
        columns={columns}
        data={items}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        stickyHead
        containerProps={{
          maxHeight: "70vh",
          minHeight: "max-content",
          overflow: "auto"
        }}
      />
    </Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      dateTimeColumn({
        accessor: "createdOn",
        Header: <TimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "brandCode",
        Header: <PlatformTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "type",
        Header: <Trans zh="操作類型" en="Type" />,
        disableSortBy: true,
        Cell: FundActionLabel
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="額度" en=" Credits" />,
        disableSortBy: true
      }),
      /*
      TODO: rm
      numberDecimalColumn({
        id: "todo",
        accessor: (row) => row,
        Header: <Trans zh="平台額度(操作後)" en="Platform Fund (Updated)" />,
        disableSortBy: true,
        Cell: () => {
          return ""
        }
      }),
      */
      numberDecimalColumn({
        accessor: "money",
        Header: <Trans zh="金額 (USD)" en="Amount (USD)" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "createdUsername",
        Header: <OperatorTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "remark",
        Header: <RemarkTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
