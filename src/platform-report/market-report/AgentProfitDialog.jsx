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
  List
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../../form/ConfirmButtonFooter"
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

export const AgentProfitDialogDisclosure = ({ brandId, value, ...props }) => {
  let dialog = useModalState()

  /*
  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
    }
    */

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <FormattedNumberDecimal value={value} placeholder="--" />
      </Disclosure>
      {dialog.visible && (
        <AgentProfitDialog brandId={brandId} dialog={dialog} />
      )}
    </>
  )
}

const AgentProfitDialog = ({ brandId, dialog }) => {
  let { state, setPageIndex, setSortOrder } = useTable({
    brandId,
    showAll: true
  })

  //TODO: paramas for api
  let { isLoading, data, error } = useMarketReportAgentProfitList()

  let title = useTrans({
    zh: "代理总分红",
    en: "Agent Profit"
  })

  let columns = useColumns({ items: data?.items })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
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
                      zh="净盈利 = 公司输赢金额 - 平台承担红利 - 平台承担优惠调帐 - 公司调帐 - 代理总分红。"
                      en="Net Profit = CO. W/L - Platform-Covered Bonus - Platform-Covered Bonus Adjust - C.O Adjustment Amount - Agent Profit."
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
      {
        id: "agent",
        Header: "",
        columns: [
          textColumn({
            accessor: "agentName",
            Header: <Trans zh="总代" en="Master Agent" />,
            disableSortBy: true
          }),
          numberDecimalPercentageColumn({
            accessor: "agentProfitPercentage",
            Header: <Trans zh="总代占成" en="PT" />,
            disableSortBy: true
          })
        ]
      },
      {
        id: "profit",
        Header: <Trans zh="净盈利" en="Net Profit" />,
        headCell: {
          textAlign: "center"
        },
        columns: [
          numberDecimalColumn({
            accessor: "directPlayerNetProfit",
            Header: <Trans zh="直属玩家" en="Direct Player Net Profit" />,
            disableSortBy: true
          }),
          numberDecimalColumn({
            accessor: "teamNetProfit",
            Header: <Trans zh="团队" en="Team Net Profit" />,
            disableSortBy: true
          })
        ]
      },
      numberDecimalColumn({
        accessor: "agentNetProfit",
        Header: <Trans zh="代理总分红" en="Agent Net Profit" />,
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
