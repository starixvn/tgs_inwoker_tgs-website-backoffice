import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Text, Modal, useModalState } from "bumbag"
import { Verify } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { Disclosure, VerifyDisclosure } from "../../dialog/Disclosure"
import { useVerifyPlatformBanner, usePlatformBanner } from "./client"
import { Trans, useTrans } from "../../i18n"
import parseDate from "date-fns/fp/parseISO"
import { CancelText } from "../../button/ActionButtons"
import FormDialog from "../../form/FormDialog"
import Input, { InputField } from "../../input/Input"
import DateTimeInput from "../../date/DateTimeInput"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import Textarea, { TextareaField } from "../../textarea"
import ImageUploadButton from "../../file/upload/ImageUploadButton"
import { FormBody } from "./PlatformBanner"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { clone } from "lodash"

export const VerifyPlatformBannerDisclosure = ({
  brandId,
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Verify])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <VerifyDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <VerifyDialog
          brandId={brandId}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const VerifyDialog = ({ brandId, record, onSubmitted, dialog, ...props }) => {
  let {
    isLoading: isLoadingBanner,
    data: banner = {},
    error: bannerError
  } = usePlatformBanner(brandId, record?.id)

  let defaultValues = {
    ...clone(banner),
    beginTime: parseDate(record.beginTime),
    endTime: record.endTime && parseDate(record.endTime),
    permanent: !record.endTime,
    remarks: ""
  }

  if (isLoadingBanner) {
    return <LoadingBackdrop {...dialog} />
  }

  if (bannerError) {
    return <AlertDialog {...bannerError} onClickClose={dialog.hide} />
  }

  return (
    <EditVerifyDialog
      brandId={brandId}
      record={record}
      defaultValues={defaultValues}
      onSubmitted={onSubmitted}
      dialog={dialog}
    />
  )
}

const EditVerifyDialog = ({
  brandId,
  record,
  defaultValues,
  onSubmitted,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "审核 Banner",
    en: "Verify Banner"
  })

  let formMethods = useForm({ defaultValues })

  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyPlatformBanner(brandId, record?.id, formData)

  const onSubmit = ({ remarks, reviewState }) => {
    let data = {
      remarks,
      reviewState
    }
    setSubmit(data)
  }

  const reset = () => {
    setSubmit(null)
  }

  return (
    <FormDialog
      id="verify-banner-dialog"
      formMethods={formMethods}
      onSubmit={onSubmit}
      actionButtonsProps={{
        submitProps: {
          "data-type": "approve"
        }
      }}
      onClickSubmit={(event) => {
        formMethods.setValue("reviewState", "approve")
      }}
      addonButtons={
        <Button
          type="submit"
          data-type="reject"
          onClick={() => {
            formMethods.setValue("reviewState", "reject")
          }}
          palette="danger"
          variant="outlined"
        >
          <Trans zh="拒绝" en="Reject" />
        </Button>
      }
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      placement="top"
      dialog={dialog}
    >
      <VerifyBody />
    </FormDialog>
  )
}

export const ViewVerifyPlatformBannerDisclosure = ({
  brandId,
  record,
  dialog,
  ...props
}) => {
  let beginTime = parseDate(record.beginTime)
  let endTime = parseDate(record.endTime)

  let title = useTrans({
    zh: "查看 Banner",
    en: "View Banner"
  })

  return (
    <FormDialog
      id="view-banner-dialog"
      defaultValues={{
        ...record,
        beginTime,
        endTime
      }}
      title={title}
      placement="top"
      dialog={dialog}
      showActionButtons={false}
      footer={
        <Box alignX="right" width="100%">
          <Button onClick={dialog.hide}>
            <CancelText />
          </Button>
        </Box>
      }
    >
      <VerifyBody readOnly />
    </FormDialog>
  )
}

const VerifyBody = ({ readOnly = false } = {}) => {
  return (
    <Stack spacing="major-2" marginLeft="1rem">
      <FormBody readOnly={true} />
      <Box border="default" height="1px" width="100%" borderBottom="none"></Box>

      <FieldValues paddingBottom="1rem">
        <Label name="remarks">
          <Trans zh="备注" en="Remarks" />
        </Label>
        <Textarea name="remarks" disabled={readOnly} />
      </FieldValues>
    </Stack>
  )
}
