import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Popover,
  Icon,
  Text,
  Box,
  Set,
  FieldStack,
  Alert,
  List,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { useMarketReportAgentProfitList } from "./client"
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
import { Modal } from "../../dialog/Modal"
import { zIndexOfModal } from "../../css/zIndex"
import { NetProfitTrans } from "../../trans/Field"
import {
  AgentProfitTrans,
  MasterAgentTrans,
  useAgentProfitTrans
} from "../../trans/Agent"

export const AgentProfitDialogDisclosure = ({
  brandId,
  value,
  date,
  use = Link,
  ...props
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} placeholder="-" />
  }

  return (
    <>
      <Disclosure use={use} {...dialog} {...props}>
        <FormattedNumberDecimal value={value} placeholder="-" />
      </Disclosure>
      {dialog.visible && (
        <AgentProfitDialog brandId={brandId} date={date} dialog={dialog} />
      )}
    </>
  )
}

const AgentProfitDialog = ({ brandId, date, dialog }) => {
  let { state, setPageIndex, setSortOrder } = useTable({
    brandId,
    date,
    showAll: true
  })

  let { isLoading, data, error } = useMarketReportAgentProfitList(
    brandId ? toApiParams(state) : null
  )

  let title = useAgentProfitTrans()

  let columns = useColumns({ items: data?.items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal
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
                z-index: ${zIndexOfModal()};
              `}
            >
              <Alert variant="bordered" type="info">
                <List listStyleType="disc" listStylePosition="inside">
                  <List.Item>
                    <Trans
                      zh="代理总分红 = (直属玩家净盈利 + 团队净盈利) * 占成。"
                      en="Agent Profit = (Direct Player Net Profit + Team Net Profit) * PT."
                    />
                  </List.Item>
                  <List.Item>
                    <Trans
                      zh="公司分红 =  [(直属玩家净盈利 + 团队净盈利) * 公司占成] - 公司调帐。"
                      en="Company Profit = [(Direct Player Net Profit + Team Net Profit) * Company PT] - Company Adjustment."
                    />
                  </List.Item>
                </List>
              </Alert>
            </Popover>
          </Popover.State>
        </Set>
      }
      {...dialog}
    >
      <Table
        columns={columns}
        data={data?.items}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        hasCellDividers
        stickyHead
        maxSize={{
          height: "80vh"
        }}
      />
    </Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "masterAgentName",
        Header: <MasterAgentTrans />,
        disableSortBy: true
      }),
      numberDecimalPercentageColumn({
        accessor: "percentage",
        Header: <Trans zh="总代占成" en="PT" />,
        disableSortBy: true
      }),
      {
        id: "profit",
        Header: <NetProfitTrans />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "directPlayerNetProfit",
            Header: <Trans zh="直属玩家" en="Direct Player" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            accessor: "teamNetProfit",
            Header: <Trans zh="团队" en="Team" />,
            disableSortBy: true
          })
        ]
      },
      numberDecimalColumn({
        accessor: "agentProfit",
        Header: <AgentProfitTrans />,
        disableSortBy: true
      }),
      {
        id: "company",
        Header: <Trans zh="公司" en="Company" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "companyAdjustment",
            Header: <Trans zh="公司调帐" en="Company Adjustment" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            accessor: "companyProfit",
            Header: <Trans zh="公司分红" en="Company Profit" />,
            disableSortBy: true
          })
        ]
      }
    ]
    return columns
  }, [JSON.stringify(items)])
}
