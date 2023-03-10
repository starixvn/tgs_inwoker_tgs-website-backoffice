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

  let title = useTrans({
    zh: "代理总分红",
    en: "Agent Profit"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
  }

  return (
    <Modal title={title} {...dialog}>
      TODO Table
    </Modal>
  )
}
