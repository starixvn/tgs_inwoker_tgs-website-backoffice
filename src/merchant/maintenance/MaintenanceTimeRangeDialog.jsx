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
  Heading
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { useFormContext, useWatch } from "react-hook-form"
import head from "../../list/head"
import Backdrop from "../../dialog/Backdrop"
import { TimeSelectField } from "../../date/TimeSelect"
import { formatHourMinute } from "../../date/format"
import { useUpdateMaintenance } from "./client"
import { useBrandList } from "../platforms/client"

export const MaintenanceTimeRangeDialogDisclosure = ({
  brandId,
  brandName,
  beginTime,
  endTime,
  useFetch,
  onSubmitted,
  dialogId,
  ...props
}) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <Disclosure id={`${dialogId}-disclosure`} {...dialog} {...props}>
        <Trans zh="维护时间" en="Maintenance Time" />
      </Disclosure>
      {dialog.visible && (
        <TimeRangeDialog
          brandId={brandId}
          brandName={brandName}
          beginTime={beginTime}
          endTime={endTime}
          useFetch={useFetch}
          onSubmitted={onSubmitted}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const TimeRangeDialog = ({
  brandId,
  brandName,
  beginTime = "",
  endTime = "",
  dialog,
  useFetch,
  onSubmitted,
  dialogId,
  ...props
}) => {
  let title = useTrans({
    zh: "维护时间",
    en: "Maintenance Time"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useFetch(formData)

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{
        brandId,
        beginTime,
        endTime
      }}
      onSubmit={({ beginTime, endTime, ...rest }) => {
        let data = {
          ...rest,
          beginTime: formatHourMinute(beginTime),
          endTime: formatHourMinute(endTime)
        }
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
      title={title}
      dialog={dialog}
      id={dialogId}
      {...props}
    >
      <FormBody brandName={brandName} />
    </FormDialog>
  )
}

const FormBody = ({ brandName }) => {
  let { control } = useFormContext()
  let BeginTimeField = "beginTime"
  let beginTime = useWatch({
    control,
    name: BeginTimeField
  })

  let startLabel = useTrans({
    zh: "开始",
    en: "Start"
  })

  let EndTimeField = "endTime"
  let endTime = useWatch({
    control,
    name: EndTimeField
  })
  let endLabel = useTrans({
    zh: "结束",
    en: "End"
  })

  return (
    <FieldStack orientation="vertical" margin="0.5rem">
      {brandName && (
        <Box borderColor="primary" fontWeight="bold">
          <Trans zh="平台：" en="Platform：" /> {brandName}
        </Box>
      )}
      <FieldStack orientation="horizontal">
        <TimeSelectField
          name={BeginTimeField}
          max={endTime}
          label={startLabel}
          required
        />
        <TimeSelectField
          name={EndTimeField}
          min={beginTime}
          label={endLabel}
          required
        />
      </FieldStack>
    </FieldStack>
  )
}
