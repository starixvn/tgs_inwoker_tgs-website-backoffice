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
} from "./MainSetting"

export const AlertSettingDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

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
        <MainSettingDialog dialog={dialog} readOnly={!editable} />
      )}
    </>
  )
}

//TODO
const toFetchApi = (tabId) => {
  switch (tabId) {
    case MainTabId:
  }

  const fakeFetchApi = (formData) => {
    return {
      isLoading: false,
      result: formData ? true : false,
      error: null,
      mutate: () => {},
      deleteCache: () => {}
    }
  }
  return fakeFetchApi
}

//TODO: how to do form update?
const MainSettingDialog = ({ brandId, readOnly, dialog, ...props }) => {
  let title = useTrans({
    zh: "催收設置",
    en: "Alert Setting"
  })

  let tab = useTabState({
    selectedId: MainTabId
  })

  //TODO: test
  let [defaultValues, setDefaultValues] = useState({})
  // let [formData, setFormData] = useState()
  let [onSubmit, setSubmit] = useState((data) => {
    console.log("submit", data)
  })
  let [fetchResult, setFetchResult] = useState()

  // let useFetch = toFetchApi(tab.selectedId)
  // let { isLoading, result, error, mutate, deleteCache } = useFetch(formData)

  //TODO: reset fn?
  let [reset, setReset] = useState()
  /*
  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }
  */

  return (
    <FormDialog
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={fetchResult?.isLoading}
      result={fetchResult?.result}
      error={fetchResult?.error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
    >
      <Tabs>
        <TabList {...tab}>
          <MainSettingTab {...tab} />
        </TabList>
        <MainSettingPanel setDefaultValues={setDefaultValues} {...tab} />
      </Tabs>
    </FormDialog>
  )
}
