import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Set, Icon } from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import AlertDialog from "../../dialog/Alert"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { GameTypeFee } from "./menu"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import FormDialog from "../../form/FormDialog"
import {
  usePlatformAgentGameTypeFees,
  useUpdatePlatformAgentGameTypeFees
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

export const GameTypeFeeDialogDisclosure = ({
  brandId,
  id,
  dialogId = "game-type-fee-dialog"
}) => {
  let dialog = useModalState()

  let auth = useIsDisplayMenuByRoute([GameTypeFee])
  if (!auth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  //TODO: trans
  return (
    <>
      <Disclosure {...dialog}>Default Game Type Fee</Disclosure>
      {dialog.visible && (
        <FetchDialog brandId={brandId} dialog={dialog} dialogId={dialogId} />
      )}
    </>
  )
}

const FetchDialog = ({ brandId, dialog }) => {
  let { isLoading, data, error, deleteCache } =
    usePlatformAgentGameTypeFees(brandId)

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
      onSubmitted={deleteCache}
    />
  )
}

const EditDialog = ({ brandId, record, dialog, dialogId, onSubmitted }) => {
  //TODO: trans
  let title = "Game Type Fee"

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } =
    useUpdatePlatformAgentGameTypeFees(brandId, formData)

  //TODO: form submit
  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  //TODO: clone record for defaultValues
  return (
    <FormDialog
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={onSubmitted}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      id={dialogId}
    >
      <GameTypeFreeFormBody />
    </FormDialog>
  )
}

export const GameTypeFreeFormBody = ({ addonBefore, ...props }) => {
  return (
    <FieldValues {...props}>
      {addonBefore}

      <Label required>
        <LiveDealerTrans />
      </Label>
      <PercentageNumberInputField name="liveDealer" required step="1" />

      <Label required>
        <SportsbookTrans />
      </Label>
      <PercentageNumberInputField name="sports" required step="1" />

      <Label required>
        <EGameTrans />
      </Label>
      <PercentageNumberInputField name="eGame" required step="1" />

      <Label required>
        <CardGameTrans />
      </Label>
      <PercentageNumberInputField name="cardGame" required step="1" />

      <Label required>
        <LotteryTrans />
      </Label>
      <PercentageNumberInputField name="lottery" required step="1" />

      <Label required>
        <VirtualSportsTrans />
      </Label>
      <PercentageNumberInputField name="virtualSports" required step="1" />
    </FieldValues>
  )
}
