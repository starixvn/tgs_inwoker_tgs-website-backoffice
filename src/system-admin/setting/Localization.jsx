import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  Spinner,
  Alert,
  DropdownMenu
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update } from "./menu"
import { Trans, useLocale, useTrans } from "../../i18n"
import { useDropzone } from "react-dropzone"
import { useUploadLocalization } from "./client"
import AlertDialog from "../../dialog/Alert"

export const LocalizationDropdownMenu = () => {
  let dialog = useModalState()
  let [systemCode, setSystemCode] = useState()

  let viewable = useIsDisplayMenuByRoute([View])
  let editable = useIsDisplayMenuByRoute([Update])
  if (!viewable) {
    return null
  }

  return (
    <>
      <DropdownMenu
        menu={
          <>
            <DropdownMenu.Item
              id="download-op-api-localization"
              use="a"
              href={`/api/localization/export/OP-API`}
              download={`OP-API-localization.xlsx`}
            >
              <Trans zh="汇出 OP-API" en="Export OP-API" />
            </DropdownMenu.Item>
            {editable && (
              <DropdownMenu.Item
                id="upload-OP-API-dialog-disclosure"
                onClick={() => {
                  setSystemCode("OP-API")
                  dialog.show()
                }}
              >
                <Trans zh="上传 OP-API" en="Upload OP-API" />
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item
              id="download-agent-api-localization"
              use="a"
              href={`/api/localization/export/AGENT-API`}
              download={`AGENT-API-localization.xlsx`}
            >
              <Trans zh="汇出 AGENT-API" en="Export AGENT-API" />
            </DropdownMenu.Item>
            {editable && (
              <DropdownMenu.Item
                id="upload-AGENT-API-dialog-disclosure"
                onClick={() => {
                  setSystemCode("AGENT-API")
                  dialog.show()
                }}
              >
                <Trans zh="上传 AGENT-API" en="Upload AGENT-API" />
              </DropdownMenu.Item>
            )}
          </>
        }
      >
        <Button iconAfter="chevron-down">
          <Trans zh="多语系" en="Localization" />
        </Button>
      </DropdownMenu>
      {dialog.visible && (
        <UploadDialog systemCode={systemCode} dialog={dialog} />
      )}
    </>
  )
}

const UploadDialog = ({ systemCode, dialog }) => {
  let title = useTrans({
    zh: "上传",
    en: "Upload"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache, mutate } = useUploadLocalization(
    systemCode,
    formData
  )

  useEffect(() => {
    if (result && !error) {
      dialog.hide()
    }
  }, [result, error])

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    maxFiles: 1,
    accept: ".xlsx",
    onDrop: (files) => {
      if (files.length > 0) {
        let [file] = files
        let formData = new FormData()
        formData.append("file", file, file.name)
        setSubmit(formData)
      }
    }
  })

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }
  let notSelectFile = !formData

  return (
    <>
      <Dialog.Modal
        id="upload-localization-dialog"
        {...dialog}
        title={title}
        showCloseButton
        hideOnClickOutside={false}
      >
        {notSelectFile && (
          <Card
            title={systemCode}
            {...getRootProps({
              id: "file-upload-dropzone",
              refKey: "elementRef "
            })}
          >
            <input {...getInputProps()} />
            <p>
              <Trans zh="选择档案" en="Select File" />
            </p>
          </Card>
        )}
        {isLoading && (
          <Card alignX="center">
            <Spinner />
          </Card>
        )}
      </Dialog.Modal>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
