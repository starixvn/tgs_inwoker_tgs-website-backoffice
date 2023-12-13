import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Alert } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Backdrop from "../../dialog/Backdrop"
import { WarningConfirmFormDialog } from "../../form/FormDialog"
import {
  useClearPlayerWageringRequirement,
  usePlayerBalanceChangeUnsaved
} from "./client"
import AlertDialog from "../../dialog/Alert"
import { BalanceChangeUnsaved } from "./menu"
import Modal from "../../dialog/Modal"
import { toApiParams, useTable } from "../../table"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"

const UnsavedData = {
  zh: "未寫入資料",
  en: "Unsaved Data"
}
const UnsavedDataTrans = () => <Trans {...UnsavedData} />
const useUnsavedDataTrans = () => useTrans(UnsavedData)

export const BalanceChangeUnsavedDataDisclosure = ({ playerCode }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([BalanceChangeUnsaved])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <UnsavedDataTrans />
      </Disclosure>
      {dialog.visible && (
        <UnsavedDialog playerCode={playerCode} dialog={dialog} />
      )}
    </>
  )
}

const UnsavedDialog = ({ playerCode, dialog, ...props }) => {
  let title = useUnsavedDataTrans()
  let { state, setState, setPageIndex, setSortOrder } = useTable()

  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = usePlayerBalanceChangeUnsaved(playerCode, toApiParams(state))

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  //TODO: error alert
  return (
    <Modal title={title} {...dialog}>
      {JSON.stringify(data)}
    </Modal>
  )
}
