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

//TODO: a record?
export const PlayerSpecial = ({ value }) => {
  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <Popover.State>
      <Popover.Disclosure use={Link}>
        <FormattedNumberDecimal value={value} />
      </Popover.Disclosure>
      {/* <Popover.Disclosure>
        <Set orientation="horizontal" whiteSpace="nowrap" width="max-content">
          <Icon icon={faPlus} type="font-awesome" />
          <FormattedNumberDecimal value={value} />
        </Set>
      </Popover.Disclosure> */}
      <Popover hasArrow usePortal>
        TODO: table
      </Popover>
    </Popover.State>
  )
}

export const PlayerSpecialDialogDisclosure = ({}) => {
  let dialog = useModalState()

  if (!Number.isFinite(value) || value === 0) {
    return <FormattedNumberDecimal value={value} />
  }

  return (
    <>
      <Disclosure use={Link} {...dialog}>
        <FormattedNumberDecimal value={value} />
      </Disclosure>
      {dialog.visible && <PlayerSpecialDialog dialog={dialog} />}
    </>
  )
}

const PlayerSpecialDialog = ({ dialog }) => {
  return (
    <Modal title="" {...dialog}>
      <Box>TODO</Box>
    </Modal>
  )
}
