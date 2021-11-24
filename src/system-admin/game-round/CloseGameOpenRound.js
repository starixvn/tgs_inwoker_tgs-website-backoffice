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
  FieldWrapper,
  Alert
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
        Are You Sure? The Round will be canceled permanently, and still need to
        proceed player’s balance adjustment for the player.
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
      <Alert
        title={
          <Trans
            zh={`*将该订单结算后，还须至"玩家调帐"页面，针对该玩家执行调帐动作`}
            en={`*When close the settlement, still need to proceed player’s balance adjustment  for the player.`}
          />
        }
        variant="bordered"
      />
      <FieldWrapper label={<Trans zh="三方订单ID" en="External Id" />}>
        <Box fontWeight="bold">{externalRoundId}</Box>
      </FieldWrapper>
      <FieldWrapper
        label={<Trans zh="三方结算时间" en="External Closed Time" />}
      >
        <DateTimeInput name="externalClosedOn" required />
      </FieldWrapper>

      <FieldStack orientation="horizontal">
        <NumberInputField
          name="betAmount"
          label="投注金额"
          required
          min="0"
          step="0.01"
        />
        <NumberInputField
          name="validBetAmount"
          label="有效投注金额"
          min="0"
          step="0.01"
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="settleAmount"
          label="结算金额"
          min="0"
          step="0.01"
          required
        />
        <NumberInputField name="commission" label="佣金" step="0.01" required />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="turnover"
          label="流水"
          min="0"
          step="0.01"
          required
        />
        <NumberInputField
          name="winLoss"
          label="输赢金额"
          hint={
            <Text fontWeight="bold" color="warning">
              <Trans
                zh="输赢金额 > 0,代表公司赢"
                en="Winloss > 0 means company win."
              />
            </Text>
          }
          step="0.01"
          required
        />
      </FieldStack>

      <GameRoundStatusSelectField
        name="clientRoundStatus"
        options={statusOptions}
        label="状态"
        required
      />
      <TextareaField name="remark" label="备注" required />
    </FieldStack>
  )
}
