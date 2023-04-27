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
  Popover,
  Icon,
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
import {
  CloseButtonFooter,
  ConfirmButtonFooter
} from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
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
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../dialog/Modal"
import { useWinlossReportPlayerSpecial } from "./client"

/*
export const PlayerSpecial = ({ value }) => {
  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <Popover.State>
      <Popover.Disclosure use={Link}>
        <FormattedNumberDecimal value={value} />
      </Popover.Disclosure>
      <Popover.Disclosure>
        <Set orientation="horizontal" whiteSpace="nowrap" width="max-content">
          <Icon icon={faPlus} type="font-awesome" />
          <FormattedNumberDecimal value={value} />
        </Set>
      </Popover.Disclosure>
      <Popover hasArrow usePortal>
        TODO: table
      </Popover>
    </Popover.State>
  )
}
*/

export const PlayerSpecialDialogDisclosure = ({
  value,
  brandId,
  agentId,
  from,
  to
}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <>
      <Disclosure use={Link} {...dialog}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && (
        <PlayerSpecialDialog
          brandId={brandId}
          agentId={agentId}
          from={from}
          to={to}
          dialog={dialog}
        />
      )}
    </>
  )
}

const Bonus = "bonus"
const BonusTrans = {
  zh: "优惠",
  en: "Bonus"
}

const BonusAdjust = "bonusAdjust"
const BonusAdjustTrans = {
  zh: "优惠调帐",
  en: "Bonus Adjust"
}

const ProductFee = "productFee"
const ProductFeeTrans = {
  zh: "平台费用",
  en: "Product Fee"
}

const Type = {
  Bonus,
  BonusAdjust,
  ProductFee
}

const TypeLabel = ({ value = "" }) => {
  switch (value) {
    case Bonus:
      return <Trans {...BonusTrans} />
    case BonusAdjust:
      return <Trans {...BonusAdjustTrans} />
    case ProductFee:
      return <Trans {...ProductFeeTrans} />
    default:
      return value
  }
}

const PlayerSpecialDialog = ({ brandId, agentId, from, to, dialog }) => {
  let {
    data = {},
    isLoading,
    error,
    mutate,
    deleteCache
  } = useWinlossReportPlayerSpecial({
    brandId,
    agentId,
    from,
    to
  })

  let title = useTrans({
    zh: "玩家特别",
    en: "Player Special"
  })

  let items = Object.entries(data).map(([key, value]) => {
    return {
      type: key,
      value
    }
  })

  let columns = useColumns({ items })
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
  }

  return (
    <Modal title={title} {...dialog}>
      <Box>{JSON.stringify(data)}</Box>
      <Table columns={columns} data={items} foot={items?.length > 0} />
    </Modal>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "type",
        Header: <Trans zh="特别" en="Special" />,
        disableSortBy: true,
        Cell: TypeLabel,
        Footer: () => <Trans zh="总计" en="Total" />
      }),
      numberDecimalColumn({
        accessor: "value",
        Header: <Trans zh="金额" en="Amount" />,
        sumColumn: "value"
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
