import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  FieldStack,
  useModalState,
  Dialog,
  FieldWrapper,
  Spinner
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { Update } from "./menu"
import { useFormContext } from "react-hook-form"
import { NumberInputField } from "../../input/NumberInput"
import { TextareaField } from "../../textarea"
import { FormDialog } from "../../form/FormDialog"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"
import { useCloseGameOpenRound } from "./client"
import GameRoundStatus, {
  GameRoundStatusSelectField,
  useGameRoundStatusOptions
} from "../../game/round/GameRoundStatus"
import { ConfirmText } from "../../button/ActionButtons"
import DateTimeInput from "../../date/DateTimeInput"
import Separator from "../../layout/Separator"
import { usePlayerMainWallet } from "../../player-management/player-list/client"
import Modal from "../../dialog/Modal"
import {
  BetAmountTrans,
  ExternalRoundIdTrans,
  TurnoverTrans,
  ValidBetAmountTrans,
  WinLossTrans
} from "../../trans/Game"
import { StatusTrans } from "../../trans/Status"
import { SettleAmountTrans } from "../../trans/Field"

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
    setSubmit(null)
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
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
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
            formRef.current.requestSubmit()
          }}
        />
      )}
    </FormDialog>
  )
}

const ConfirmSubmitDialog = ({ dialog, onSubmit }) => {
  return (
    <Modal
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
    </Modal>
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
      <FieldWrapper label={<ExternalRoundIdTrans />}>
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
          label={<BetAmountTrans />}
          required
          min="0"
          step="0.01"
        />
        <NumberInputField
          name="validBetAmount"
          label={<ValidBetAmountTrans />}
          min="0"
          step="0.01"
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="settleAmount"
          label={<SettleAmountTrans />}
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
          label={<TurnoverTrans />}
          min="0"
          step="0.01"
          required
        />
        <NumberInputField
          name="winLoss"
          label={<WinLossTrans />}
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
        label={<StatusTrans />}
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
