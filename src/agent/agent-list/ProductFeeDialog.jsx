import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Set, Icon } from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import AlertDialog from "../../dialog/Alert"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { ProductFee } from "./menu"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import FormDialog from "../../form/FormDialog"
import {
  usePlatformProductFee,
  useUpdatePlatformProductFee
} from "../../merchant/platforms/client"
import { FieldValues } from "../../layout/Grid"
import {
  CardGameTrans,
  EGameTrans,
  LiveDealerTrans,
  LotteryTrans,
  SportsbookTrans,
  VirtualSportsTrans
} from "../../trans/Game"
import { PercentageNumberInputField } from "../../input/NumberInput"
import clone from "clone-deep"
import Label from "../../form/Label"
import {
  DefaultProductFeeTrans,
  useDefaultProductFeeTrans
} from "../../trans/Platform"
import { SWRConfig } from "swr"

export const ProductFeeDialogDisclosure = ({
  brandId,
  id,
  dialogId = "product-fee-dialog"
}) => {
  let dialog = useModalState()

  let auth = useIsDisplayMenuByRoute([ProductFee])
  if (!auth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <DefaultProductFeeTrans />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <FetchDialog brandId={brandId} dialog={dialog} dialogId={dialogId} />
        </SWRConfig>
      )}
    </>
  )
}

const FetchDialog = ({ brandId, dialog, dialogId }) => {
  let { isLoading, data, error } = usePlatformProductFee(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <EditDialog
      brandId={brandId}
      record={data}
      dialog={dialog}
      dialogId={dialogId}
    />
  )
}

const EditDialog = ({ brandId, record, dialog, dialogId }) => {
  let title = useDefaultProductFeeTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } =
    useUpdatePlatformProductFee(formData)

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      brandId
    })
  }

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      id={dialogId}
    >
      <ProductFreeFormBody />
    </FormDialog>
  )
}

const ProductFreeFormBody = ({ addonBefore, ...props }) => {
  return (
    <FieldValues {...props}>
      {addonBefore}

      <Label required>
        <LiveDealerTrans />
      </Label>
      <PercentageNumberInputField
        name="liveDealerPercentage"
        required
        step="1"
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <Label required>
        <SportsbookTrans />
      </Label>
      <PercentageNumberInputField
        name="sportsPercentage"
        required
        step="1"
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <Label required>
        <EGameTrans />
      </Label>
      <PercentageNumberInputField
        name="slotPercentage"
        required
        step="1"
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <Label required>
        <CardGameTrans />
      </Label>
      <PercentageNumberInputField
        name="cardGamePercentage"
        required
        step="1"
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <Label required>
        <LotteryTrans />
      </Label>
      <PercentageNumberInputField
        name="lotteryPercentage"
        required
        step="1"
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <Label required>
        <VirtualSportsTrans />
      </Label>
      <PercentageNumberInputField
        name="virtualSportsPercentage"
        required
        step="1"
        registerOptions={{
          valueAsNumber: true
        }}
      />
    </FieldValues>
  )
}
