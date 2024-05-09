import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  Level,
  DropdownMenu,
  Spinner,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure
} from "../../dialog/Disclosure"
import {
  useForm,
  useFormContext,
  useFieldArray,
  Controller,
  FormProvider
} from "react-hook-form"
import FormDialog from "../../form/FormDialog"
import { Trans, useLangCode, useLocale, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import textColumn from "../../table/column/textColumn"
import { InputField, Input } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import dateTimeColumn from "../../table/column/dateTime"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { useGameProviderReportList } from "./client"
import { isValid } from "date-fns"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import {
  BetAmountTrans,
  GameProviderTrans,
  TransactionCountTrans,
  TurnoverTrans,
  ValidBetAmountTrans
} from "../../trans/Game"
import { CurrencyTrans } from "../../trans/Payment"
import { CompanyWinLossTrans } from "../../trans/Platform"

export const GameProviderCurrencyReportDisclosure = ({
  use = Link,
  month,
  currencyCode,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure use={use} {...dialog} {...props}>
        {currencyCode}
      </Disclosure>
      {dialog.visible && (
        <ReportDialog
          month={month}
          currencyCode={currencyCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ReportDialog = ({ month, currencyCode, dialog, ...props }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    month,
    currencyCode
  })

  let culture = useLangCode()
  let toSearchParams = () => ({
    ...toApiParams(state),
    /*
    TODO
    sortby: "gameProviderName",
    */
    culture,
    month
  })

  let { isLoading, data, error, mutate } = useGameProviderReportList(
    isValid(month) ? toSearchParams() : undefined
  )

  let columns = useColumns({
    items: data?.items
  })

  return (
    <Dialog.Modal
      {...dialog}
      footer={<CloseButtonFooter alignX="right" dialog={dialog} />}
      showCloseButton
      hideOnClickOutside={false}
      placement="top"
      width="80vw"
      maxWidth="80vw"
    >
      <FieldStack>
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          getRowProps={({ original: { isTotal }, index } = {}) => {
            if (isTotal) {
              return {
                "data-row-type": "total",
                backgroundColor: "white600",
                fontWeight: "bold"
              }
            }
            return {}
          }}
          stickyHead
        />
        {error && <AlertDialog {...error} onClickClose={dialog.hide} />}
      </FieldStack>
    </Dialog.Modal>
  )
}

const useColumns = ({ items = [], month }) => {
  return useMemo(
    () => [
      textColumn({
        id: "gameProviderName",
        accessor: (row) => row,
        Header: <GameProviderTrans />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, gameProviderName } }) => {
          return isTotal ? <Trans zh="共计" en="Total" /> : gameProviderName
        }
      }),
      textColumn({
        id: "currencyCode",
        accessor: (row) => row,
        Header: <CurrencyTrans />,
        disableSortBy: true,
        Cell: ({ value: { isTotal, currencyCode = "" } }) => {
          return currencyCode
        }
      }),
      numberColumn({
        accessor: "transactionCount",
        Header: <TransactionCountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        Header: <BetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "originalTurnover",
        Header: <TurnoverTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        Header: <ValidBetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyWinLoss",
        Header: <CompanyWinLossTrans />,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
}
