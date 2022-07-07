import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Alert } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { WarningConfirmFormDialog } from "../../form/FormDialog"
import { useClearPlayerWageringRequirement } from "./client"
import AlertDialog from "../../dialog/Alert"

export const PlayerClearWageringRequirementDisclosure = ({
  playerCode,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()
  let label = useTrans({
    zh: "清除滿足提款金額",
    en: "Clear Wagering Requirement"
  })

  return (
    <>
      <Disclosure {...dialog} {...props}>
        {label}
      </Disclosure>
      {dialog.visible && (
        <ResetDialog
          playerCode={playerCode}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ResetDialog = ({ playerCode, username, onSubmitted, dialog }) => {
  let title = useTrans({
    zh: "清除滿足提款金額？",
    en: "Clear Wagering Requirement？"
  })
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useClearPlayerWageringRequirement(formData)

  const onSubmit = () => {
    setSubmit(playerCode)
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  return (
    <>
      <Backdrop {...dialog}>
        <WarningConfirmFormDialog
          id="clear-player-wagering-requirement-dialog"
          onSubmit={onSubmit}
          stopPropagation={true}
          onSubmitted={() => {
            reset()
            onSubmitted?.()
          }}
          isLoading={isLoading}
          result={result}
          error={error}
          dialog={dialog}
          hideBackdrop={true}
          title={title}
        ></WarningConfirmFormDialog>
      </Backdrop>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
