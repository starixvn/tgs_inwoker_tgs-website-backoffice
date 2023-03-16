import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set, Button, Link, Text } from "bumbag"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import { VipLevelCheckboxGroup } from "../../vip-levels/CheckboxGroup"
import { PromotionTypeGroup, useFindPromotionType } from "../PromotionType"
import { usePromotionType } from "./edit"
import { get } from "lodash-es"
import { useBrandIdFromPromotionForm } from "./usePromotionFormData"
import { nanoid } from "nanoid"
import {
  usePromotionBatchUploadPlayerList,
  useIsPromotionBatchUploadPlayerListDone
} from "./client"
import { useDropzone } from "react-dropzone"
import Input from "../../input/Input"

const FieldName = "batchId"

//TODO: only visible when create promotion?
export const PromotionBatchUploadPlayerListFieldBox = ({
  disabled,
  readOnly
}) => {
  //
  let promotionType = usePromotionType()

  let promotionTypeSettins = useFindPromotionType(promotionType)
  let { visible = true, ...batchIdProps } =
    get(promotionTypeSettins, FieldName) ?? {}

  if (!visible) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="活动用户群" en="User Group" />
      </NormalLabel>
      <Box alignY="center">
        <BatchUploadButton />
      </Box>
    </>
  )
}

const BatchUploadButtonField = ({}) => {}

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

const BatchUploadButton = ({ name = FieldName }) => {
  let { setValue, control, getValues, clearErrors } = useFormContext()

  let brandId = useBrandIdFromPromotionForm()

  let [clientId, setClientId] = useState()
  //TODO: seems no need? save in form?
  let [batchId, setBatchId] = useState()

  let [formData, setFormData] = useState()

  let {
    result: batchStartedResult,
    isLoading: isLoadingBatchStartedResult,
    error: batchStartedResultError,
    mutate,
    deleteCache
  } = usePromotionBatchUploadPlayerList(brandId, clientId, formData)

  useEffect(() => {
    console.log("batchStartedResult", batchStartedResult)
    setBatchId(batchStartedResult?.data)
  }, [batchStartedResult])

  let [isBatchDone, setBatchDone] = useState()

  let {
    result: isBatchEnded,
    isLoading: isLoadingBatchEnded,
    error: batchEndedError
  } = useIsPromotionBatchUploadPlayerListDone(!isBatchDone && batchId, {
    refreshInterval: 3 * SecondInMilliseconds
  })

  useEffect(() => {
    if (confirmBatchDone(isBatchEnded)) {
      setValue(name, batchId)
      setBatchDone(true)
    }
  }, [isBatchEnded])

  //TODO: loading effect? loading modal?
  let isLoading =
    isLoadingBatchStartedResult ||
    isLoadingBatchEnded ||
    (batchStartedResult && !isBatchDone)

  //TODO: when?
  const reset = () => {
    setClientId(null)
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

        let formData = new FormData()
        formData.append("file", file, file.name)

        setFormData(formData)
      }
    }
  })

  //TODO: error dialog
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
        >
          <Trans zh="上传文件" en="Upload file" />
          <input {...getInputProps()} />
        </Button>
        <Input type="hidden" name={name} value={batchId} />
      </Box>
      <Text.Block>
        <Link
          href="/api/offline/template"
          download="batch.xlsx"
          marginLeft="1rem"
        >
          <Trans zh="下载文件格式" en="Download Format File" />
        </Link>
      </Text.Block>
    </Set>
  )
}
