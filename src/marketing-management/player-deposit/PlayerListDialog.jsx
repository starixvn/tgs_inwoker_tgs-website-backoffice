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
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../../form/ConfirmButtonFooter"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime, formatDayMonthYear } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"

export const PlayerListDialogDisclosure = ({
  brandId,
  value,
  agentUsername,
  date,
  reportDate,
  useFetch,
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
          useFetch={useFetch}
          dialog={dialog}
        />
      )}
    </>
  )
}

const PlayerListDialog = ({
  id = "player-list-dialog",
  brandId,
  agentUsername = "",
  date,
  reportDate,
  useFetch,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: `${agentUsername} 玩家清單`,
    en: `${agentUsername} Player List`
  })
  let { state, setPageIndex, setSortOrder } = useTable({
    brandId,
    agentUsername,
    date,
    reportDate
  })

  let { isLoading, data, error, mutate, deleteCache } = useFetch(
    toApiParams(state)
  )

  let columns = useColumns({ items: data?.items })
  /*
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }
  */

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
  }

  return (
    <Dialog.Modal
      id={id}
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
          /*
          containerProps={{
            maxHeight: "65vh",
            overflow: "auto"
          }}
          */
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
        Header: <Trans zh="玩家用户名" en="Player Username" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "firstDepositOn",
        Header: <Trans zh="首存时间" en="First Deposit Time" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "firstDepositAmount",
        Header: <Trans zh="首存金额" en="First Deposit Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "totalDepositAmount",
        Header: <Trans zh="总存款" en="Total Deposit Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "totalWithdrawAmount",
        Header: <Trans zh="总提款" en="Total Withdraw Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "depositSubtractWithdraw",
        Header: <Trans zh="存提差" en="Deposit Withdraw Diff." />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "ipAddress",
        Header: <Trans zh="注册IP" en="Register IP" />,
        disableSortBy: true
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
