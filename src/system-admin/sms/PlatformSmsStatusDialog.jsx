import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  FieldStack,
  Set,
  Dialog,
  Box,
  Level,
  FieldWrapper
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import FormDialog from "../../form/FormDialog"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useBrand, useEnablePlatformSms } from "../../merchant/platforms/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Switch from "../../switch/Switch"

export const PlatformSmsStatusDialogDisclosure = ({ brandId }) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <Trans en="Platform SMS Status" zh="平台简讯状态" />
      </Disclosure>
      {dialog.visible && <FetchDialog brandId={brandId} dialog={dialog} />}
    </>
  )
}

const PlatformSmsStatus = {
  en: "Platform SMS Status",
  zh: "平台简讯状态"
}
export const PlatformSmsStatusTrans = () => <Trans {...PlatformSmsStatus} />
export const usePlatformSmsStatusTrans = () => useTrans(PlatformSmsStatus)

const FetchDialog = ({ brandId, dialog }) => {
  let { isLoading, data: brand, error, mutate } = useBrand(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <StatusFormDialog
      brandId={brandId}
      defaultValues={{
        enableSms: brand?.enableSms
      }}
      onSubmitted={mutate}
      dialog={dialog}
    />
  )
}

const StatusFormDialog = ({ brandId, defaultValues, dialog, onSubmitted }) => {
  let title = usePlatformSmsStatusTrans()
  let [enableSms, setEnableSms] = useState()
  let { isLoading, result, error, mutate } = useEnablePlatformSms(
    brandId,
    enableSms
  )

  const onSubmit = ({ enableSms }) => {
    setEnableSms(enableSms)
  }

  const reset = () => {
    setEnableSms(null)
    mutate(undefined, false)
  }

  return (
    <FormDialog
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
    >
      <Switch name="enableSms" />
    </FormDialog>
  )
}
