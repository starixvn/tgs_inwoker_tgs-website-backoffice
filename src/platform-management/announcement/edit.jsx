import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Button, Text, Modal, Alert, FieldStack } from "bumbag"
import {
  Create as CreateMenu,
  Update as UpdateMenu,
  Verify as VerifyMenu,
  View as ViewMenu
} from "./menu"
import {
  useIsDisplayMenuByRoute,
  useUserBrandId,
  useUserLicenseeId,
  useUserResellerId,
  useUserRoleType
} from "../../user/context"
import { FieldValues } from "../../layout/Grid"
import Label from "../../form/Label"
import Disclosure from "../../dialog/Disclosure"
import {
  useAddAnnouncement,
  useEditAnnouncement,
  useVerifyAnnouncement
} from "./client"
import { Trans, useTrans } from "../../i18n"
import { parseISO } from "date-fns"
import { CancelText } from "../../button/ActionButtons"
import FormDialog from "../../form/FormDialog"
import Input, { InputField } from "../../input/Input"
import DateTimeInput from "../../date/DateTimeInput"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import Textarea, { TextareaField } from "../../textarea"
import { Features, isDev, isFeatureEnabled } from "../../env"

export const AddButton = ({ brandId, onSubmitted, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([CreateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="新增" en="Add" />
      </Disclosure>
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
  let [data, setSubmit] = useState()
  let { result, error, mutate, isLoading } = useAddAnnouncement(data)

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
    zh: "新增公告",
    en: "Add Announcement"
  })

  return (
    <FormDialog
      id="add-announcement-dialog"
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
      css={DialogCss}
    >
      <EditBody />
    </FormDialog>
  )
}

export const EditButton = ({ brandId, record, onSubmitted, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="修改" en="Edit" />
      </Disclosure>
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

export const ViewButton = ({ record, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="查看" en="View" />
      </Disclosure>
      {dialog.visible && <ViewDialog record={record} dialog={dialog} />}
    </>
  )
}

const ViewDialog = ({ record, dialog, ...props }) => {
  let from = parseISO(record.from)
  let to = parseISO(record.to)

  let title = useTrans({
    zh: "查看公告",
    en: "View Announcement"
  })

  return (
    <FormDialog
      id="view-announcement-dialog"
      defaultValues={{
        ...record,
        from,
        to
      }}
      title={title}
      placement="top"
      css={DialogCss}
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

const EditDialog = ({ brandId, record, onSubmitted, dialog, ...props }) => {
  let { id } = record
  let [formData, setSubmit] = useState()
  let { result, error, mutate, isLoading } = useEditAnnouncement(id, formData)

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
    zh: "修改公告",
    en: "Edit Announcement"
  })

  return (
    <FormDialog
      id="edit-announcement-dialog"
      defaultValues={{
        ...record,
        from: parseISO(record.from),
        to: parseISO(record.to)
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
      css={DialogCss}
    >
      <EditBody />
    </FormDialog>
  )
}

const EditBody = ({ readOnly = false } = {}) => {
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
  let textareaHeight = readOnly ? "15vh" : "30vh"
  return (
    <FieldStack>
      {required && (
        <Alert
          type="info"
          variant="bordered"
          title={
            <Trans
              zh="*点击「多语系」按钮以新增其他语系内容。"
              en={`*Click on “multi-language” button and fill fields in other languages.(optional)`}
            />
          }
        ></Alert>
      )}
      <FieldValues marginLeft="1rem" paddingBottom="1rem">
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

        <Label name="content" required={required}>
          <Trans zh="内容" en="Content" />
        </Label>
        <TextareaField
          name="content"
          showLocalizationAddonAfter
          brandId={brandId}
          required={required}
          disabled={readOnly}
          height={textareaHeight}
          css={css`
            height: ${textareaHeight};

            & .bb-FieldWrapper,
            & .bb-TextareaWrapper,
            & .bb-Textarea {
              height: ${textareaHeight};
            }
          `}
        />
      </FieldValues>
    </FieldStack>
  )
}

export const VerifyButton = ({ record, onSubmitted, ...props }) => {
  let dialog = Modal.useState()

  let isDisplay = useIsDisplayMenuByRoute([VerifyMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="审核" en="Verify" />
      </Disclosure>
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

const DialogCss = css`
  min-width: 65vw;
`

const VerifyDialog = ({ record, onSubmitted, dialog, ...props }) => {
  let defaultValues = {
    ...record,
    from: parseISO(record.from),
    to: parseISO(record.to),
    remarks: ""
  }
  let formMethods = useForm({ defaultValues })

  let [type, setType] = useState()
  let [data, setSubmit] = useState()
  let { result, error, mutate, isLoading } = useVerifyAnnouncement(
    {
      id: record?.id,
      type
    },
    data
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
    zh: "审核公告",
    en: "Verify Announcement"
  })

  return (
    <FormDialog
      id="verify-announcement-dialog"
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
      css={DialogCss}
      dialog={dialog}
    >
      <VerifyBody />
    </FormDialog>
  )
}

const VerifyBody = ({ readOnly = false } = {}) => {
  return (
    <Stack spacing="major-2">
      <EditBody readOnly={true} />
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
