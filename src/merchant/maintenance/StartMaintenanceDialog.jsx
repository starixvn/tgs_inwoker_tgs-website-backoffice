import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Alert } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { WarningConfirmFormDialog } from "../../form/FormDialog"
import { useStartMaintenance } from "./client"
import AlertDialog from "../../dialog/Alert"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update } from "./menu"
import { ConfirmText } from "../../button/ActionButtons"

export const StartMaintenanceDialogDisclosure = ({
  onSubmitted,
  palette = "danger",
  variant = "outlined",
  ...props
}) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} palette={palette} variant={variant} {...props}>
        <Trans zh="開始維護" en="Start Maintenance" />
      </Disclosure>
      {dialog.visible && (
        <StartMaintenanceDialog dialog={dialog} onSubmitted={onSubmitted} />
      )}
    </>
  )
}

const StartMaintenanceDialog = ({ dialog, onSubmitted, ...props }) => {
  let title = useTrans({
    zh: "開始維護？",
    en: "Start Maintenance？"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useStartMaintenance(formData)

  const onSubmit = () => {
    let startMaintenance = true
    setSubmit(startMaintenance)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <>
      <WarningConfirmFormDialog
        id="start-maintenance-dialog-disclosure"
        onSubmit={onSubmit}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        isLoading={isLoading}
        result={result}
        error={error}
        dialog={dialog}
        title={title}
        submitText={<ConfirmText />}
      ></WarningConfirmFormDialog>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
