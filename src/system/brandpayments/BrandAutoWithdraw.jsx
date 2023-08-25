import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Set, Button, useModalState, Group } from "bumbag"
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
import { useBrandPaymentList } from "./client"
import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch
} from "react-hook-form"
import { Table } from "../../table"
import { textColumn } from "../../table/column/textColumn"
import { PaymentProviderLabel } from "../../payment/PaymentProvider"
import { PaymentMethodLabel } from "../../payment/method/PaymentMethod"
import { PaymentChannelLabel } from "../../payment/channel/PaymentChannel"
import { pluck, difference } from "ramda"

//TODO: readOnly?
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

const AutoWithdrawDialog = ({ brandId, dialog, dialogId, ...props }) => {
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
      onSubmit={onSubmit}
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
        <Set alignY="center">
          <Checkbox name="autoWithdraw" />
          <NumberInputField />
        </Set>

        <Trans zh="金流通道" en="Payments" />
        <Box>
          <BrandPaymentCheckboxGroupTable
            brandId={brandId}
            transferTyp={TransferType.Withdrawal}
            paymentStatus={BrandPaymentStatus.Enabled}
          />
        </Box>
      </FieldValues>
    </FormDialog>
  )
}

const BrandPaymentCheckboxGroupTable = ({
  name = "payments",
  brandId,
  transferType,
  paymentStatus,
  ...props
}) => {
  let {
    isLoading,
    data: brandPayment,
    error,
    deleteCache,
    mutate
  } = useBrandPaymentList(
    brandId
      ? {
          brandId,
          transferType,
          paymentStatus,
          sortby: "number",
          showAll: true
        }
      : undefined
  )

  //TODO: filter out manual provider?
  let items = brandPayment?.items
  let { setValue, control, getValues } = useFormContext()

  let brandPaymentIds = useWatch({
    name,
    control,
    defaultValue: []
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

  let columns = useColumns({
    items: brandPayment?.items,
    brandPaymentIds,
    addBrandPaymentId,
    addAllBrandPaymentIds,
    removeBrandPaymentId,
    removeAllBrandPaymentIds
  })

  //TODO: atlease one required validation on table?
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Table isLoading={isLoading} columns={columns} data={items} />
      )}
      defaultValue={brandPaymentIds}
    />
  )
}

const useColumns = ({
  items = [],
  brandPaymentIds,
  addBrandPaymentId,
  addAllBrandPaymentIds,
  removeBrandPaymentId,
  removeAllBrandPaymentIds
}) => {
  let allBrandPaymentIds = pluck("id", items)
  let allChecked =
    allBrandPaymentIds.length > 0 &&
    brandPaymentIds.length > 0 &&
    difference(allBrandPaymentIds, brandPaymentIds).length === 0

  return useMemo(() => {
    let columns = [
      textColumn({
        id: "checkbox",
        accessor: (row) => row,
        disableSortBy: true,
        Header: (
          <Checkbox
            checked={allChecked}
            onChange={(event) => {
              let checked = event.target.checked
              if (checked) {
                addAllBrandPaymentIds()
              } else {
                removeAllBrandPaymentIds()
              }
            }}
          />
        ),
        Cell: ({ value: brandPayment }) => {
          let checked = brandPaymentIds.includes(brandPayment.id)
          return (
            <Checkbox
              checked={checked}
              onChange={(event) => {
                let checked = event.target.checked
                if (checked) {
                  addBrandPaymentId(brandPayment.id)
                } else {
                  removeBrandPaymentId(brandPayment.id)
                }
              }}
            />
          )
        }
      }),
      textColumn({
        accessor: "channelName",
        Header: <Trans zh="通道名称" en="Channel Name" />,
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items), JSON.stringify(brandPaymentIds)])
}
