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
  SMSProviderCodeTrans,
  SMSProviderTrans,
  useSMSProviderTrans
} from "../../trans/Sms"
import {
  useApplyPlatformSms,
  usePlatformSms,
  useSmsList
} from "../../sms/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Modal from "../../dialog/Modal"
import { FieldValues } from "../../layout/Grid"
import Switch from "../../switch/Switch"
import { PlatformSmsSelect } from "../../sms/PlatformSmsSelect"
import { useFormContext, useWatch } from "react-hook-form"

//TODO: test case
export const SmsProviderDialogDisclosure = ({ brandId, ...props }) => {
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
        <SMSProviderTrans />
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
  } = usePlatformSms(brandId)
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

  // let sms = smsList?.find(({ code }) => code === brand?.smsVendorCode) ?? ""
  return (
    <SettingDialog
      defaultValues={{
        smsSettingId: "" //sms?.smsSettingId
      }}
      onSubmitted={() => {
        mutateBrand()
        mutateSmsList(undefined, false)
      }}
      brandId={brandId}
      smsVendorCode={brand?.smsVendorCode}
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
  smsVendorCode,
  defaultValues,
  onSubmitted,
  readOnly,
  dialog,
  dialogId,
  ...props
}) => {
  let title = useSMSProviderTrans()

  let [smsSettingId, setSmsSettingId] = useState()
  let { isLoading, result, error, mutate } = useApplyPlatformSms(
    brandId,
    smsSettingId
  )

  const onSubmit = ({ smsSettingId }) => {
    setSmsSettingId(smsSettingId)
  }

  const reset = () => {
    setSmsSettingId(null)
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
      <FormBody
        brandId={brandId}
        smsVendorCode={smsVendorCode}
        readOnly={readOnly}
      />
    </FormDialog>
  )
}

const FormBody = ({ brandId, smsVendorCode, readOnly }) => {
  return (
    <FieldStack>
      {smsVendorCode && (
        <Set orientation="horizontal">
          <SMSProviderCodeTrans /> {smsVendorCode}
        </Set>
      )}
      <PlatformSmsSelect
        name="smsSettingId"
        brandId={brandId}
        required
        disabled={readOnly}
        readOnly={readOnly}
      />
    </FieldStack>
  )
}
