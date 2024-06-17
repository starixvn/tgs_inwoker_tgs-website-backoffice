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
  useChangeSMSProviderTrans,
  useCurrentSMSProviderTrans,
  useSMSProviderCodeTrans,
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
import { SWRConfig } from "swr"
import { DisabledTrans } from "../../trans/Status"

export const SmsProviderDialogDisclosure = ({
  brandId,
  id,
  dialogId = "sms-provider-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let viewAuth = useIsDisplayMenuByRoute([ViewSms])
  let editable = useIsDisplayMenuByRoute([UpdateSms])
  let readOnly = !editable
  if (!viewAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog} {...props}>
        <SMSProviderTrans />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <FetchDialog
            brandId={brandId}
            readOnly={readOnly}
            dialog={dialog}
            dialogId={dialogId}
          />
        </SWRConfig>
      )}
    </>
  )
}

const FetchDialog = ({ brandId, dialog, ...props }) => {
  let { isLoading, data: brand, error } = usePlatformSms(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} onClickClose={dialog.hide} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <SettingDialog
      defaultValues={{
        smsSettingId: ""
      }}
      brandId={brandId}
      smsVendorCode={brand?.smsVendorCode}
      enableSms={brand?.enableSms}
      dialog={dialog}
      {...props}
    />
  )
}

const SettingDialog = ({
  brandId,
  smsVendorCode,
  enableSms,
  defaultValues,
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
      onCloseErrorAlert={reset}
      dialog={dialog}
      id={dialogId}
      title={title}
      showActionButtons={readOnly || !enableSms ? false : true}
    >
      <FormBody
        brandId={brandId}
        smsVendorCode={smsVendorCode}
        enableSms={enableSms}
        readOnly={readOnly}
      />
    </FormDialog>
  )
}

const FormBody = ({ brandId, smsVendorCode, enableSms, readOnly }) => {
  let currentSmsProvider = useCurrentSMSProviderTrans()
  let changeSmsProvider = useChangeSMSProviderTrans()
  return (
    <FieldStack>
      {smsVendorCode && (
        <Box
          data-sms-code={smsVendorCode}
        >{`${currentSmsProvider}: ${smsVendorCode}`}</Box>
      )}
      {enableSms && (
        <PlatformSmsSelect
          name="smsSettingId"
          brandId={brandId}
          placeholder={changeSmsProvider}
          required
          disabled={readOnly}
          readOnly={readOnly}
        />
      )}
      {!enableSms && (
        <Alert variant="tint" title={<DisabledTrans />} type="warning" />
      )}
    </FieldStack>
  )
}
