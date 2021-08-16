import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Text, Modal, useModalState } from "bumbag"
import { Verify } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import { Disclosure, VerifyDisclosure } from "../../dialog/Disclosure"
import { useVerifyPlatformBanner } from "./client"
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

export const VerifyPlatformBannerDisclosure = ({
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
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const VerifyDialog = ({ record, onSubmitted, dialog, ...props }) => {
  let defaultValues = {
    ...record,
    from: parseDate(record.from),
    to: parseDate(record.to),
    remarks: ""
  }
  let formMethods = useForm({ defaultValues })

  let [type, setType] = useState()
  let [formData, setSubmit] = useState()

  let { isLoading, result, error, mutate, deleteCache } =
    useVerifyPlatformBanner(
      {
        id: record?.id,
        type
      },
      formData
    )

  const onSubmit = ({ remarks }) => {
    let data = {
      remarks
    }
    setSubmit(data)
  }

  const reset = () => {
    setSubmit(null)
  }

  let title = useTrans({
    zh: "审核 Banner",
    en: "Verify Banner"
  })

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
        setType("pass")
      }}
      addonButtons={
        <Button
          type="submit"
          data-type="reject"
          onClick={() => {
            setType("reject")
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
  record,
  dialog,
  ...props
}) => {
  let from = parseDate(record.from)
  let to = parseDate(record.to)

  let title = useTrans({
    zh: "查看 Banner",
    en: "View Banner"
  })

  return (
    <FormDialog
      id="view-banner-dialog"
      defaultValues={{
        ...record,
        from,
        to
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
    <Stack spacing="major-2">
      <FormBody readOnly={true} />
      <Box border="default" height="1px" width="100%" borderBottom="none"></Box>

      <FieldValues>
        <Label name="remarks">
          <Trans zh="备注" en="Remarks" />
        </Label>
        <Textarea name="remarks" disabled={readOnly} />
      </FieldValues>
    </Stack>
  )
}
