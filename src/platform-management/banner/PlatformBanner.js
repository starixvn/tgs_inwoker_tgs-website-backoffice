import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Text, Modal, useModalState } from "bumbag"
import { Create as CreateMenu, Update as UpdateMenu } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import { useAddPlatformBanner, useUpdatePlatformBanner } from "./client"
import { Trans, useTrans } from "../../i18n"
import parseDate from "date-fns/fp/parseISO"
import { CancelText } from "../../button/ActionButtons"
import FormDialog from "../../form/FormDialog"
import Input, { InputField } from "../../input/Input"
import DateTimeInput from "../../date/DateTimeInput"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import Textarea, { TextareaField } from "../../textarea"
import ImageUploadButton from "../../file/upload/ImageUploadButton"

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
      <AddDisclosure {...dialog} />
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
  let { isLoading, result, error, mutate, deleteCache } =
    useAddPlatformBanner(formData)

  const onSubmit = (formData) => {
    setSubmit({
      brandId,
      ...formData
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "新增 Banner",
    en: "Add Banner"
  })

  return (
    <FormDialog
      id="add-banner-dialog"
      defaultValues={{
        brandId,
        subject: "",
        from: null,
        to: null,
        content: "",
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
      <FormBody />
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
  let { id } = record
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformBanner(id, formData)

  const onSubmit = (formData) => {
    setSubmit({
      brandId,
      ...formData
    })
  }

  const reset = () => {
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "修改 Banner",
    en: "Edit Banner"
  })

  return (
    <FormDialog
      id="edit-banner-dialog"
      defaultValues={{
        ...record,
        from: parseDate(record.from),
        to: parseDate(record.to)
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
      <FormBody />
    </FormDialog>
  )
}

export const FormBody = ({ readOnly = false } = {}) => {
  const { control, getValues } = useFormContext()
  let brandId = getValues("brandId")

  let minDate = useWatch({
    control,
    name: "from"
  })
  let maxDate = useWatch({
    control,
    name: "to"
  })

  let required = !readOnly
  let disabled = readOnly
  return (
    <FieldValues>
      <Label name="subject" required={required}>
        <Trans zh="主题" en="Subject" />
      </Label>
      <InputField
        name="subject"
        brandId={brandId}
        required={required}
        disabled={readOnly}
        showLocalizationAddonAfter
      />

      <Label name="from" required={required}>
        <Trans zh="开始时间" en="Start" />
      </Label>
      <Box id="from-date-box">
        <DateTimeInput
          name="from"
          maxDate={maxDate}
          required={required}
          disabled={readOnly}
        />
      </Box>

      <Label name="to" required={required}>
        <Trans zh="结束时间" en="End" />
      </Label>
      <Box id="to-date-box">
        <DateTimeInput
          name="to"
          minDate={minDate}
          required={required}
          disabled={readOnly}
        />
      </Box>

      <Label name="desktopBanner" required={required}>
        <Trans zh="Desktop Banner" en="Desktop Banner" />
      </Label>
      <Box alignY="center">
        <ImageUploadButton
          brandId={brandId}
          name="desktopBanner"
          prefix="banner"
          disabled={disabled}
          readOnly={readOnly}
        />
      </Box>

      <Label name="mobileBanner" required={required}>
        <Trans zh="Mobile Banner" en="Mobile Banner" />
      </Label>
      <Box alignY="center">
        <ImageUploadButton
          brandId={brandId}
          name="mobileBanner"
          prefix="banner"
          disabled={disabled}
          readOnly={readOnly}
        />
      </Box>

      <Label name="bannerUrl">
        <Trans zh="Banner URL" en="Banner URL" />
      </Label>
      <InputField
        name="bannerUrl"
        disabled={disabled}
        readOnly={readOnly}
        showLocalizationAddonAfter
      />

      <Label name="bannerAlt">
        <Trans zh="Banner ALT" en="Banner ALT" />
      </Label>
      <InputField
        name="bannerAlt"
        disabled={disabled}
        readOnly={readOnly}
        showLocalizationAddonAfter
      />
    </FieldValues>
  )
}
