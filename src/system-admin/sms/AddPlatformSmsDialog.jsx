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
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { useAddPlatformSms, useDeleteSms, useSmsList } from "../../sms/client"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import FormDialog from "../../form/FormDialog"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import { SmsSelect } from "../../sms/SmsSelect"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { PlatformTrans } from "../../trans/Platform"

export const AddPlatformSmsDialog = ({
  brandId,
  onSubmitted,
  id,
  dialogId = "add-platform-sms-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let hasAuth = useIsDisplayMenuByRoute([Update])
  if (!hasAuth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)

  return (
    <>
      <Disclosure {...dialog}>
        <PlatformSmsSettingTrans />
      </Disclosure>
      {dialog.visible && (
        <AddDialog brandId={brandId} dialog={dialog} dialogId={dialogId} />
      )}
    </>
  )
}

const PlatformSmsSetting = {
  zh: "設定簡訊商平台",
  en: "Platform SMS Setting"
}
const PlatformSmsSettingTrans = () => <Trans {...PlatformSmsSetting} />
const usePlatformSmsSettingTrans = () => useTrans(PlatformSmsSetting)

const AddDialog = ({ brandId, dialog, dialogId, onSubmitted }) => {
  let title = usePlatformSmsSettingTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useAddPlatformSms(
    formData?.brandId,
    formData?.smsSettingId
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    setSubmit(null)
    mutate(undefined, false)
  }

  return (
    <FormDialog
      defaultValues={{
        brandId
      }}
      onSubmit={onSubmit}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      id={dialogId}
      title={title}
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({}) => {
  return (
    <FieldStack>
      <FieldWrapper label={<PlatformTrans />}>
        <MerchantIdSelect
          resellerProps={{ required: false }}
          licenseeProps={{ required: false }}
          brandProps={{
            required: true
          }}
        />
      </FieldWrapper>
      <FieldWrapper label={<Trans zh="簡訊商名稱" en="SMS Provider Name" />}>
        <SmsSelect required />
      </FieldWrapper>
    </FieldStack>
  )
}
