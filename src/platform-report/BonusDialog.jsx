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
import { useIsDisplayMenuByRoute } from "../user/context"
import Disclosure from "../dialog/Disclosure"
import {
  FormattedDate,
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../i18n"
import { CloseButtonFooter } from "../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../table"
import { useAgentTeamContributionList } from "./agent-profit-sharing-report/client"
import LoadingBackdrop from "../dialog/LoadingBackdrop"
import dateTimeColumn from "../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../table/column/numberColumn"
import AlertDialog from "../dialog/Alert"
import { useBonusAmountTrans } from "../trans/Field"

export const BonusDialogDisclosure = ({
  brandId,
  agentId,
  username,
  value,
  useFetch,
  toFetchArguments,
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
        <BounsDialog
          useFetch={useFetch}
          toFetchArguments={toFetchArguments}
          dialog={dialog}
        />
      )}
    </>
  )
}

const defaultFetchArguments = (state = {}) => {
  return [toApiParams(state)]
}

//TODO: tableInitialState ?
const BounsDialog = ({
  useFetch,
  toFetchArguments = defaultFetchArguments,
  dialog
}) => {
  let title = useBonusAmountTrans()

  let { state, setPageIndex, setSortOrder } = useTable()
  let { isLoading, data, error } = useFetch?.(...toFetchArguments(state))

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
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      width="max-content"
    >
      <DataTable
        data={data?.items}
        initialState={state}
        controlledState={state}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
    </Dialog.Modal>
  )
}

const DataTable = ({ data = [], ...props }) => {
  let columns = useColumns({ items: data })

  return <Table data={data} columns={columns} {...props} />
}

const useColumns = ({ items = [] }) => {
  return useMemo(
    () => [
      numberDecimalColumn({
        accessor: "promotionBonus",
        Header: <Trans zh="活动优惠" en="Promotion Bonus" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "vipRebate",
        Header: <Trans zh="VIP返水" en="VIP Rebate" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "birthdayBonus",
        Header: <Trans zh="生日福利" en="Birthday Bonus" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "upgradeBonus",
        Header: <Trans zh="晋升福利" en="Upgrade Bonus" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "quarterlyBonus",
        Header: <Trans zh="季度福利" en="Quarterly Bonus" />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
