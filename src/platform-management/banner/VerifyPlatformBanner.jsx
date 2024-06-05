import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Text, Modal, useModalState } from "bumbag"
import { Verify } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import {
  Disclosure,
  ReviewDisclosure,
  VerifyDisclosure
} from "../../dialog/Disclosure"
import { useVerifyPlatformBanner, usePlatformBanner } from "./client"
import { Trans, useTrans } from "../../i18n"
import { parseISO } from "date-fns"
import { CancelText } from "../../button/ActionButtons"
import FormDialog from "../../form/FormDialog"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import Textarea, { TextareaField } from "../../textarea"
import { FormBody } from "./PlatformBanner"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { clone } from "lodash-es"
import {
  RejectTrans,
  RemarkTrans,
  useVerifyTrans,
  useViewTrans
} from "../../trans/Action"
import { SWRConfig } from "swr"

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
      <ReviewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <VerifyDialog
            brandId={brandId}
            record={record}
            onSubmitted={onSubmitted}
            dialog={dialog}
          />
        </SWRConfig>
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
    beginTime: parseISO(record.beginTime),
    endTime: record.endTime && parseISO(record.endTime),
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
  let title = useVerifyTrans()

  let formMethods = useForm({ defaultValues })

  let [formData, setSubmit] = useState()

  let { isLoading, result, error, deleteCache } = useVerifyPlatformBanner(
    brandId,
    record?.id,
    formData
  )

  const onSubmit = ({ remarks, reviewState }) => {
    let data = {
      remarks,
      reviewState
    }
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
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
          <RejectTrans />
        </Button>
      }
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
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
  let beginTime = parseISO(record.beginTime)
  let endTime = parseISO(record.endTime)

  let title = useViewTrans()

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
          <RemarkTrans />
        </Label>
        <Textarea name="remarks" disabled={readOnly} />
      </FieldValues>
    </Stack>
  )
}
