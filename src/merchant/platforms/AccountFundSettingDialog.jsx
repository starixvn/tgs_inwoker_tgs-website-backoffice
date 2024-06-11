import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Button, Set } from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update } from "./menu"
import { AccountFundsTrans, useAccountFundsTrans } from "../../trans/Platform"
import {
  usePlatformAccountFundSetting,
  useUpdatePlatformAccountFundSetting
} from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Switch from "../../switch/Switch"
import { SWRConfig } from "swr"

export const AccountFundSettingDialogDisclosure = ({
  brandId,
  id,
  dialogId = "account-fund-setting-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  let editable = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)

  return (
    <>
      <Disclosure id={id} {...dialog}>
        <AccountFundsTrans />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <SettingDialog
            brandId={brandId}
            dialog={dialog}
            dialogId={dialogId}
            readOnly={!editable}
          />
        </SWRConfig>
      )}
    </>
  )
}

const SettingDialog = ({ brandId, readOnly, dialog, dialogId, ...props }) => {
  let title = useAccountFundsTrans()

  let {
    isLoading: isLoadingSetting,
    data: setting,
    error: settingError,
    mutate: mutateSetting,
    deleteCache: deleteSettingCache
  } = usePlatformAccountFundSetting(brandId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformAccountFundSetting(brandId, formData)

  if (isLoadingSetting) {
    return <LoadingBackdrop {...dialog} />
  }

  if (settingError) {
    return <AlertDialog {...settingError} onClickClose={dialog.hide} />
  }

  const onSubmit = ({ setting }) => {
    setSubmit(setting)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      id={dialogId}
      defaultValues={{
        setting
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={() => {
        deleteSettingCache()
        mutateSetting(undefined, false)

        reset()
      }}
      onCloseErrorAlert={reset}
      title={title}
      dialog={dialog}
      showActionButtons={readOnly ? false : true}
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ readOnly }) => {
  return (
    <Set orientation="horizontal">
      <AccountFundsTrans />
      <Switch name="setting" disabled={readOnly} />
    </Set>
  )
}
