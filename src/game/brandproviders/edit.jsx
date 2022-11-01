import React, { useState, useEffect, useMemo } from "react"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import {
  css,
  Stack,
  Heading,
  Box,
  Button,
  Text,
  useModalState,
  Set,
  Flex
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update as UpdateMenu } from "./menu"
import { EditDisclosure } from "../../dialog/Disclosure"
import { ConfirmButtonFooter } from "../../form/ConfirmButtonFooter"
import { useUpdateBrandGameProvider } from "./client"
import { Trans, useTrans } from "../../i18n"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { WeekDaySelect } from "../../date/week"
import { formatHourMinute } from "../../date/format"
import { TimeSelectField } from "../../date/TimeSelect"
import FormDialog from "../../form/FormDialog"
import { parseISO } from "date-fns"
import { MaintenanceStatusToggleButton } from "./ScheduleStatus"

export const EditButton = ({ record, onSubmitted, ...props }) => {
  let dialog = useModalState()
  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} />
      {dialog.visible && (
        <EditDialog record={record} onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const EditDialog = ({ record, dialog, ...props }) => {
  let [submitData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useUpdateBrandGameProvider(record?.id, submitData)

  const onSubmit = (formData) => {
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "编辑",
    en: "Edit"
  })

  let from = formatHourMinute(parseISO(record.from))
  let to = formatHourMinute(parseISO(record.to))

  return (
    <FormDialog
      defaultValues={{
        ...record,
        from,
        to
      }}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        props?.onSubmitted()
      }}
      title={title}
      showCloseButton
      showActionButtons={false}
      dialog={dialog}
      footer={
        <ConfirmButtonFooter isLoading={isLoading} disabled={isLoading} />
      }
      maxWidth="unset"
    >
      <EditBody record={record} />
    </FormDialog>
  )
}

const EditBody = ({ record = {} }) => {
  let { gameProviderName } = record
  let { control } = useFormContext()

  const FromFieldName = "from"
  let from = useWatch({
    control,
    name: FromFieldName
  })

  const ToFieldName = "to"
  let to = useWatch({
    control,
    name: ToFieldName
  })

  return (
    <Stack orientation="vertical" width="500px">
      <Heading use="h5">
        <Trans zh="基本资料" en="Basic Information" />
      </Heading>
      <FieldValues>
        <Label>
          <Trans zh="厂商" en="Vendor" />
        </Label>
        <ValueBlock>{gameProviderName}</ValueBlock>
      </FieldValues>

      <Heading use="h5">
        <Trans zh="定期维护" en="Periodic Maintenance" />
      </Heading>
      <FieldValues>
        <Label>
          <Trans zh="状态" en="Status" />
        </Label>
        <Box>
          <MaintenanceStatusToggleButton name="scheduleStatus" required />
        </Box>

        <Label>
          <Trans zh="每周" en="Weekly" />
        </Label>
        <Box>
          <WeekDaySelect name="dayOfWeek" required />
        </Box>

        <Label>
          <Trans zh="开始时间" en="Start Time" />
        </Label>
        <Flex alignY="top" justifyContent="space-between">
          <TimeSelectField name={FromFieldName} required max={to} />
          <Set orientation="horizontal">
            <Label marginRight="major-2">
              <Trans zh="结束时间" en="End Time" />
            </Label>
            <TimeSelectField name={ToFieldName} required min={from} />
          </Set>
        </Flex>
      </FieldValues>
    </Stack>
  )
}

const ValueBlock = ({ children, ...props }) => (
  <Text.Block alignY="center" {...props}>
    {children}
  </Text.Block>
)
