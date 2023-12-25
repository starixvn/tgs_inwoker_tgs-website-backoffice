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
  FieldStack,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { useMarketingRegisteredPlayerList } from "./client"
import { RegistrationTimeTrans } from "../../trans/User"
import { PlayerUsernameTrans } from "../../trans/Player"

//TODO: remove data param
export const RegisteredPlayerListDialogDisclosure = ({
  brandId,
  value,
  agentUsername,
  date,
  reportDate,
  title,
  ...props
}) => {
  let dialog = useModalState()

  let isEmpty = Number.isFinite(value) && value === 0
  if (isEmpty) {
    return <FormattedNumber value={value} />
  }

  return (
    <>
      <Disclosure use={Link} {...dialog} {...props}>
        <FormattedNumber value={value} />
      </Disclosure>
      {dialog.visible && (
        <PlayerListDialog
          brandId={brandId}
          agentUsername={agentUsername}
          date={date}
          reportDate={reportDate}
          dialog={dialog}
        />
      )}
    </>
  )
}

//TODO: remove data param
const PlayerListDialog = ({
  brandId,
  agentUsername,
  date,
  reportDate,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "玩家清單",
    en: "Player List"
  })
  let { state, setPageIndex, setSortOrder } = useTable({
    brandId,
    agentUsername,
    date,
    reportDate
  })
  let { isLoading, data, error, mutate, deleteCache } =
    useMarketingRegisteredPlayerList(toApiParams(state))

  let columns = useColumns({ items: data?.items })

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
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
      maxWidth="90vw"
      css={css`
        & .bb-DialogContent {
          min-width: 80vw;
          max-height: 80vh;
        }
      `}
    >
      <FieldStack
        css={css`
          height: 70vh;
          overflow: auto;
        `}
      >
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          stickyHead
        />
      </FieldStack>
    </Dialog.Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "username",
        Header: <PlayerUsernameTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "registeredOn",
        Header: <RegistrationTimeTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "lastLoginOn",
        Header: <Trans zh="最近登入时间" en="Last Login Time" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "loginCount",
        Header: <Trans zh="登入次数" en="Login Count" />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
