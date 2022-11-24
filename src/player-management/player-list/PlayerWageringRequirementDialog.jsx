import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Set,
  Box,
  Icon,
  Dialog,
  useModalState,
  FieldStack,
  Link,
  Button,
  Divider
} from "bumbag"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Disclosure } from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  usePlayerWageringRequirementList,
  usePlayerCompletedWageringList
} from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import SequenceColumn from "../../table/column/sequence"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import { Modal } from "../../dialog/Modal"

export const PlayerWageringRequirementDialogDisclosure = ({
  playerCode,
  ...props
}) => {
  let dialog = new useModalState()
  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="流水纪录" en="Wagering Requirement Records" />
      </Disclosure>
      {dialog.visible && (
        <WageringRequirementDialog playerCode={playerCode} dialog={dialog} />
      )}
    </>
  )
}

const WageringRequirementDialog = ({ playerCode, dialog, ...props }) => {
  let title = useTrans({
    zh: "流水纪录",
    en: "Wagering Requirement Records"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    playerCode
  })

  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerWageringRequirementList(playerCode, {
      ...toApiParams(state),
      sortby: "createdOn",
      orderby: Descending
    })

  let columns = useWageringRequirementColumns({
    playerCode,
    items: data?.items
  })

  if (error) {
    return <AlertDialog {...error} />
  }

  return (
    <Modal id="wagering-requirement-dialog" title={title} {...dialog}>
      <Table
        id="wagering-requirement"
        columns={columns}
        data={data?.items}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        initialState={state}
        controlledState={state}
        isLoading={isLoading}
        stickyHead
        containerProps={{
          maxHeight: "80vh",
          minHeight: "max-content",
          overflow: "auto"
        }}
      />
    </Modal>
  )
}

const Promotion = "Promotion"
const PromotionTrans = {
  zh: "活动",
  en: "Promotion"
}

const Deposit = "Deposit"
const DepositTrans = {
  zh: "存款",
  en: "Deposit"
}

const Adjustment = "Adjustment"
const AdjustmentTrans = {
  zh: "調帳",
  en: "Adjustment"
}

const VIP = "VIP"
const VIPTrans = {
  zh: "VIP",
  en: "VIP"
}

const TypeLabel = ({ value = "" }) => {
  switch (value) {
    case Promotion:
      return <Trans {...PromotionTrans} />
    case Deposit:
      return <Trans {...DepositTrans} />
    case Adjustment:
      return <Trans {...AdjustmentTrans} />
    case VIP:
      return <Trans {...VIPTrans} />
    default:
      return value
  }
}

const BucketHistoryDisclosure = ({
  playerBucketId,
  value,
  id,
  dialogId = "bucket-history",
  ...props
}) => {
  let dialog = new useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <BucketHistoryDialog
          playerBucketId={playerBucketId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const BucketHistoryDialog = ({ playerBucketId, dialog, ...props }) => {
  let title = useTrans({
    zh: "流水细项",
    en: "Turnover Details"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({})

  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerCompletedWageringList(playerBucketId, {
      ...toApiParams(state),
      sortby: "createdOn",
      orderby: Descending
    })

  let columns = useCompletedWageringColumns({
    items: data?.items
  })

  if (error) {
    return <AlertDialog {...error} />
  }

  return (
    <Modal title={title} {...dialog}>
      <FieldStack>
        <Table
          columns={columns}
          data={data?.items}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          initialState={state}
          controlledState={state}
          isLoading={isLoading}
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

const useCompletedWageringColumns = ({ items = [] }) =>
  useMemo(
    () => [
      sequenceColumn(),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="时间" en="Time" />,
        disableSortBy: true,
        dateFormat: "MM/dd",
        timeFormat: "HH:mm"
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <Trans zh="流水" en="Wagering" />,
        disableSortBy: true,
        format: "+0,0.00"
      })
    ],
    [JSON.stringify(items)]
  )

const useWageringRequirementColumns = ({ playerCode, items = [] }) =>
  useMemo(
    () => [
      sequenceColumn(),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="时间" en="Time" />,
        disableSortBy: true,
        dateFormat: "MM/dd",
        timeFormat: "HH:mm"
      }),
      textColumn({
        accessor: "bucketType",
        Header: <Trans zh="类型" en="Type" />,
        disableSortBy: true,
        Cell: TypeLabel
      }),
      numberDecimalColumn({
        accessor: "wageringRequirement",
        Header: <Trans zh="流水需求" en="Wagering Requirement" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "completedWagering",
        accessor: (row) => row,
        Header: <Trans zh="已达流水" en="Completed Wagering" />,
        disableSortBy: true,
        Cell: ({ value: record }) => (
          <BucketHistoryDisclosure
            playerBucketId={record.id}
            value={record.completedWagering}
          />
        )
      }),
      numberDecimalColumn({
        accessor: "uncompleteWagering",
        Header: <Trans zh="剩余流水" en="Uncompleted Wagering" />,
        disableSortBy: true
      })
    ],
    [playerCode, JSON.stringify(items)]
  )
