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
  FieldStack
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { useAgentDividendDetailList } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { AgentUsernameTrans } from "../../trans/Agent"

export const AgentProfitSharingDialogDisclosure = ({
  brandId,
  agentId,
  username,
  start,
  end,
  value,
  agentDividendPercentage,
  ...props
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <ReportDialog
          brandId={brandId}
          agentId={agentId}
          username={username}
          bonusAmount={value}
          start={start}
          end={end}
          agentDividendPercentage={agentDividendPercentage}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ReportDialog = ({
  brandId,
  agentId,
  username,
  bonusAmount,
  start,
  end,
  agentDividendPercentage,
  dialog
}) => {
  let { state, setPageIndex, setSortOrder } = useTable({
    brandId,
    agentId,
    showAll: true
  })

  let { data, isLoading, error, mutate, deleteCache } =
    useAgentDividendDetailList({
      ...toApiParams(state),
      sortby: "username",
      from: start,
      to: startOfNextDay(end),
      agentDividendPercentage
    })

  let { pageIndex, pageSize } = state
  let columns = useAgentBonusColumns({ username, items: data?.items })

  let title = useTrans({
    zh: "分红详情",
    en: "Profit Sharing Detail"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

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
      footer={<CloseButtonFooter dialog={dialog} />}
      width="max-content"
      maxWidth="90vw"
      maxHeight="90vh"
      css={css`
        & .bb-DialogContent {
          max-height: 80vh;
        }
        & .bb-DialogClose {
          z-index: 2;
        }
      `}
    >
      <FieldStack>
        <FieldValues marginLeft="1rem">
          <AgentUsernameTrans />
          <Text.Block alignY="center">{username}</Text.Block>

          <Trans zh="分红金额" en="Profit Sharing Amount" />
          <Text.Block alignY="center">
            {formatNumberDecimal(bonusAmount)}
          </Text.Block>
        </FieldValues>
        <Separator />
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          // pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          foot={data?.items?.length > 0}
          stickyHead
          containerProps={{
            maxHeight: "60vh",
            overflow: "auto"
          }}
        />
      </FieldStack>
    </Dialog.Modal>
  )
}

const useAgentBonusColumns = ({ username = "", items = [] }) => {
  let payoutAmountTooltip = useTrans({
    zh: "紅利金額(活動 + VIP返水) + 調帳",
    en: "Bouns(Promotion + Rebate VIP) + Adjustment"
  })

  return useMemo(
    () => [
      textColumn({
        accessor: "username",
        Header: <AgentUsernameTrans />,
        Cell: ({ value }) => value ?? username
      }),
      dateTimeColumn({
        accessor: "settlementDate",
        dateFormat: "dd/MM/yyyy",
        timeFormat: false,
        Header: <Trans zh="结算日期" en="Date" />,
        Footer: () => <Trans zh="总计" en="Total" />,
        footerCellProps: {
          textAlign: "center"
        },
        disableSortBy: true
      }),
      textColumn({
        id: "settlementInterval",
        accessor: (row) => row,
        Header: <Trans zh="结算区间" en="Settlement Period" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let format = "dd/MM/yyyy"
          let start = formatDateTime(format, value?.settlementDateFrom)
          let end = formatDateTime(format, value?.settlementDateTo)
          return <Text.Block>{`${start} - ${end}`}</Text.Block>
        }
      }),

      numberDecimalColumn({
        accessor: "agentDividendAmount",
        Header: <Trans zh="分红金额细项" en="Profit Sharing Amount Detail" />,
        sumColumn: "agentDividendAmount",
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
