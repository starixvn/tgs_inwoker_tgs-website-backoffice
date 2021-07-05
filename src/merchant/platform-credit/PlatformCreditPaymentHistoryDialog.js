import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box
} from "bumbag"
import { useIsDisplayMenuByRoute, useUserLicenseeId } from "../../user/context"
import { Disclosure, EditDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Update as UpdateMenu } from "./menu"
import { usePayPlatformCredit } from "./client"
import clone from "clone-deep"
import { useTrans, Trans, FormattedNumber } from "../../i18n"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { useFormContext } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInput } from "../../input/NumberInput"

export const PlatformCreditPaymentHistoryDialogDisclosure = ({
  record,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <Trans zh="历史" en="Payment History" />
      </Disclosure>
      {dialog.visible && <HistoryDialog record={record} dialog={dialog} />}
    </>
  )
}

const HistoryDialog = ({ record, onSubmitted, dialog, ...props }) => {}
