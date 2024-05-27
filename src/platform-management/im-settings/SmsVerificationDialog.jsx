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
import { View, Update } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import {
  SMSProviderTrans,
  SMSVerificationTrans,
  useSMSVerificationTrans
} from "../../trans/Sms"
import {
  useApplyPlatformSms,
  usePlatformSmsList,
  useSmsList
} from "../../sms/client"
import { useBrand } from "../../merchant/platforms/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Modal from "../../dialog/Modal"
import { FieldValues } from "../../layout/Grid"
import Switch from "../../switch/Switch"
import { PlatformSmsSelect } from "../../sms/PlatformSmsSelect"

//TODO: id & dialogId
export const SmsVerificationDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  /*
  TODO: check auth requirement
  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }
  */
  return (
    <>
      <Disclosure {...dialog} {...props}>
        <SMSVerificationTrans />
      </Disclosure>
      {dialog.visible && <FetchDialog brandId={brandId} dialog={dialog} />}
    </>
  )
}

//TODO: useBrand api
const FetchDialog = ({ brandId, dialog, ...props }) => {
  //TODO: get sms code & enableSms from brand data
  //TODO: sms code -> smsSettingId
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

  let smsSettingId =
    smsList?.find(({ code }) => code === brand?.smsVendorCode) ?? ""
  return (
    <SettingDialog
      defaultValues={{
        enableSms: brand?.enableSms,
        smsSettingId
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
  dialog,
  dialogId,
  ...props
}) => {
  let title = useSMSVerificationTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useApplyPlatformSms(
    brandId,
    formData
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    setSubmit(null)
    mutate(undefined, false)
  }

  console.log("defaultValues", defaultValues)
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
      <FormBody brandId={brandId} />
    </FormDialog>
  )
}

const FormBody = ({ brandId }) => {
  return (
    <FieldValues>
      <SMSVerificationTrans />
      <Switch name="enableSms" />

      <SMSProviderTrans />
      <PlatformSmsSelect brandId={brandId} />
    </FieldValues>
  )
}
