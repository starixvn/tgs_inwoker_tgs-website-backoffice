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
import { PlatformSmsSelectField } from "../../sms/PlatformSmsSelect"
import { useFormContext, useWatch } from "react-hook-form"
import { SWRConfig } from "swr"
import { DisabledTrans } from "../../trans/Status"

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
        <SWRConfig value={{ provider: () => new Map() }}>
          <FetchDialog brandId={brandId} readOnly={readOnly} dialog={dialog} />
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

//TODO: if enableSms = false, set select disabled?
const FormBody = ({ brandId, smsVendorCode, enableSms, readOnly }) => {
  let currentSmsProvider = useCurrentSMSProviderTrans()
  let changeSmsProvider = useChangeSMSProviderTrans()
  return (
    <FieldStack>
      {smsVendorCode && <Box>{`${currentSmsProvider}: ${smsVendorCode}`}</Box>}
      {enableSms && (
        <PlatformSmsSelectField
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
