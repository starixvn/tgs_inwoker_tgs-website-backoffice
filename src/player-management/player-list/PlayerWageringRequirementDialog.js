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
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { usePlayerWageringRequirementList } from "./client"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"

export const PlayerWageringRequirementDialogDisclosure = ({
  brandId,
  playerCode,
  ...props
}) => {
  let dialog = new useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="流水Logs" en="Wagering requirement Logs" />
      </Disclosure>
      {dialog.visible && (
        <ReportDialog
          brandId={brandId}
          playerCode={playerCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ReportDialog = ({ brandId, playerCode, dialog, ...props }) => {
  let title = useTrans({
    zh: "流水Logs",
    en: "Wagering requirement Logs"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    playerCode
  })

  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerWageringRequirementList(toApiParams(state))

  let columns = useColumns({ items: data?.items })

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

const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      dateTimeColumn({
        Header: <Trans zh="时间" en="Time" />,
        accessor: "recordedOn",
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )
