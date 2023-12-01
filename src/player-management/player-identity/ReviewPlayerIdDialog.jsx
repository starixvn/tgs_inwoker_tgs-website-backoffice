import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Set,
  Box,
  Icon,
  Dialog,
  useModalState,
  FieldStack,
  Link,
  Button,
  Divider
} from "bumbag"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import Disclosure, {
  VerifyDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import Backdrop from "../../dialog/Backdrop"
import { FormattedDateTime, Trans, useTrans } from "../../i18n"
import clone from "clone-deep"
import { FieldValues } from "../../layout/Grid"
import { usePlayerIdentity, useVerifyPlayerID } from "../player-identity/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Textarea, { TextareaField } from "../../textarea"
import Separator from "../../layout/Separator"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faCertificate } from "@fortawesome/free-solid-svg-icons"
import {
  PlayerIdentityStateLabel,
  isPlayerIdentityWaitingVerify
} from "./PlayerIdentityState"
import { InputField } from "../../input/Input"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import { ICNumberTrans, RealNameTrans } from "../../trans/User"
import { RemarkTrans } from "../../trans/Action"
import { ApplicationTimeTrans } from "../../trans/Date"

export const ReviewPlayerIdDialogDisclosure = ({
  brandId,
  playerCode,
  formId,
  status,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let waitingVerify = isPlayerIdentityWaitingVerify(status)
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])

  return (
    <>
      {waitingVerify && hasUpdateAuth ? (
        <VerifyDisclosure {...dialog} {...props} />
      ) : (
        <ViewDisclosure {...dialog} {...props} />
      )}
      {dialog.visible && (
        <PlayerDialog
          brandId={brandId}
          playerCode={playerCode}
          formId={formId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const PlayerDialog = ({
  brandId,
  playerCode,
  formId,
  record,
  dialog,
  onSubmitted,
  ...props
}) => {
  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerIdentity(playerCode)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={deleteCache} />
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  return (
    <ReviewDialog
      {...props}
      brandId={brandId}
      playerCode={playerCode}
      formId={formId}
      record={clone(data)}
      onSubmitted={() => {
        onSubmitted?.()
        reset()
      }}
      dialog={dialog}
    />
  )
}

const ReviewDialog = ({
  brandId,
  playerCode,
  formId,
  record = {},
  dialog,
  ...props
}) => {
  let defaultValues = { ...clone(record), brandId }

  let formMethods = useForm({ defaultValues })
  let { setValue } = formMethods

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useVerifyPlayerID(
    formId,
    formData
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "身分证审核",
    en: "ID Verification"
  })

  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let editable = hasUpdateAuth && isPlayerIdentityWaitingVerify(record.status)
  let readOnly = !editable

  let hasAttchment = !!record?.authData?.PlayerIdentityFileId
  let attachmentUrl = `/api/fs/${record?.authData?.PlayerIdentityFileId}`
  return (
    <FormDialog
      id="review-player-id-dialog"
      formMethods={formMethods}
      onSubmit={onSubmit}
      actionButtonsProps={{
        submitProps: {
          "data-type": "approve"
        }
      }}
      onClickSubmit={(event) => {
        setValue("reviewResponse", "Approve")
      }}
      addonButtons={
        <Button
          type="submit"
          data-type="reject"
          onClick={() => {
            setValue("reviewResponse", "Reject")
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
      showActionButtons={editable}
      footer={readOnly && <CloseButtonFooter dialog={dialog} alignX="right" />}
      title={title}
      dialog={dialog}
      {...props}
    >
      <FieldStack>
        <FieldValues>
          <RealNameTrans />
          <Box>
            <InputField
              name="realName"
              defaultValue={record?.realName}
              readOnly={readOnly}
              disabled={readOnly}
              showEmptyFieldValueAddonAfter={editable}
              required
            />
          </Box>

          <ICNumberTrans />
          <Set alignY="center">
            <InputField
              name="idNumber"
              readOnly={readOnly}
              defaultValue={record?.idNumber}
              disabled={readOnly}
              showEmptyFieldValueAddonAfter={editable}
              required
            />
          </Set>

          <Trans zh="附件" en="Attachment" />
          <Box>
            {hasAttchment && (
              <Link href={attachmentUrl} target="_blank">
                <Trans zh="连结" en="Link" />
              </Link>
            )}
            {!hasAttchment && "-"}
          </Box>

          <Trans zh="状态" en="Status" />
          <Box>
            <PlayerIdentityStateLabel value={record.status} />
          </Box>

          <ApplicationTimeTrans />
          <Box>
            <FormattedDateTime value={record.createdOn} />
          </Box>

          {record.reviewedOn && (
            <>
              <Trans zh="审核时间" en="Review Time" />
              <Box>
                <FormattedDateTime value={record.reviewedOn} />
              </Box>
            </>
          )}
        </FieldValues>
        <Divider />
        <TextareaField
          name="remark"
          defaultValue={defaultValues.remark}
          label={<RemarkTrans />}
          readOnly={readOnly}
        />
      </FieldStack>
    </FormDialog>
  )
}
