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
  Alert,
  Spinner
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
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
import Separator from "../../layout/Separator"
import { usePlayerMainWallet } from "../../player-management/player-list/client"

export const SettleGameRoundDialogDisclosure = ({
  roundId,
  record,
  useUpdate = useCloseGameOpenRound,
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
        <SettleGameRoundDialog
          roundId={roundId}
          record={record}
          useUpdate={useUpdate}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const SettleGameRoundDialog = ({
  roundId,
  record = {},
  useUpdate,
  onSubmitted,
  dialog
}) => {
  let title = useTrans({
    zh: "结算订单",
    en: "Settle Round"
  })

  let formRef = useRef()
  let confirmSubmitDialog = useModalState()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useUpdate(
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
      id="settle-game-round-dialog"
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
          onClick: confirmSubmitDialog.show,
          "data-type": "confirm",
          isLoading,
          disabled: isLoading
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
        id="confirm-dialog"
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
  let playerCode = getValues("playerCode")

  //TODO: refresh btn?
  let {
    isLoading: isLoadingMainWallet,
    data: mainWallet,
    error,
    mutate,
    deleteCache
  } = usePlayerMainWallet(playerCode)
  return (
    <FieldStack>
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
          label={<Trans zh="投注金额" en="Bet Amount" />}
          required
          min="0"
          step="0.01"
        />
        <NumberInputField
          name="validBetAmount"
          label={<Trans zh="有效投注金额" en="Valid Bet Amount" />}
          min="0"
          step="0.01"
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="settleAmount"
          label={<Trans zh="结算金额" en="Settle Amount" />}
          min="0"
          step="0.01"
          required
        />
        <NumberInputField
          name="commission"
          label={<Trans zh="佣金" en="Commission" />}
          step="0.01"
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="turnover"
          label={<Trans zh="流水" en="Turnover" />}
          min="0"
          step="0.01"
          required
        />
        <NumberInputField
          name="winLoss"
          label={<Trans zh="输赢金额" en="Win Loss" />}
          hint={
            <Text fontWeight="bold" color="warning">
              <Trans
                zh="输赢金额 > 0,代表公司赢"
                en="Win loss > 0 means company win."
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
        label={<Trans zh="状态" en="Status" />}
        required
      />
      <Separator />
      <FieldStack>
        <Heading use="h5">
          <Trans zh="玩家餘額調整" en="Player Balance Adjustment" />
        </Heading>
        <FieldStack orientation="horizontal">
          <FieldWrapper label={<Trans zh="玩家余额" en="Player Balance" />}>
            <Box>
              {isLoadingMainWallet && <Spinner />}
              {!isLoadingMainWallet && (
                <FormattedNumberDecimal value={mainWallet} placeholder="--" />
              )}
            </Box>
          </FieldWrapper>
          <NumberInputField
            name="adjustAmount"
            label={<Trans zh="调整金额" en="Adjust Amount" />}
            step="0.01"
          />
        </FieldStack>
      </FieldStack>
      <TextareaField name="remark" label="备注" required />
    </FieldStack>
  )
}
