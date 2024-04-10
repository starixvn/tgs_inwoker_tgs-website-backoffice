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
  usePlatformGameTypeFeeSetting,
  useUpdatePlatformGameTypeFeeSetting
} from "../../merchant/platforms/client"

export const DefaultGameTypeFeeDialog = ({
  brandId,
  id,
  dialogId = "platform-game-type-fee-dialog"
}) => {
  let dialog = useModalState()

  let auth = useIsDisplayMenuByRoute([GameTypeFee])
  if (!auth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure></Disclosure>
      {dialog.visible && (
        <FetchDialog brandId={brandId} dialog={dialog} dialogId={dialogId} />
      )}
    </>
  )
}

const FetchDialog = ({ brandId, dialog }) => {
  let { isLoading, data, error, deleteCache } =
    usePlatformGameTypeFeeSetting(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <EditDialog brandId={brandId} record={data} onSubmitted={deleteCache} />
  )
}

const EditDialog = ({ brandId, record, dialog, dialogId, onSubmitted }) => {
  //TODO: if record change, able to reset form default values?
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } =
    useUpdatePlatformGameTypeFeeSetting(brandId, formData)

  return <FormDialog dialog={dialog} id={dialogId}></FormDialog>
}
