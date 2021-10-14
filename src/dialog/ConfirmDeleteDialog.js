import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react"
import { Button, Modal, css, Icon, useModalState, Alert } from "bumbag"
import { Trans, useTrans } from "../i18n"
import { faCog, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { DeleteDisclosure } from "./Disclosure"
import FormDialog from "../form/FormDialog"

export const ConfirmDeleteDialogDisclosure = ({
  confirmDeleteDialog: ConfirmDeleteDialog = ConfirmDeleteDialog,
  defaultValues,
  addonAfter,
  useFetch,
  onSubmit,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <DeleteDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <ConfirmDeleteDialog
          defaultValues={defaultValues}
          useFetch={useFetch}
          dialog={dialog}
          addonAfter={addonAfter}
          onSubmit={onSubmit}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

export const ConfirmDeleteDialog = ({
  defaultValues,
  useFetch,
  addonAfter,
  onSubmit,
  onSubmitted,
  ...props
}) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useFetch(formData)

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={defaultValues}
      onSubmit={(data) => {
        reset()

        let formData = onSubmit ? onSubmit(data) : data
        setSubmit(formData)
      }}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        onSubmitted?.()

        reset()
      }}
      dialog={dialog}
      {...props}
    >
      <Alert
        title={<Trans zh={`确认删除`} en={`Confirm delete？`} />}
        type="warning"
        variant=""
      />
      {addonAfter}
    </FormDialog>
  )
}
