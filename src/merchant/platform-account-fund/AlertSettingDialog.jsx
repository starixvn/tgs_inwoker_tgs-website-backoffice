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

//TODO: how to do form update?
//TODO: use Tab here?
//TODO: move to MainSetting?
const MainSettingDialog = ({ brandId, readOnly, dialog, ...props }) => {
  let title = useTrans({
    zh: "催收設置",
    en: "Alert Setting"
  })

  let tab = useTabState({
    selectedId: MainTabId
  })

  return (
    <FormDialog dialog={dialog} title={title}>
      <Tabs>
        <TabList {...tab}>
          <MainSettingTab {...tab} />
        </TabList>
        <MainSettingPanel {...tab} />
      </Tabs>
    </FormDialog>
  )
}
