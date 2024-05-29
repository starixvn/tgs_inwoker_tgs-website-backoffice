import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Set,
  Card,
  Stack,
  Box,
  Dialog,
  useModalState,
  Alert,
  DropdownMenu,
  Group,
  FieldStack
} from "bumbag"
import { ViewSms, UpdateSms } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import {
  SMSProviderTrans,
  SMSVerificationTrans,
  useSMSVerificationTrans
} from "../../trans/Sms"
import { useUpdatePlatformSms } from "./client"
import { useSmsList } from "../../sms/client"
import { useBrand } from "../../merchant/platforms/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Modal from "../../dialog/Modal"
import { FieldValues } from "../../layout/Grid"
import Switch from "../../switch/Switch"
import { PlatformSmsSelect } from "../../sms/PlatformSmsSelect"
import { useFormContext, useWatch } from "react-hook-form"

//TODO: test case
export const SmsVerificationDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let viewAuth = useIsDisplayMenuByRoute([ViewSms])
  let editable = useIsDisplayMenuByRoute([UpdateSms])
  let readOnly = !editable
  if (!viewAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <SMSVerificationTrans />
      </Disclosure>
      {dialog.visible && (
        <FetchDialog brandId={brandId} readOnly={readOnly} dialog={dialog} />
      )}
    </>
  )
}

const FetchDialog = ({ brandId, dialog, ...props }) => {
  let {
    isLoading: isLoadingBrand,
    data: brand,
    error: brandError,
    mutate: mutateBrand
  } = useBrand(brandId)
  let {
    isLoading: isLoadingSmsList,
    data: smsList,
    error: smsListError,
    mutate: mutateSmsList
  } = useSmsList()

  let isLoading = isLoadingBrand || isLoadingSmsList
  if (isLoading) {
    return <LoadingBackdrop {...dialog} onClickClose={dialog.hide} />
  }

  let error = brandError || smsListError
  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  let sms = smsList?.find(({ code }) => code === brand?.smsVendorCode) ?? ""
  return (
    <SettingDialog
      defaultValues={{
        enableSms: brand?.enableSms,
        smsSettingId: sms?.smsSettingId
      }}
      onSubmitted={() => {
        mutateBrand()
        mutateSmsList(undefined, false)
      }}
      brandId={brandId}
      dialog={dialog}
      {...props}
    />
  )
}

/*
defaultValues = { enableSms, smsSettingId  }
*/
const SettingDialog = ({
  brandId,
  defaultValues,
  onSubmitted,
  readOnly,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useSMSVerificationTrans()

  let [smsSettingId, setSmsSettingId] = useState()
  let [enableSms, setEnableSms] = useState()
  let { isLoading, result, error, mutate } = useUpdatePlatformSms(
    brandId,
    smsSettingId,
    enableSms
  )

  const onSubmit = ({ smsSettingId, enableSms }) => {
    setSmsSettingId(smsSettingId)
    setEnableSms(enableSms)
  }

  const reset = () => {
    setSmsSettingId(null)
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
      showActionButtons={readOnly ? false : true}
    >
      <FormBody brandId={brandId} readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ brandId, readOnly }) => {
  let { control } = useFormContext()

  const EnableSmsField = "enableSms"
  let enableSms = useWatch({
    control,
    name: EnableSmsField
  })
  return (
    <FieldValues>
      <SMSVerificationTrans />
      <Switch name={EnableSmsField} disabled={readOnly} />

      <SMSProviderTrans />
      <PlatformSmsSelect
        name="smsSettingId"
        brandId={brandId}
        required={enableSms}
        disabled={readOnly}
        readOnly={readOnly}
      />
    </FieldValues>
  )
}
