import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Label, Set } from "bumbag"
import Disclosure, { DetailDisclosure } from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import { Modal } from "../../dialog/Modal"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { JsonEditor } from "../../text/editor/JsonEditor"
import { ChangeLog } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { useChangeLogList, useChangeLogDetail } from "./client"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"

export const PromotionChangeLogListDialogDisclosure = ({
  id,
  dialogId = "promotion-change-log-list-dialog",
  promotionId,
  ...props
}) => {
  let hasAuth = useIsDisplayMenuByRoute([ChangeLog])
  let dialog = useModalState()

  if (!hasAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <Trans zh="日志" en="Logs" />
      </Disclosure>
      {dialog.visible && (
        <ChangeLogListDialog
          promotionId={promotionId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

export const ChangeLogListDialog = ({
  promotionId,
  dialog,
  dialogId,
  ...props
}) => {
  //TODO: need search params? table state?
  let { isLoading, data: items, error } = useChangeLogList(promotionId)

  let columns = useColumns({ items, promotionId })

  let title = useTrans({
    zh: "日志",
    en: "Logs"
  })
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }
  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  //TODO: table and dialog
  return (
    <Modal id={dialogId} title={title} {...dialog}>
      <Table columns={columns} data={items} />
    </Modal>
  )
}

const useColumns = ({ items = [], promotionId }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "modifier",
        Header: <Trans zh="操作者" en="Modifier" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="时间" en="Date & Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "action",
        Header: <Trans zh="变更类型" en="Type" />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <Trans zh="变更详情" en="Change Details" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <ChangeLogDetailDisclosure
              promotionId={promotionId}
              eventId={record?.eventId}
            />
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}

//TODO
const ChangeLogDetailDisclosure = ({
  id,
  dialogId = "promotion-change-log-detail-dialog",
  promotionId,
  eventId
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <DetailDisclosure eventId={eventId} id={id} {...dialog} />
      {dialog.visible && (
        <ChangeLogDetailDialog
          promotionId={promotionId}
          eventId={eventId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const ChangeLogDetailDialog = ({ promotionId, eventId, dialog, dialogId }) => {
  let { isLoading, data, error } = useChangeLogDetail(promotionId, eventId)

  let title = useTrans({
    zh: "详情",
    en: "Detail"
  })
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }
  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal id={dialogId} title={title} width="50vw" {...dialog}>
      <JsonEditor height="80vh" value={data} disabled />
    </Modal>
  )
}
