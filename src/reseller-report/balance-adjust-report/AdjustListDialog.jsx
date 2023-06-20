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
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure from "../../dialog/Disclosure"
import SearchButton from "../../button/SearchButton"
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
import sequenceColumn from "../../table/column/sequence"
import { isPlayer } from "./UserType"
import { PlayerAdjustBalanceTypeLabel } from "../../player-management/balance-adjustment/PlayerAdjustBalanceType"
import { InputField } from "../../input/Input"
import { AdjustTypeSelect, AdjustTypeLabel } from "./AdjustType"
import { useMeasure } from "react-use"

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
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    from,
    to
  })

  let { data, isLoading, error, mutate, deleteCache } = usePlatformAdjustList(
    brandId,
    userType,
    toApiParams(state)
  )

  let title = useTrans({
    zh: "调帐报表",
    en: "Balance Adjust Report"
  })

  let columns = useColumns({ items: data, userType })

  let maxHeightInVH = 70 //vh
  let minHeight = 300
  let maxHeight = Math.max(
    (window.innerHeight * maxHeightInVH) / 100,
    minHeight
  )

  /*
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }
  */

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal title={title} placement="top" {...dialog}>
      <FieldStack
        orientation="vertical"
        isFilled
        minHeight="20vh"
        maxHeight="80vh"
      >
        <SearchBar
          userType={userType}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
        />
        <Table
          columns={columns}
          data={data?.items}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          stickyHead
          maxSize={
            Number.isFinite(maxHeight) ? { height: maxHeight } : undefined
          }
        />
      </FieldStack>
    </Modal>
  )
}

const SearchBar = ({ userType, search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {
      type: null,
      user: "",
      operator: ""
    }
  })

  let userPlaceholder = useTrans({
    zh: "用戶名",
    en: "Username"
  })

  let operatorPlaceholder = useTrans({
    zh: "操作者",
    en: "Adjust By"
  })

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <AdjustTypeSelect userType={userType} />
          <InputField
            name="user"
            placeholder={userPlaceholder}
            showEmptyFieldValueAddonAfter
          />
          <InputField
            name="operator"
            placeholder={operatorPlaceholder}
            showEmptyFieldValueAddonAfter
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) => {
  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="时间" en="Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "userName",
        Header: <Trans zh="用戶名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "adjustType",
        Header: <Trans zh="调帐类型" en="Adjust Type" />,
        disableSortBy: true,
        Cell: AdjustTypeLabel
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="金额" en="Amount" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "operator",
        Header: <Trans zh="操作者" en="Adjust By" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
