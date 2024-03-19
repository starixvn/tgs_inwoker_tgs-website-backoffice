import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Text, Modal, useModalState, Set } from "bumbag"
import { Create as CreateMenu, Update as UpdateMenu, View } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import {
  useAddPlatformBanner,
  usePlatformBanner,
  useUpdatePlatformBanner
} from "./client"
import { Trans, useTrans } from "../../i18n"
import { parseISO } from "date-fns"
import { CancelText } from "../../button/ActionButtons"
import FormDialog from "../../form/FormDialog"
import Input, { InputField } from "../../input/Input"
import DateTimeInput from "../../date/DateTimeInput"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { ImageLocalizationDialogDisclosure } from "../../file/upload/ImageUploadButton"
import Checkbox from "../../checkbox"
import { LocalizationDialogDisclosure } from "../../dialog/LocalizationDialog"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { clone } from "lodash-es"
import { isValidDate } from "../../date/isValidDate"
import {
  RecommendedSize1920X600Trans,
  RecommendedSize750X310Trans,
  SubjectTrans
} from "../../trans/Field"
import { EndTimeTrans, StartTimeTrans } from "../../trans/Date"
import { useAddTrans, useEditTrans, useViewTrans } from "../../trans/Action"

export const AddPlatformBannerDisclosure = ({
  brandId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([CreateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const AddDialog = ({ brandId, onSubmitted, dialog, ...props }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useAddPlatformBanner(
    brandId,
    formData
  )

  const onSubmit = (formData) => {
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useAddTrans()

  return (
    <FormDialog
      id="add-banner-dialog"
      defaultValues={{
        brandId,
        title: "",
        beginTime: null,
        endTime: null,
        localization: {}
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      placement="top"
    >
      <FormBody marginLeft="1rem" paddingBottom="1rem" />
    </FormDialog>
  )
}

export const EditPlatformBannerDisclosure = ({
  brandId,
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <EditDialog
          brandId={brandId}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const EditDialog = ({ brandId, record, onSubmitted, dialog, ...props }) => {
  let { id: bannerId } = record

  let {
    isLoading: isLoadingBanner,
    data: banner,
    error: bannerError
  } = usePlatformBanner(brandId, bannerId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformBanner(brandId, bannerId, formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    mutate(undefined, false)
    deleteCache()
    setSubmit(undefined)
  }

  let title = useEditTrans()

  if (isLoadingBanner) {
    return <LoadingBackdrop {...dialog} />
  }

  if (bannerError) {
    return <AlertDialog {...bannerError} onClickClose={dialog.hide} />
  }

  return (
    <FormDialog
      id="edit-banner-dialog"
      defaultValues={{
        ...clone(banner),
        beginTime: parseISO(record.beginTime),
        endTime: parseISO(record.endTime),
        permanent: !record.endTime
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      placement="top"
    >
      <FormBody marginLeft="1rem" paddingBottom="1rem" />
    </FormDialog>
  )
}

export const ViewPlatformBannerDisclosure = ({ brandId, record, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <ViewDialog brandId={brandId} record={record} dialog={dialog} />
      )}
    </>
  )
}

const ViewDialog = ({ brandId, record, dialog, ...props }) => {
  let { id: bannerId } = record

  let { isLoading, data: banner, error } = usePlatformBanner(brandId, bannerId)

  let title = useViewTrans()

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <FormDialog
      id="view-banner-dialog"
      defaultValues={{
        ...clone(banner),
        beginTime: parseISO(record.beginTime),
        endTime: parseISO(record.endTime),
        permanent: !record.endTime
      }}
      isLoading={isLoading}
      title={title}
      dialog={dialog}
      placement="top"
      showActionButtons={false}
      footer={
        <Box alignX="right" width="100%">
          <Button onClick={dialog.hide}>
            <CancelText />
          </Button>
        </Box>
      }
    >
      <FormBody marginLeft="1rem" paddingBottom="1rem" readOnly />
    </FormDialog>
  )
}

export const FormBody = ({ readOnly = false, ...props } = {}) => {
  const { control, getValues, setValue } = useFormContext()
  let brandId = getValues("brandId")

  let now = new Date()
  let BeginTimeFieldName = "beginTime"
  let minDate = useWatch({
    control,
    name: BeginTimeFieldName
  })

  let EndTimeFieldName = "endTime"
  let maxDate = useWatch({
    control,
    name: EndTimeFieldName
  })

  let PermanentFieldName = "permanent"
  let isPermanent = useWatch({
    control,
    name: PermanentFieldName
  })

  useEffect(() => {
    if (isPermanent) {
      setValue(EndTimeFieldName, "")
    }
  }, [isPermanent])

  let required = !readOnly
  let disabled = readOnly
  return (
    <FieldValues {...props}>
      <Label name="subject" required={required}>
        <SubjectTrans />
      </Label>
      <InputField
        name="title"
        brandId={brandId}
        required={required}
        disabled={readOnly}
        showLocalizationAddonAfter
      />

      <Label name="from" required={required}>
        <StartTimeTrans />
      </Label>
      <Box id="from-date-box">
        <DateTimeInput
          name={BeginTimeFieldName}
          minDate={isValidDate(maxDate) ? undefined : now}
          maxDate={maxDate}
          required={required}
          disabled={readOnly}
        />
      </Box>

      <Label name="to" required={required}>
        <EndTimeTrans />
      </Label>
      <Box id="to-date-box">
        <Set orientation="horizontal">
          <DateTimeInput
            name={EndTimeFieldName}
            minDate={minDate ?? now}
            required={!isPermanent}
            disabled={isPermanent || readOnly}
          />
          <Checkbox
            name="permanent"
            label={<Trans zh="永久" en="Permanent" />}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </Set>
      </Box>

      <Label name="desktopBanner" required={required}>
        <Trans zh="Desktop Banner" en="Desktop Banner" />
      </Label>
      <Set orientation="vertical" alignY="center">
        <ImageLocalizationDialogDisclosure
          brandId={brandId}
          name="desktopBannerUrl"
          prefix="banner"
          disabled={disabled}
          readOnly={readOnly}
        />
        <Text.Block color="warning" fontWeight="bold" fontSize="150">
          <RecommendedSize1920X600Trans />
        </Text.Block>
      </Set>

      <Label name="mobileBanner" required={required}>
        <Trans zh="Mobile Banner" en="Mobile Banner" />
      </Label>
      <Set orientation="vertical" alignY="center">
        <ImageLocalizationDialogDisclosure
          brandId={brandId}
          name="mobileBannerUrl"
          prefix="banner"
          disabled={disabled}
          readOnly={readOnly}
        />
        <Text.Block color="warning" fontWeight="bold" fontSize="150">
          <RecommendedSize750X310Trans />
        </Text.Block>
      </Set>

      <Label name="bannerUrl">
        <Trans zh="Banner URL" en="Banner URL" />
      </Label>
      <LocalizationDialogDisclosure
        name="navigateUrl"
        brandId={brandId}
        readOnly={readOnly}
        disabled={disabled}
      />

      <Label name="bannerAlt">
        <Trans zh="Banner ALT" en="Banner ALT" />
      </Label>
      <LocalizationDialogDisclosure
        name="pictureAlt"
        brandId={brandId}
        readOnly={readOnly}
        disabled={disabled}
      />
    </FieldValues>
  )
}
