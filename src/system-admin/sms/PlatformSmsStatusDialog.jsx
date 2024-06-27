import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  FieldStack,
  Set,
  Dialog,
  Box,
  Level,
  FieldWrapper,
  Stack
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
import Switch, { SwitchField } from "../../switch/Switch"
import { usePlatformSms, useUpdatePlatformSmsSettings } from "../../sms/client"
import { StatusTrans } from "../../trans/Status"
import { PlatformSmsSelect } from "../../sms/PlatformSmsSelect"
import {
  useChangeSMSProviderTrans,
  useCurrentSMSProviderTrans
} from "../../trans/Sms"
import { SWRConfig } from "swr"

export const PlatformSmsStatusDialogDisclosure = ({
  brandId,
  id,
  dialogId = "platform-sms-dialog"
}) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <Trans en="Platform SMS Status" zh="平台简讯状态" />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <FetchDialog brandId={brandId} dialog={dialog} dialogId={dialogId} />
        </SWRConfig>
      )}
    </>
  )
}

const PlatformSmsStatus = {
  en: "Platform SMS Status",
  zh: "平台简讯状态"
}
export const PlatformSmsStatusTrans = () => <Trans {...PlatformSmsStatus} />
export const usePlatformSmsStatusTrans = () => useTrans(PlatformSmsStatus)

const FetchDialog = ({ brandId, dialog, ...props }) => {
  let { isLoading, data: brand, error } = usePlatformSms(brandId)

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
        enableSms: brand?.enableSms,
        smsSettingId: ""
      }}
      smsVendorCode={brand?.smsVendorCode}
      dialog={dialog}
      {...props}
    />
  )
}

const StatusFormDialog = ({
  brandId,
  defaultValues,
  smsVendorCode,
  dialog,
  dialogId
}) => {
  let title = usePlatformSmsStatusTrans()
  let [enableSms, setEnableSms] = useState()
  let [smsSettingId, setSmsSettingId] = useState()
  let { isLoading, result, error, mutate } = useUpdatePlatformSmsSettings(
    brandId,
    enableSms,
    smsSettingId
  )

  const onSubmit = ({ enableSms, smsSettingId }) => {
    setEnableSms(enableSms)
    setSmsSettingId(smsSettingId)
  }

  const reset = () => {
    setEnableSms(null)
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
      onCloseErrorAlert={reset}
      dialog={dialog}
      id={dialogId}
      title={title}
    >
      <FormBody brandId={brandId} smsVendorCode={smsVendorCode} />
    </FormDialog>
  )
}

const FormBody = ({ brandId, smsVendorCode }) => {
  let { control } = useFormContext()
  let currentSmsProvider = useCurrentSMSProviderTrans()
  let changeSmsProviderPlaceholder = useChangeSMSProviderTrans()

  const EnableSmsField = "enableSms"
  let enableSms = useWatch({
    control,
    name: EnableSmsField
  })
  return (
    <Stack>
      <SwitchField name={EnableSmsField} label={<StatusTrans />} />
      {enableSms && (
        <FieldWrapper
          label={smsVendorCode && `${currentSmsProvider}: ${smsVendorCode}`}
        >
          <PlatformSmsSelect
            name="smsSettingId"
            brandId={brandId}
            placeholder={changeSmsProviderPlaceholder}
            required
          />
        </FieldWrapper>
      )}
    </Stack>
  )
}
