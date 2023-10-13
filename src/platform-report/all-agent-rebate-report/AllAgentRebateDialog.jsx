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
import { formatDateTime } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { startOfNextDay } from "../../date/startOfNextDay"
import {
  useAllAgentRebateDetails,
  useAllAgentRebateGameTypeDetails
} from "./client"
import Modal from "../../dialog/Modal"

//TODO
export const AllAgentRebateDialogDisclosure = ({
  brandId,
  value,
  username,
  playerCode,
  settleDateTime,
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
        <ReportDialog
          brandId={brandId}
          username={username}
          playerCode={playerCode}
          settleDateTime={settleDateTime}
          dialog={dialog}
        />
      )}
    </>
  )
}

const useReportData = (searchParams) => {
  let {
    isLoading: isLoadingRebateList,
    data: items,
    error: rebateListError,
    mutate: mutateRebateList,
    deleteCache: deleteRebateListCache
  } = useAllAgentRebateDetails(searchParams)
  let {
    isLoading: isLoadingGameTypeDetails,
    data: gameTypeDetails,
    error: gameTypeDetailError,
    mutate: mutateGameTypeDetails,
    deleteCache: deleteGameTypeDetailsCache
  } = useAllAgentRebateGameTypeDetails(searchParams)

  let isLoading = isLoadingRebateList || isLoadingGameTypeDetails
  let data =
    items && gameTypeDetails
      ? {
          items,
          gameTypeDetails
        }
      : undefined
  let error = rebateListError || gameTypeDetailError

  return {
    isLoading,
    data,
    error,
    mutate: (_, shouldRevalidate) => {
      mutateRebateList(_, shouldRevalidate)
      mutateGameTypeDetails(_, shouldRevalidate)
    },
    deleteCache: () => {
      deleteRebateListCache()
      deleteGameTypeDetailsCache()
    }
  }
}

//TODO: client side pagnation
//TODO: useTable? or useState?
const ReportDialog = ({
  brandId,
  username,
  playerCode,
  settleDateTime,
  dialog
}) => {
  let title = useTrans({
    zh: "全民代理返水细项",
    en: "All Agent Rebate Detail"
  })

  let { isLoading, data, error } = useReportData({
    brandId,
    playerCode,
    settleDateTime
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  //TODO
  return (
    <Modal title={title} {...dialog}>
      <FieldStack>
        <FieldValues marginLeft="1rem">
          <Trans zh="全民代理上级" en="All Agent Username" />
          <Text.Block alignY="center">{username}</Text.Block>

          <Trans zh="结算日期" en="Settlement Date" />
          <Text.Block>
            <FormattedDate value={settleDateTime} dateFormat="dd/MM/yyyy" />
          </Text.Block>
        </FieldValues>
        <Separator />
        {JSON.stringify(data)}
      </FieldStack>
    </Modal>
  )
}
