import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set, Link, Group, Button, Icon } from "bumbag"
import { Trans } from "../../i18n"
import { LocalizationDialogDisclosure } from "../../dialog/LocalizationDialog"
import { StaticButton } from "../../button/StaticButton"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import {
  PlayerIdentityStateLabel,
  isPlayerIdentityWaitingVerify
} from "./PlayerIdentityState"
import { useDropzone } from "react-dropzone"
import { useUploadPlayerIdentityAttachment } from "./client"
import AlertDialog from "../../dialog/Alert"

export const PlayerIdentityAttachment = ({
  brandId,
  attachmentId,
  playerCode,
  status,
  onUploaded,
  ...props
}) => {
  let waitingVerify = isPlayerIdentityWaitingVerify(status)

  let attachmentUrl = attachmentId ? `/api/fs/${attachmentId}` : ""
  return (
    <Set {...props}>
      {attachmentUrl ? (
        <Link href={attachmentUrl} target="_blank">
          <Trans zh="连结" en="Link" />
        </Link>
      ) : waitingVerify ? (
        ""
      ) : (
        "-"
      )}
      {waitingVerify && (
        <UploadButton
          brandId={brandId}
          playerCode={playerCode}
          onUploaded={onUploaded}
        />
      )}
    </Set>
  )
}

const DefaultMaxFiles = 1

const OneMBInBytes = 1048576
const DefaultMaxSize = OneMBInBytes * 10 //10MB

const DefaultAccept = "image/jpeg, image/png"

const UploadButton = ({
  brandId,
  playerCode,
  disabled,
  onUploaded,
  ...props
}) => {
  let [formData, setSubmit] = useState()

  let { getRootProps, getInputProps } = useDropzone({
    accept: DefaultAccept,
    maxFiles: DefaultMaxFiles,
    disabled,
    maxSize: DefaultMaxSize,
    onDrop: (files = []) => {
      let [file] = files
      if (file) {
        let formData = new FormData()
        formData.append("file", file, file.name)

        setSubmit(formData)
      }
    }
  })

  let { isLoading, result, error, mutate, deleteCache } =
    useUploadPlayerIdentityAttachment(brandId, playerCode, formData)

  useEffect(() => {
    console.log("result", result)
    if (result) {
      onUploaded?.()
    }
  }, [result])

  return (
    <Button
      isLoading={isLoading}
      disabled={disabled}
      {...getRootProps({
        disabled,
        refKey: "elementRef"
      })}
      {...props}
    >
      <Trans zh="重新上传" en="Re-upload" />
      <input {...getInputProps()} />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Button>
  )
}
