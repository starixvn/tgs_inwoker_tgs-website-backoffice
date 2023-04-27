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
import { useWinlossReportCompanyTotal } from "./client"

export const CompanyTotalDialogDisclosure = ({
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
        <AgentTotalDialog
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

const CompanyTotalDialog = ({ brandId, agentId, from, to, dialog }) => {
  let { data, isLoading, error, mutate, deleteCache } =
    useWinlossReportCompanyTotal({ brandId, agentId, from, to })

  let title = useTrans({
    zh: "公司总和",
    en: "Company Total"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} onClickClose={dialog.close} />
  }

  return (
    <Modal title={title} {...dialog}>
      <Box>{JSON.stringify(data)}</Box>
    </Modal>
  )
}
