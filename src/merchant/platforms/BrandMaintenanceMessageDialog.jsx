import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Spinner,
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { useBrandLogo, useUpdateBrandLogo } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { useFormContext, useWatch } from "react-hook-form"
import { Tabs, Tab, TabPanel, TabList, useTabState } from "../../tab"
import head from "../../list/head"
import { HtmlEditor } from "../../text/editor/HtmlEditor"
import { useBrandLanguageCodes } from "../../dialog/LocalizationDialog"
import Backdrop from "../../dialog/Backdrop"

export const BrandMaintenanceMessageDialogDisclosure = ({
  brandId,
  ...props
}) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  let readOnly = !editable

  let readable = useIsDisplayMenuByRoute([View])
  if (!readable) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="Maintenance" en="Maintenance" />
      </Disclosure>
      {dialog.visible && (
        <InitBrandMaintenanceDialog brandId={brandId} dialog={dialog} />
      )}
    </>
  )
}

//TODO
export const ViewBrandMaintenanceMessageDialogDisclosure = ({}) => {}

//TODO
export const EditBrandMaintenanceMessageDialogDisclosure = ({}) => {}

const InitBrandMaintenanceDialog = ({ brandId, dialog, ...props }) => {
  //TODO: fetch record by brandId
  //TODO: onSubmitted > reset
  let defaultValues = {}

  let {
    isLoading,
    data: languageCodes,
    error,
    mutate,
    deleteCache
  } = useBrandLanguageCodes(brandId)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.close} />
  }

  return (
    <BrandMaintenanceDialog
      defaultValues={defaultValues}
      languageCodes={languageCodes}
      dialog={dialog}
    />
  )
}

const BrandMaintenanceDialog = ({
  defaultValues,
  languageCodes = [],
  readOnly,
  useUpdate,
  onSubmitted,
  dialog
}) => {
  let title = useTrans({
    zh: "维护公告",
    en: "Maintenance Announcement"
  })
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useUpdate?.(formData) ?? {}

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  let selectedId = head(languageCodes)

  let tab = useTabState({
    selectedId
  })

  //TODO: need backdrop?
  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={defaultValues}
        onSubmit={(data) => {
          console.log("onSubmit", data)
          setSubmit(data)
        }}
        isLoading={isLoading}
        result={result}
        error={error}
        onCloseErrorAlert={reset}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        dialog={dialog}
        title={title}
        showActionButtons={readOnly ? false : true}
        footer={
          readOnly ? <CloseButtonFooter alignX="right" dialog={dialog} /> : null
        }
        width="70vw"
        maxWidth="80vw"
        css={css`
          & .bb-DialogContent {
            height: 85vh;
            max-height: 85vh;
          }
        `}
      >
        <Tabs isFitted>
          <TabList use={TabList} {...tab}>
            {languageCodes.map((code) => (
              <Tab key={code} tabId={code} {...tab}>
                {code}
              </Tab>
            ))}
          </TabList>
          {languageCodes.map((code, index) => (
            <HtmlEditorTabPanel
              key={code}
              languageCode={code}
              readOnly={readOnly}
              {...tab}
            />
          ))}
        </Tabs>
      </FormDialog>
    </Backdrop>
  )
}

const HtmlEditorTabPanel = ({ languageCode, readOnly, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === languageCode

  return (
    <TabPanel tabId={languageCode} {...props} height="100%">
      {isActive && (
        <HtmlEditor
          name={languageCode}
          readOnly={readOnly}
          width="100%"
          height="480"
          {...props}
        />
      )}
    </TabPanel>
  )
}
