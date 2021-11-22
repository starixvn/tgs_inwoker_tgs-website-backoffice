import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  FieldWrapper
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { Update } from "./menu"
import { useForm, useFormContext } from "react-hook-form"
import { NumberInputField } from "../../input/NumberInput"
import { TextareaField } from "../../textarea"
import { FormDialog } from "../../form/FormDialog"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"
import { useCloseGameOpenRound } from "./client"
import GameRoundStatus, {
  GameRoundStatusSelect,
  GameRoundStatusSelectField,
  useGameRoundStatusOptions
} from "../../game/round/GameRoundStatus"
import { ConfirmText } from "../../button/ActionButtons"
import DateTimeInput from "../../date/DateTimeInput"

export const CloseGameOpenRoundDialogDisclosure = ({
  roundId,
  record,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="结算" en="Close" />
      </Disclosure>
      {dialog.visible && (
        <CloseGameOpenRoundDialog
          roundId={roundId}
          record={record}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const CloseGameOpenRoundDialog = ({
  roundId,
  record = {},
  onSubmitted,
  dialog
}) => {
  let title = useTrans({
    zh: "结算订单",
    en: "Close Open Round"
  })

  let formRef = useRef()
  let confirmSubmitDialog = useModalState()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useCloseGameOpenRound(
    roundId,
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

  return (
    <FormDialog
      formRef={formRef}
      defaultValues={{
        ...clone(record),
        externalClosedOn: null
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={onSubmitted}
      onCloseErrorAlert={reset}
      title={title}
      dialog={dialog}
      actionButtonsProps={{
        submitText: <ConfirmText />,
        submitProps: {
          type: "button",
          onClick: confirmSubmitDialog.show
        }
      }}
    >
      <FormBody />
      {confirmSubmitDialog.visible && (
        <ConfirmSubmitDialog
          dialog={confirmSubmitDialog}
          onSubmit={() => {
            formRef.current.dispatchEvent(
              new Event("submit", { cancelable: true })
            )
          }}
        />
      )}
    </FormDialog>
  )
}

const ConfirmSubmitDialog = ({ dialog, onSubmit }) => {
  return (
    <Backdrop {...dialog}>
      <Dialog.Modal
        title="Are you sure?"
        {...dialog}
        showActionButtons
        actionButtonsProps={{
          onClickSubmit: () => {
            dialog.hide()
            onSubmit?.()
          }
        }}
        type="danger"
        hideOnClickOutside={false}
      >
        The Round will be canceled permanently and player balance will be
        changed Immediately.
      </Dialog.Modal>
    </Backdrop>
  )
}

const FormBody = () => {
  let statusOptions = useGameRoundStatusOptions()
  statusOptions = statusOptions.filter(
    ({ value }) => value != GameRoundStatus.Open
  )
  let { getValues } = useFormContext()
  let externalRoundId = getValues("externalRoundId")
  return (
    <FieldStack>
      <FieldWrapper label={<Trans zh="三方订单ID" en="External Id" />}>
        <Box fontWeight="bold">{externalRoundId}</Box>
      </FieldWrapper>
      <FieldWrapper
        label={<Trans zh="三方结算时间" en="External Closed Time" />}
      >
        <DateTimeInput name="externalClosedOn" />
      </FieldWrapper>

      <FieldStack orientation="horizontal">
        <NumberInputField
          name="betAmount"
          label="Bet Amount"
          required
          min="0"
          step="0.01"
        />
        <NumberInputField
          name="validBetAmount"
          label="Valid Bet Amount"
          min="0"
          step="0.01"
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="settleAmount"
          label="Settle Amount"
          min="0"
          step="0.01"
          required
        />
        <NumberInputField
          name="commission"
          label="Commission"
          step="0.01"
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="turnover"
          label="Turnover"
          min="0"
          step="0.01"
          required
        />
        <NumberInputField name="winLoss" label="WinLoss" step="0.01" required />
      </FieldStack>

      <GameRoundStatusSelectField
        name="clientRoundStatus"
        options={statusOptions}
        label="Round Status"
        required
      />
      <TextareaField name="remark" label="Remark" required />
    </FieldStack>
  )
}
