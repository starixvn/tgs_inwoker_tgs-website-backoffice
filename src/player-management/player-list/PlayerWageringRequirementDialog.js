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
import { Disclosure } from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  usePlayerWageringRequirementList,
  usePlayerCompletedWageringList
} from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import SequenceColumn from "../../table/column/sequence"
import textColumn from "../../table/column/textColumn"

export const PlayerWageringRequirementDialogDisclosure = ({
  playerCode,
  ...props
}) => {
  let dialog = new useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="流水纪录" en="Wagering Requirement Records" />
      </Disclosure>
      {dialog.visible && (
        <WageringRequirementDialog playerCode={playerCode} dialog={dialog} />
      )}
    </>
  )
}

const WageringRequirementDialog = ({ playerCode, dialog, ...props }) => {
  let title = useTrans({
    zh: "流水纪录",
    en: "Wagering Requirement Records"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    playerCode
  })

  //TODO: sort by time
  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerWageringRequirementList(toApiParams(state))

  let columns = useWageringRequirementColumns({
    playerCode,
    items: data?.items
  })

  if (error) {
    return <AlertDialog {...error} />
  }

  return (
    <Backdrop {...dialog}>
      <Dialog.Modal
        title={title}
        hideBackdrop
        hideOnClickOutside={false}
        showCloseButton={true}
        {...dialog}
      >
        <FieldStack>
          <Table
            columns={columns}
            data={data?.items}
            pageCount={pageCount(state.pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            initialState={state}
            controlledState={state}
            isLoading={isLoading}
          />
        </FieldStack>
      </Dialog.Modal>
    </Backdrop>
  )
}

const Promotion = "Promotion"
const PromotionTrans = {
  zh: "活动",
  en: "Promotion"
}

const Deposit = "Deposit"
const DepositTrans = {
  zh: "充值",
  en: "Deposit"
}

const Adjustment = "Adjustment"
const AdjustmentTrans = {
  zh: "調帳",
  en: "Adjustment"
}

const TypeLabel = ({ value }) => {
  switch (value) {
    case Promotion:
      return <Trans {...PromotionTrans} />
    case Deposit:
      return <Trans {...DepositTrans} />
    case Adjustment:
      return <Trans {...AdjustmentTrans} />
    default:
      return ""
  }
}

const CompletedWageringDisclosure = ({ playerCode, value }) => {
  let dialog = new useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <CompletedWageringDialog playerCode={playerCode} dialog={dialog} />
      )}
    </>
  )
}

const CompletedWageringDialog = ({ playerCode, ...dialog }) => {
  let title = useTrans({
    zh: "已达流水",
    en: "Completed Wagering"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    playerCode
  })

  //TODO: sort by time
  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerCompletedWageringList(toApiParams(state))

  let columns = useCompletedWageringColumns({
    items: data?.items
  })

  if (error) {
    return <AlertDialog {...error} />
  }

  return (
    <Backdrop {...dialog}>
      <Dialog.Modal
        title={title}
        hideBackdrop
        hideOnClickOutside={false}
        showCloseButton={true}
        {...dialog}
      >
        <FieldStack>
          <Table
            columns={columns}
            data={data?.items}
            pageCount={pageCount(state.pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            initialState={state}
            controlledState={state}
            isLoading={isLoading}
          />
        </FieldStack>
      </Dialog.Modal>
    </Backdrop>
  )
}

const useCompletedWageringColumns = ({ items = [] }) =>
  useMemo(
    () => [
      sequenceColumn(),
      dateTimeColumn({
        accessor: "recordedOn",
        Header: <Trans zh="时间" en="Time" />,
        disableSortBy: true,
        dateFormat: "MM/dd",
        timeFormat: "HH:mm"
      }),
      numberDecimalColumn({
        accessor: "wagering",
        Header: <Trans zh="流水" en="Wagering" />,
        disableSortBy: true,
        format: "+0,0.00"
      })
    ],
    [JSON.stringify(items)]
  )

const useWageringRequirementColumns = ({ playerCode, items = [] }) =>
  useMemo(
    () => [
      sequenceColumn(),
      dateTimeColumn({
        accessor: "recordedOn",
        Header: <Trans zh="时间" en="Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "type",
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
        accessor: "completedWagering",
        Header: <Trans zh="已达流水" en="Completed Wagering" />,
        disableSortBy: true,
        Cell: CompletedWageringDisclosure
      }),
      numberDecimalColumn({
        accessor: "uncompletedWagering",
        Header: <Trans zh="剩余流水" en="Uncompleted Wagering" />,
        disableSortBy: true
      })
    ],
    [playerCode, JSON.stringify(items)]
  )
