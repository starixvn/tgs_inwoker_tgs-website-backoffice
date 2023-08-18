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
import { Disclosure, ViewDisclosure } from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"
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
import { useIsAdminUser } from "../../user/context"
import {
  PlatformBucketLabel,
  usePlatformBucketLabel
} from "../../platform-management/PlatformBucket"
import {
  usePlayerBucketList,
  usePlayerBucketItems,
  usePlayerCompletedWageringList
} from "./client"

export const PlayerBucketListDialogDisclosure = ({
  playerCode,
  id,
  dialogId = "bucket-list-dialog",
  ...props
}) => {
  let dialog = new useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <Trans zh="流水需求" en="Wagering Requirements" />
      </Disclosure>
      {dialog.visible && (
        <PlayerBucketListDialog
          playerCode={playerCode}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

//TODO: fake api & data
const PlayerBucketListDialog = ({ playerCode, dialog, dialogId }) => {
  let title = useTrans({
    zh: "流水需求",
    en: "Wagering Requirements"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    playerCode
  })

  //TODO: sortby & orderby? need extra params?
  let {
    isLoading,
    data: items,
    error,
    mutate,
    deleteCache
  } = usePlayerBucketList(playerCode)

  let columns = usePlayerBucketListColumns({ playerCode, items })

  if (error) {
    return <AlertDialog {...error} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      <FieldStack>
        <Table
          id="bucket-list"
          columns={columns}
          data={items}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          initialState={state}
          controlledState={state}
          isLoading={isLoading}
          stickyHead
          containerProps={{
            maxHeight: "85vh",
            minHeight: "max-content",
            overflow: "auto"
          }}
        />
      </FieldStack>
    </Modal>
  )
}

const usePlayerBucketListColumns = ({ playerCode, items = [] }) =>
  useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "type",
        Header: <Trans zh="类型" en="Type" />,
        disableSortBy: true,
        Cell: PlatformBucketLabel
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <Trans zh="纪录" en="Records" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <PlayerBucketItemsDialogDisclosure
              playerCode={playerCode}
              type={record?.type}
            />
          )
        }
      })
    ]
    return columns
  }, [playerCode, JSON.stringify(items)])

const PlayerBucketItemsDialogDisclosure = ({
  playerCode,
  type,
  id,
  dialogId = "bucket-items-dialog",
  ...props
}) => {
  let dialog = new useModalState()
  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <ViewDisclosure id={id} {...dialog} />
      {dialog.visible && (
        <PlayerBucketItemsDialog
          playerCode={playerCode}
          type={type}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const PlayerBucketItemsDialog = ({
  playerCode,
  type,
  dialog,
  dialogId,
  ...props
}) => {
  let label = usePlatformBucketLabel(type)
  let title = useTrans({
    zh: `流水纪录 - ${label}`,
    en: `Wagering Requirement Records - ${label}`
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    playerCode
  })

  //TODO: need params? sortby & orderby?
  let { isLoading, data, error, mutate, deleteCache } = usePlayerBucketItems(
    playerCode,
    {
      ...toApiParams(state),
      sortby: "createdOn",
      orderby: Descending
    }
  )

  let columns = useBucketItemsColumns({
    playerCode,
    type,
    items: data
  })

  if (error) {
    return <AlertDialog {...error} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      <Table
        id="bucket-items"
        columns={columns}
        data={data}
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

const useBucketItemsColumns = ({ playerCode, items = [] }) =>
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
        accessor: "uncompleteWagering",
        Header: <Trans zh="流水" en="Unfinished Wagering" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <Trans zh="流水细项" en="Turnover Details" />,
        disableSortBy: true,
        Cell: ({ value: record }) => (
          <BucketHistoryDisclosure playerBucketId={record.id} />
        )
      })
    ],
    [playerCode, JSON.stringify(items)]
  )

const BucketHistoryDisclosure = ({
  playerBucketId,
  value,
  id,
  dialogId = "bucket-history-dialog",
  ...props
}) => {
  let dialog = new useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <Trans zh="查看" en="Details" />
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

const BucketHistoryDialog = ({
  playerBucketId,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useTrans({
    zh: "流水细项",
    en: "Turnover Details"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({})

  let {
    isLoading,
    data: items,
    error,
    mutate,
    deleteCache
  } = usePlayerCompletedWageringList(playerBucketId, {
    ...toApiParams(state),
    sortby: "createdOn",
    orderby: Descending
  })

  let columns = useCompletedWageringColumns({
    items
  })

  if (error) {
    return <AlertDialog {...error} />
  }

  return (
    <Modal id={dialogId} title={title} {...dialog}>
      <FieldStack>
        <Table
          id="bucket-history"
          columns={columns}
          data={items}
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

const Game = "Game"
const GameTrans = {
  zh: "游戏",
  en: "Game"
}

const Adjust = "Adjust"
const AdjustTrans = {
  zh: "调整",
  en: "Adjust"
}

const Create = "Create"
const CreateTrans = {
  zh: "新增",
  en: "Add"
}

const CleanUp = "CleanUp"
const CleanUpTrans = {
  zh: "清除",
  en: "Clear"
}

const BucketType = {
  Game,
  Adjust,
  Create,
  CleanUp
}

const BucketTypeLabel = ({ value = "" }) => {
  switch (value) {
    case BucketType.Game:
      return <Trans {...GameTrans} data-type={BucketType.Game} />
    case BucketType.Adjust:
      return <Trans {...AdjustTrans} data-type={BucketType.Adjust} />
    case BucketType.Create:
      return <Trans {...CreateTrans} data-type={BucketType.Create} />
    case BucketType.CleanUp:
      return <Trans {...CleanUpTrans} data-type={BucketType.CleanUp} />
    default:
      return value
  }
}

const useCompletedWageringColumns = ({ items = [] }) => {
  let isAdmin = useIsAdminUser()
  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="时间" en="Time" />,
        disableSortBy: true,
        dateFormat: "MM/dd",
        timeFormat: "HH:mm"
      }),
      numberDecimalColumn({
        accessor: "changeAmount",
        Header: <Trans zh="流水" en="Wagering" />,
        disableSortBy: true,
        format: "+0,0.00"
      }),
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "type",
        Header: <Trans zh="类型" en="Type" />,
        disableSortBy: true,
        Cell: BucketTypeLabel
      })
    ]

    if (isAdmin) {
      columns.push({
        accessor: "externalId",
        Header: "Reference ID",
        disableSortBy: true
      })
    }

    return columns
  }, [JSON.stringify(items)])
}
