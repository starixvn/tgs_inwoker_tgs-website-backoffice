import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Set, Button, useModalState, Group } from "bumbag"
import { Trans, useTrans } from "../../i18n"
import { Disclosure } from "../../dialog/Disclosure"
import { Update } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { useUpdatePlatformAutoWithdraw } from "./client"
import { FormDialog } from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import { Checkbox } from "../../checkbox"
import { NumberInputField } from "../../input/NumberInput"
import TransferType from "./BrandPaymentTransferType"
import BrandPaymentStatus from "./BrandPaymentStatus"
import { useBrandPaymentList, usePlatformAutoWithdraw } from "./client"
import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch
} from "react-hook-form"
import { Table } from "../../table"
import { formatNumber } from "../../number/format"
import { textColumn } from "../../table/column/textColumn"
import { PaymentProviderLabel } from "../../payment/PaymentProvider"
import { PaymentMethodLabel } from "../../payment/method/PaymentMethod"
import { PaymentChannelLabel } from "../../payment/channel/PaymentChannel"
import { pluck, difference } from "ramda"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { clone, isObject } from "lodash-es"

export const BrandAutoWithdrawDialogDisclosure = ({
  brandId,
  id,
  dialogId = "auto-withdraw-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <Trans zh="自动提款设定" en="Auto Payments" />
      </Disclosure>
      {dialog.visible && (
        <AutoWithdrawDialog
          brandId={brandId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const AutoWithdrawName = "enableAutoWithdraw"

const AutoWithdrawGroupField = ({}) => {
  let isEnabled = useIsAutoWithdrawEnabled()
  return (
    <Set alignY="center">
      <Checkbox name={AutoWithdrawName} defaultValue={isEnabled} />
      <NumberInputField
        name="amountUpperLimit"
        required={isEnabled}
        min={isEnabled ? 1 : undefined}
        addonBefore={
          <Button isStatic>
            <Trans zh="单笔提款金额<=" en="Each Withdrawal<=" />
          </Button>
        }
      />
    </Set>
  )
}

const useIsAutoWithdrawEnabled = (name = AutoWithdrawName) => {
  let { control } = useFormContext()
  let value = useWatch({
    control,
    name
  })
  return value
}

const useAutoWithdrawFormData = (brandId) => {
  let {
    isLoading: isLoadingBrandAutoWithdraw,
    isValidating: isValidatingBrandAutoWithdraw,
    data: brandAutoWithdraw,
    error: brandAutoWithdrawError,
    mutate,
    deleteCache
  } = usePlatformAutoWithdraw(brandId)

  let {
    isLoading: isLoadingBrandPaymentList,
    data: brandPaymentListData,
    error: brandPaymentListError
  } = useBrandPaymentList(brandId)

  let isLoading =
    isLoadingBrandAutoWithdraw ||
    isValidatingBrandAutoWithdraw ||
    isLoadingBrandPaymentList
  let error = brandAutoWithdrawError || brandPaymentListError

  return {
    isLoading,
    brandAutoWithdraw: isObject(brandAutoWithdraw)
      ? brandAutoWithdraw
      : {
          brandPaymentIds: []
        },
    brandPaymentList: brandPaymentListData?.items,
    error,
    mutate,
    deleteCache
  }
}
const useBrandPaymentListParams = (brandId) => {
  return brandId
    ? {
        brandId,
        transferTyp: TransferType.Withdrawal,
        paymentStatus: BrandPaymentStatus.Enabled,
        sortby: "number",
        showAll: true
      }
    : undefined
}

const AutoWithdrawDialog = ({ brandId, dialog, dialogId, ...props }) => {
  let {
    isLoading,
    brandAutoWithdraw,
    brandPaymentList,
    error,
    mutate,
    deleteCache
  } = useAutoWithdrawFormData(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return (
      <AlertDialog
        {...error}
        onClickClose={() => {
          deleteCache()
          mutate(null, false)
          dialog.hide()
        }}
      />
    )
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  return (
    <AutoWithdrawFormDialog
      brandId={brandId}
      brandAutoWithdraw={brandAutoWithdraw}
      brandPaymentList={brandPaymentList}
      onSubmitted={reset}
      dialog={dialog}
      dialogId={dialogId}
    />
  )
}

const AutoWithdrawFormDialog = ({
  brandId,
  brandAutoWithdraw,
  brandPaymentList,
  dialog,
  dialogId,
  onSubmitted,
  ...props
}) => {
  let title = useTrans({
    zh: "自动提款设定",
    en: "Auto Payments"
  })

  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useUpdatePlatformAutoWithdraw(brandId, formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={clone(brandAutoWithdraw)}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      id={dialogId}
      dialog={dialog}
      title={title}
    >
      <FieldValues>
        <Box alignY="center">
          <Trans zh="自动出款" en="Auto Payments" />
        </Box>
        <AutoWithdrawGroupField />

        <Trans zh="金流通道" en="Payments" />
        <Box>
          <BrandPaymentCheckboxGroupTable
            brandId={brandId}
            transferTyp={TransferType.Withdrawal}
            paymentStatus={BrandPaymentStatus.Enabled}
            prefetchedData={brandPaymentList}
          />
        </Box>
      </FieldValues>
    </FormDialog>
  )
}

const BrandPaymentCheckboxGroupTable = ({
  name = "brandPaymentIds",
  brandId,
  prefetchedData,
  ...props
}) => {
  let brandPaymentListParams = useBrandPaymentListParams(brandId)
  let {
    isLoading,
    data: brandPayment,
    error,
    deleteCache,
    mutate
  } = useBrandPaymentList(
    brandPaymentListParams,
    prefetchedData
      ? {
          fallbackData: prefetchedData
        }
      : undefined
  )

  let items = brandPayment?.items
  let { setValue, control, getValues, clearErrors } = useFormContext()

  let brandPaymentIds = useWatch({
    name,
    control
  })

  const addBrandPaymentId = (id) => {
    let value = [...brandPaymentIds, id]
    setValue(name, value)
  }

  const addAllBrandPaymentIds = () => {
    let value = items?.map(({ id }) => id)
    setValue(name, value)
  }

  const removeBrandPaymentId = (id) => {
    let value = brandPaymentIds.filter((item) => item != id)
    setValue(name, value)
  }

  const removeAllBrandPaymentIds = () => {
    let value = []
    setValue(name, value)
  }

  const clearFieldStateError = () => clearErrors(name)

  let isAutoWithdraw = useIsAutoWithdrawEnabled()
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (list = []) => {
          if (isAutoWithdraw && list.length === 0) {
            return "required"
          }
          return true
        }
      }}
      render={({ field, fieldState }) => {
        let columns = useColumns({
          fieldState,
          items: brandPayment?.items,
          brandPaymentIds,
          addBrandPaymentId,
          addAllBrandPaymentIds,
          removeBrandPaymentId,
          removeAllBrandPaymentIds,
          clearFieldStateError
        })

        return (
          <Table
            isLoading={isLoading}
            columns={columns}
            data={items}
            stickyHead
            containerProps={{
              maxHeight: "60vh",
              minHeight: "max-content",
              overflow: "auto"
            }}
          />
        )
      }}
      defaultValue={brandPaymentIds ?? []}
    />
  )
}

const useColumns = ({
  fieldState,
  items = [],
  brandPaymentIds = [],
  addBrandPaymentId,
  addAllBrandPaymentIds,
  removeBrandPaymentId,
  removeAllBrandPaymentIds,
  clearFieldStateError
}) => {
  let allBrandPaymentIds = pluck("id", items)
  let allChecked =
    allBrandPaymentIds.length > 0 &&
    brandPaymentIds.length > 0 &&
    difference(allBrandPaymentIds, brandPaymentIds).length === 0

  let checkboxState = fieldState.error && "warning"

  return useMemo(() => {
    let columns = [
      textColumn({
        id: "checkbox",
        accessor: (row) => row,
        disableSortBy: true,
        Header: () => {
          return (
            <Checkbox
              checked={allChecked}
              state={checkboxState}
              onChange={(event) => {
                let checked = event.target.checked
                if (checked) {
                  addAllBrandPaymentIds()
                  if (fieldState.error) {
                    clearFieldStateError()
                  }
                } else {
                  removeAllBrandPaymentIds()
                }
              }}
            />
          )
        },
        Cell: ({ value: brandPayment }) => {
          let checked = brandPaymentIds.includes(brandPayment.id)
          return (
            <Checkbox
              checked={checked}
              state={checkboxState}
              onChange={(event) => {
                let checked = event.target.checked
                if (checked) {
                  addBrandPaymentId(brandPayment.id)
                  if (fieldState.error) {
                    clearFieldStateError()
                  }
                } else {
                  removeBrandPaymentId(brandPayment.id)
                }
              }}
            />
          )
        }
      }),
      textColumn({
        accessor: "paymentId",
        Header: <Trans zh="支付厂商" en="Payer" />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentProviderLabel value={value} />
      }),
      textColumn({
        accessor: "paymentChannelId",
        Header: <Trans zh="支付通道" en="Channel" />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentChannelLabel value={value} />
      }),
      textColumn({
        accessor: "channelName",
        Header: <Trans zh="通道名称" en="Name" />,
        disableSortBy: true
      }),
      textColumn({
        id: "limit",
        accessor: (row) => row,
        Header: <Trans zh="单笔限额" en="Min - Max" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let from = formatNumber(value.transferLimitFrom)
          let to = formatNumber(value.transferLimitTo)
          return (
            <Text.Block whiteSpace="nowrap">{`${from} - ${to}`}</Text.Block>
          )
        }
      })
    ]
    return columns
  }, [JSON.stringify(items), JSON.stringify(brandPaymentIds), checkboxState])
}
