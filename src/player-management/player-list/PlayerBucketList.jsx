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
import { Disclosure, ViewDisclosure } from "../../dialog/Disclosure"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  usePlayerWageringRequirementList,
  usePlayerCompletedWageringList
} from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import SequenceColumn from "../../table/column/sequence"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import { Modal } from "../../dialog/Modal"
import { useIsAdminUser } from "../../user/context"
import { PlatformBucketLabel } from "../../platform-management/PlatformBucket"
import { usePlayerBucketList } from "./client"

//TODO: platformId?
export const PlayerBucketListDialogDisclosure = ({ playerCode, ...props }) => {
  let dialog = new useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="流水需求" en="Wagering Requirements" />
      </Disclosure>
      {dialog.visible && (
        <PlayerBucketListDialog playerCode={playerCode} dialog={dialog} />
      )}
    </>
  )
}

//TODO: fake api & data
const PlayerBucketListDialog = ({ playerCode }) => {
  let title = useTrans({
    zh: "流水需求",
    en: "Wagering Requirements"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    playerCode
  })

  //TODO: sortby & orderby? need extra params?
  let {
    isLoading,
    data: items,
    error,
    mutate,
    deleteCache
  } = usePlayerBucketList(playerCode)

  let columns = usePlayerBucketListColumns({ playerCode, items })

  if (error) {
    return <AlertDialog {...error} />
  }

  //TODO: 
  return null
}

const usePlayerBucketListColumns = ({ playerCode, items = [] }) =>
  useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "type",
        Header: <Trans zh="" en="" />,
        disableSortBy: true,
        Cell: ({ value: type }) => {
          //TODO:
          return <PlatformBucketLabel value={type} />
        }
      })
    ]
    return columns
  }, [playerCode, JSON.stringify(items)])
