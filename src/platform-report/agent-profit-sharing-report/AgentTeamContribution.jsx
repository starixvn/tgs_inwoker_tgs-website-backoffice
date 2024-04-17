import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect
} from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  List,
  Heading,
  Text,
  Box,
  Set,
  FieldStack,
  Alert,
  Popover,
  Icon,
  Level,
  Button
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
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { useAgentTeamContributionList } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import {
  DayMonthYearFormat,
  formatDateTime,
  formatDayMonthYear
} from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { NetProfitTrans, TotalTrans } from "../../trans/Field"
import {
  CardGameTrans,
  EGameTrans,
  LiveDealerTrans,
  LotteryTrans,
  SportsbookTrans,
  VirtualSportsTrans
} from "../../trans/Game"
import { AgentUsernameTrans } from "../../trans/Agent"

export const AgentTeamContributionDialogDisclosure = ({
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
          value={value}
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
  start,
  end,
  value,
  agentDividendPercentage,
  dialog,
  ...props
}) => {
  let { isLoading, data, error, mutate, deleteCache } =
    useAgentTeamContributionList({
      agentId,
      from: start,
      to: startOfNextDay(end),
      agentDividendPercentage,
      sortby: "settlementDate"
    })

  let title = useTrans({
    zh: "团队贡献详情",
    en: "Team Contribution Detail"
  })

  let items = data?.items
  let columns = useColumns({ items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      title={
        <Set orientation="horizontal" alignY="center">
          <Text fontSize="1.25em" fontWeight="bold">
            {title}
          </Text>
          <Popover.State placement="bottom">
            <Popover.Disclosure>
              <Icon icon="info-circle" color="info" />
            </Popover.Disclosure>
            <Popover
              hasArrow
              usePortal
              maxWidth="90vw"
              css={css`
                width: max-content;
              `}
            >
              <FieldStack>
                <FieldValues marginLeft="1rem">
                  <AgentUsernameTrans />
                  <Text.Block alignY="center">{username}</Text.Block>

                  <Trans zh="上交分紅" en="Profit Sharing Amount" />
                  <Text.Block alignY="center">
                    <FormattedNumberDecimal value={value} />
                  </Text.Block>
                </FieldValues>
                <Alert variant="bordered" type="info" marginBottom="2.5rem">
                  <List listStyleType="disc" listStylePosition="inside">
                    <List.Item>
                      <Trans
                        zh="公司输赢总计 = 全部的遊戲輸贏加總"
                        en="Company Total Win/Loss = Total Win/Loss of All Games"
                      />
                    </List.Item>
                    <List.Item>
                      <Trans
                        zh="代理成本 = 紅利金額 + 優惠調帳"
                        en="Agent Cost = Bouns + Bouns Adjust"
                      />
                    </List.Item>
                    <List.Item>
                      <Trans
                        zh="淨盈利 = 公司输赢总计 - 代理成本"
                        en="Net Profit = Company Total Win/Loss - Agent Cost"
                      />
                    </List.Item>
                    <List.Item>
                      <Trans
                        zh="上交分红比例 = 本身分紅比例 - 下級分紅比例"
                        en="Profit Sharing Percentaget = Agent Profit Sharing Percentage - Next Level Agent Profit Sharing Percentage"
                      />
                    </List.Item>
                    <List.Item>
                      <Trans
                        zh="上交分紅 = 淨盈利 x 上交分紅比例"
                        en="Profit Sharing Amount = Net Profit x Profit Sharing Percentaget"
                      />
                    </List.Item>
                  </List>
                </Alert>
              </FieldStack>
            </Popover>
          </Popover.State>
        </Set>
      }
      hideOnClickOutside={false}
      {...dialog}
      showCloseButton
      placement="top"
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} />}
      width="max-content"
      maxWidth="95vw"
      maxHeight="95vh"
      css={css`
        & .bb-DialogContent {
          max-height: 80vh;
        }
        & .bb-DialogClose {
          z-index: 2;
        }
      `}
      {...props}
    >
      <FieldStack paddingBottom="1rem">
        <Table
          columns={columns}
          isLoading={isLoading}
          data={items}
          foot={data?.items?.length > 0}
          stickyHead
          containerProps={{
            maxHeight: "69vh",
            overflow: "auto"
          }}
        />
      </FieldStack>
    </Dialog.Modal>
  )
}

const useColumns = ({ items = [] }) => {
  //TODO: dateTimeRangeColumn: toStart, toEnd fn
  return useMemo(() => {
    let columns = [
      dateTimeColumn({
        accessor: "settlementDate",
        dateFormat: DayMonthYearFormat,
        timeFormat: false,
        Header: <Trans zh="结算日期" en="Settlement Date" />,
        Footer: () => <TotalTrans />,
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
      textColumn({
        accessor: "username",
        Header: <AgentUsernameTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "liveDealerWinLoss",
        Header: <LiveDealerTrans />,
        sumColumn: "liveDealerWinLoss",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "sportsWinLoss",
        Header: <SportsbookTrans />,
        sumColumn: "sportsWinLoss",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "slotWinLoss",
        Header: <EGameTrans />,
        sumColumn: "slotWinLoss",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "cardGameWinLoss",
        Header: <CardGameTrans />,
        sumColumn: "cardGameWinLoss",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "virtualSportsWinLoss",
        Header: <VirtualSportsTrans />,
        sumColumn: "virtualSportsWinLoss",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "lotteryWinLoss",
        Header: <LotteryTrans />,
        sumColumn: "lotteryWinLoss",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "companyWinLossTotalAmount",
        Header: (
          <Box>
            <Trans zh="公司输赢总计" en="Company Total Win/Loss" />
          </Box>
        ),
        sumColumn: "companyWinLossTotalAmount",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "expenditureAmount",
        Header: <Trans zh="代理成本" en="Agent Cost" />,
        sumColumn: "expenditureAmount",
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "netProfit",
        Header: <NetProfitTrans />,
        sumColumn: "netProfit",
        disableSortBy: true
      }),

      numberDecimalPercentageColumn({
        accessor: "agentDividendPercentage",
        Header: <Trans zh="上交分紅比例" en="Profit Sharing Percentaget" />,
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "agentDividendAmount",
        Header: <Trans zh="上交分紅" en="Profit Sharing Amount" />,
        sumColumn: "agentDividendAmount",
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
