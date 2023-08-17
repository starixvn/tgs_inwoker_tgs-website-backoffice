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
  Alert
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import { isApproveOrReject, isApprove, isReject } from "./PlayerIdentityState"
import { useTrans } from "../../i18n"
import { useUpdatePlayerIdentity } from "./client"
import { FormDialog } from "../../form/FormDialog"
import { Reset } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"

export const ResetPlayerIdentityAuthDisclosure = ({ record }) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Reset])

  let label = useResetLabel(record?.status)

  let reviewed = isApproveOrReject(record?.status)
  if (!reviewed || !hasAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>{label}</Disclosure>
      {dialog.visible && <ResetDialog record={record} dialog={dialog} />}
    </>
  )
}

const useResetLabel = (status) => {
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
      formData?.playerCode,
      formData?.identityAuthentication
    )

  let label = useResetLabel(record?.status)

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
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      onSubmitted={reset}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
    >
      <Alert title={`${label}?`} type="warning" variant="" />
    </FormDialog>
  )
}
