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
import { Table, toApiParams, useTable, pageCount } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime, formatYearMonthDay } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../dialog/Modal"
import { usePlatformAdjustList } from "./client"

export const AdjustListDialogDisclosure = ({
  value,
  brandId,
  userType,
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
        <AdjustListDialog
          brandId={brandId}
          userType={userType}
          from={from}
          to={to}
          dialog={dialog}
        />
      )}
    </>
  )
}

const AdjustListDialog = ({ brandId, userType, from, to, dialog }) => {
  let { data, isLoading, error, mutate, deleteCache } = usePlatformAdjustList(
    brandId,
    userType,
    { from, to }
  )

  let title = useTrans({
    zh: "调帐报表",
    en: "Balance Adjust Report"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  //TODO: table & useColumns
  return (
    <Modal title={title} {...dialog}>
      {JSON.stringify(data)}
    </Modal>
  )
}
