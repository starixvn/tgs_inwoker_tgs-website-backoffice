import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Icon,
  FieldStack,
  Text,
  Set,
  List,
  Box,
  Alert,
  Columns,
  Stack
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useLocale, useTrans, Locales } from "../../i18n"
import FormDialog from "../../form/FormDialog"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import {
  TabId as MainTabId,
  MainSettingTab,
  MainSettingPanel
} from "./AlertSetting.Main"
import { AutoAlertPanel, AutoAlertTab } from "./AlertSetting.Auto"
import {
  usePlatformAccountFundAlertSetting,
  useUpdatePlatformAccountFundAlertSetting
} from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"

export const AlertSettingDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  //TODO: readOnly view?
  let isDisplay = useIsDisplayMenuByRoute([View])
  let editable = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <Trans zh="催收設置" en="Alert Setting" />
      </Disclosure>
      {dialog.visible && (
        <MainSettingDialog
          brandId={brandId}
          dialog={dialog}
          readOnly={!editable}
        />
      )}
    </>
  )
}

//TODO: readOnly
const MainSettingDialog = ({ brandId, readOnly, dialog, ...props }) => {
  let title = useTrans({
    zh: "催收設置",
    en: "Alert Setting"
  })

  let tab = useTabState({
    selectedId: MainTabId
  })

  let {
    isLoading: isLoadingAlertSetting,
    data: alertSetting,
    error: alertSettingError,
    mutate: mutateAlertSetting,
    deleteCache: deleteAlertSettingCache
  } = usePlatformAccountFundAlertSetting(brandId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformAccountFundAlertSetting(brandId, formData)

  if (isLoadingAlertSetting) {
    return <LoadingBackdrop {...dialog} />
  }

  if (alertSettingError) {
    return <AlertDialog {...alertSettingError} onClickClose={dialog.hide} />
  }

  const onSubmit = (data) => {
    console.log("onSubmit", data)
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={clone(alertSetting)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={() => {
        deleteAlertSettingCache()
        mutateAlertSetting(undefined, false)

        reset()
      }}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      placement="top"
      css={css`
        min-width: 85vw;
      `}
    >
      <Tabs>
        <TabList {...tab}>
          <MainSettingTab {...tab} />
          <AutoAlertTab {...tab} />
        </TabList>
        <MainSettingPanel {...tab} />
        <AutoAlertPanel {...tab} />
      </Tabs>
    </FormDialog>
  )
}
