import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Set,
  Box,
  Icon,
  Dialog,
  useModalState,
  FieldStack,
  Link,
  Button,
  Divider
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import { isApproveOrReject, isApprove, isReject } from "./PlayerIdentityState"
import { useTrans } from "../../i18n"
import { useUpdatePlayerIdentity } from "./client"

//TODO: auth menu
export const ResetPlayerIdentityAuthDisclosure = ({ record }) => {
  let dialog = useModalState()

  let label = useResetLabel(record?.status)

  let reviewed = isApproveOrReject(record?.status)
  if (!reviewed) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>{label}</Disclosure>
      {dialog.visible && <ResetDialog record={record} dialog={dialog} />}
    </>
  )
}

const useResetLabel = ({ status }) => {
  let resetApprove = useTrans({
    zh: "重设核准",
    en: "Reset Approve"
  })
  let resetReject = useTrans({
    zh: "重设拒绝",
    en: "Reset Reject"
  })
  if (isApprove(status)) {
    return resetApprove
  }

  if (isReject(status)) {
    return resetReject
  }

  return ""
}

const identityAuthenticationOf = (status) => {
  if (isApprove(status)) {
    return true
  }

  if (isReject(status)) {
    return false
  }

  return null
}

const ResetDialog = ({ record, dialog }) => {
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, deleteCache, mutate } =
    useUpdatePlayerIdentity(
      formData.playerCode,
      formData.identityAuthentication
    )

  const onSubmit = () => {
    let playerCode = record?.playerCode
    let identityAuthentication = identityAuthenticationOf(record?.status)
    setSubmit({
      playerCode,
      identityAuthentication
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{}}
      onSubmit={setSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
    ></FormDialog>
  )
}
