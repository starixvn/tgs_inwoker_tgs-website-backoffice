import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set, Button, Link, Text } from "bumbag"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { get } from "lodash-es"
import { usePromotionBrandId } from "../usePromotionFormData"
import { nanoid } from "nanoid"
import {
  usePromotionBatchUploadPlayerList,
  useIsPromotionBatchUploadPlayerListDone
} from "../client"
import { useDropzone } from "react-dropzone"
import Input from "../../../input/Input"
import { connection } from "../../../connection"
import { useMount, useUnmount } from "react-use"
import AlertDialog from "../../../dialog/Alert"
import { PromotionUserGroupTrans } from "../../../trans/Promotion"
import { DownloadFormatFileTrans, UploadFileTrans } from "../../../trans/Action"

const FieldName = "batchId"

//TODO: require readOnly?
export const BatchUploadPlayerListField = ({}) => {
  return (
    <>
      <NormalLabel>
        <PromotionUserGroupTrans />
      </NormalLabel>
      <Box alignY="center">
        <BatchUploadField />
      </Box>
    </>
  )
}

const BatchUploadField = ({ name = FieldName }) => {
  let { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field, fieldState: { error }, formState }) => {
        let palette = error ? "danger" : "default"
        let variant = error ? "outlined" : "default"
        return (
          <BatchUploadButton name={name} palette={palette} variant={variant} />
        )
      }}
    />
  )
}

const SecondInMilliseconds = 1000

const DefaultMaxFiles = 1
const OneMBInBytes = 1048576
const DefaultMaxSize = OneMBInBytes * 10 //10MB

const confirmBatchDone = (result) => {
  if (result === true) {
    return true //done
  }

  if (result === null) {
    return true //no content
  }

  return false
}

//TODO: focus on error?
const BatchUploadButton = ({ name = FieldName, palette, variant }) => {
  let { setValue, control, getValues, clearErrors } = useFormContext()

  let brandId = usePromotionBrandId()

  let [clientId, setClientId] = useState()
  let [batchId, setBatchId] = useState()

  let [fileName, setFileName] = useState()
  let [formData, setFormData] = useState()

  let {
    result: batchStartedResult,
    isLoading: isLoadingBatchStartedResult,
    error: batchStartedResultError,
    mutate,
    deleteCache
  } = usePromotionBatchUploadPlayerList(brandId, clientId, formData)

  useEffect(() => {
    setBatchId(batchStartedResult?.data)
  }, [batchStartedResult])

  let [isBatchDone, setBatchDoneState] = useState()

  const setBatchDone = (batchId) => {
    setValue(name, batchId)
    clearErrors(name)
    setBatchDoneState(true)
  }

  let {
    result: isBatchEnded,
    isLoading: isLoadingBatchEnded,
    error: batchEndedError
  } = useIsPromotionBatchUploadPlayerListDone(!isBatchDone && batchId, {
    refreshInterval: 3 * SecondInMilliseconds
  })

  useEffect(() => {
    if (confirmBatchDone(isBatchEnded)) {
      console.log("polling setBatchDone batchId", batchId)
      setBatchDone(batchId)
    }
  }, [isBatchEnded])

  let isLoading =
    isLoadingBatchStartedResult ||
    isLoadingBatchEnded ||
    (batchStartedResult && !isBatchDone)

  const onNotify = ({ type, payload } = {}) => {
    if (
      type === "OfflinePromotion" &&
      (payload.batchId === batchId || payload.clientId === clientId)
    ) {
      console.log("onNotify setBatchDone payload", payload, "batchId", batchId)
      setBatchDone(payload.batchId)
    }
  }

  useMount(() => {
    connection?.on("notify", onNotify)
  })

  useUnmount(() => {
    connection?.off("notify", onNotify)
  })

  const reset = () => {
    setClientId(null)
    setBatchId(null)
    setFileName(null)

    setFormData(null)
    deleteCache()
    mutate(null, false)
  }

  let { getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx",
    maxFiles: DefaultMaxFiles,
    maxSize: DefaultMaxSize,
    onDrop: (files = []) => {
      let [file] = files
      if (file) {
        let id = nanoid()
        setClientId(id)
        setFileName(file.name)

        let formData = new FormData()
        formData.append("file", file, file.name)

        setFormData(formData)
      }
    }
  })

  return (
    <Set orientation="horizontal">
      <Box>
        <Button
          id="upload"
          {...getRootProps({
            refKey: "elementRef"
          })}
          isLoading={isLoading}
          disabled={isLoading}
          palette={palette}
          variant={variant}
        >
          {fileName ? fileName : <UploadFileTrans />}
          <input {...getInputProps()} />
        </Button>
      </Box>
      <Text.Block>
        <Link
          href="/api/offline/template"
          download="batch.xlsx"
          marginLeft="1rem"
        >
          <DownloadFormatFileTrans />
        </Link>
      </Text.Block>
      {batchStartedResultError && (
        <AlertDialog
          {...batchStartedResultError}
          placement="center"
          onClickClose={reset}
        />
      )}
    </Set>
  )
}
