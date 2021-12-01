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
  Table
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../../form/ConfirmButtonFooter"
//import { Table, toApiParams, useTable, pageCount } from "../../table"
import { useAgentTeamContributionList } from "./client"
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

export const AgentTeamContributionDialogDisclosure = ({
  brandId,
  agentId,
  username,
  start,
  end,
  value,
  ...props
}) => {
  let dialog = useModalState()

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
          value={value}
          start={start}
          end={end}
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
  start,
  end,
  value,
  dialog,
  ...props
}) => {
  let { isLoading, data, error, mutate, deleteCache } =
    useAgentTeamContributionList({
      agentId,
      from: start,
      to: startOfNextDay(end),
      sortby: "settlementDate"
    })

  let title = useTrans({
    zh: "团队贡献详情",
    en: "Team Contribution Detail"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
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
      maxWidth="95vw"
      maxHeight="90vh"
      {...props}
    >
      <FieldStack paddingBottom="1rem">
        <FieldValues marginLeft="1rem">
          <Trans zh="代理用户名" en="Agent Username" />
          <Text.Block alignY="center">{username}</Text.Block>

          <Trans zh="分红金额" en="Profit Sharing Amount" />
          <Text.Block alignY="center">
            <FormattedNumberDecimal value={value} />
          </Text.Block>
        </FieldValues>
        <Separator />
        <Table>
          {data?.items?.map((record) => (
            <Row record={record} />
          ))}
        </Table>
      </FieldStack>
    </Dialog.Modal>
  )
}

//TODO: memorize row?
const Row = ({ record }) => {
  let { isHead, isFoot } = record
  if (isHead) {
    return <HeadRow record={record} />
  }
  if (isFoot) {
    return <FootRow record={record} />
  }
  return <RecordRow record={record} />
}

const HeadRow = ({ record }) => {
  let payoutAmountTooltip = useTrans({
    zh: "紅利金額(活動 + VIP返水) + 調帳",
    en: "Bouns(Promotion + Rebate VIP) + Adjustment"
  })

  return (
    <>
      <Table.Row backgroundColor="white600">
        <Table.HeadCell textAlign="center">
          <Trans zh="结算日期" en="Settlement Date" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center">
          <Trans zh="结算区间" en="Settlement Period" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="代理用户名" en="Agent Username" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="真人输赢总金额" en="Live Dealer Win Loss Amount" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="体育输赢总金额" en="Sports Win Loss Amount" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="电子输赢总金额" en="EGame Win Loss Amount" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="棋牌输赢总金额" en="Card Game Win Loss Amount" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="虚拟体育输赢总金额" en="Virtual Sports Win Loss Amount" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="彩票输赢总金额" en="Lottery Win Loss Amount" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="分红比例" en="Profit Sharing Percentaget" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans
            zh="支出金额"
            en="Expenditure Amount"
            title={payoutAmountTooltip}
          />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center" rowSpan="2">
          <Trans zh="分红金额" en="Profit Sharing Amount" />
        </Table.HeadCell>
      </Table.Row>
      <Table.Row backgroundColor="white600">
        <Table.HeadCell textAlign="center">
          <FormattedDate value={record.settlementDate} format="dd/MM/yyyy" />
        </Table.HeadCell>
        <Table.HeadCell textAlign="center">
          {`${formatDayMonthYear(
            record.settlementDateFrom
          )}-${formatDayMonthYear(record.settlementDateTo)}`}
        </Table.HeadCell>
      </Table.Row>
    </>
  )
}

const RecordRow = ({ record }) => {
  return (
    <Table.Row>
      <Table.Cell colSpan="2" textAlign="center"></Table.Cell>
      <Table.Cell textAlign="center">{record?.username}</Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.liveDealerWinLoss} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.sportsWinLoss} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.slotWinLoss} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.cardGameWinLoss} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.virtualSportsWinLoss} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.lotteryWinLoss} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.agentDividendPercentage} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.expenditureAmount} />
      </Table.Cell>
      <Table.Cell textAlign="center" whiteSpace="nowrap">
        <FormattedNumberDecimal value={record?.bonusAmount} />
      </Table.Cell>
    </Table.Row>
  )
}

const FootRow = ({ record }) => {
  return (
    <Table.Row textAlign="center" fontWeight="bold" whiteSpace="nowrap">
      <Table.Cell colSpan="2"></Table.Cell>
      <Table.Cell>
        <Trans zh="总计" en="Total" />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.liveDealerWinLoss} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.sportsWinLoss} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.slotWinLoss} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.cardGameWinLoss} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.virtualSportsWinLoss} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.lotteryWinLoss} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.agentDividendPercentage} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.expenditureAmount} />
      </Table.Cell>
      <Table.Cell>
        <FormattedNumberDecimal value={record?.bonusAmount} />
      </Table.Cell>
    </Table.Row>
  )
}
