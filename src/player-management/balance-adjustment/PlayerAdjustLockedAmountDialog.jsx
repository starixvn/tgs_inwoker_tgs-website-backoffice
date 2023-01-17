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
import Disclosure, { AddDisclosure } from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import {
  CloseButtonFooter,
  ConfirmButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { usePlayerAdjustReduceBalance } from "./client"
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
import { AdjustLockedAmount } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext, useWatch } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInputField } from "../../input/NumberInput"
import { usePlayer } from "../player-list/client"
import {
  PlayerAdjustBalanceTypeSelect,
  isTransfer,
  showIncludeInNetProfitSetting
} from "./PlayerAdjustBalanceType"
import Checkbox from "../../checkbox"

export const PlayerAdjustLockedAmountDialogDisclosure = ({
  playerCode,
  id,
  dialogId = "player-adjust-locked-amount-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([AdjustLockedAmount])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)

  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <Trans zh="解鎖" en="Unlock" />
      </Disclosure>
      {dialog.visible && (
        <AdjustLockedAmountDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const AdjustLockedAmountDialog = () => {}
