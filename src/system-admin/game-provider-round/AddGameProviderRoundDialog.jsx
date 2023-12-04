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
import { AddDisclosure, Disclosure } from "../../dialog/Disclosure"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { Table } from "../../table"
import textColumn from "../../table/column/textColumn"
import { Update } from "./menu"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { NumberInputField } from "../../input/NumberInput"
import { TextareaField } from "../../textarea"
import { FormDialog, WarningConfirmFormDialog } from "../../form/FormDialog"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"
import BrandIdSelect from "../../merchant/platforms/BrandIdSelect"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import { Input, InputField } from "../../input/Input"
import { GameProviderSubGameProviderSelect } from "../../game/providers/GameProviderSubGameProviderSelect"
import { CurrencySelectField } from "../../currency/CurrencySelect"
import DateTimeInput from "../../date/DateTimeInput"
import { CancelText, ConfirmText, SubmitText } from "../../button/ActionButtons"
import {
  GameRoundStatus,
  GameRoundStatusSelectField
} from "../../game/round/GameRoundStatus"
import { GameSelectField } from "../../game/games/GameSelect"
import { useAddSystemGameRound } from "../../game/round/client"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import { useBrand } from "../../merchant/platforms/client"
import { isValidDate } from "../../date/isValidDate"
import { min, max, endOfToday } from "date-fns"
import { Modal } from "../../dialog/Modal"
import { PlayerCodeTrans } from "../../trans/Player"
import { RemarkTrans } from "../../trans/Action"
import {
  BetAmountTrans,
  ExternalBetTimeTrans,
  GameProviderTrans,
  GameSettleAmountTrans,
  TurnoverTrans,
  ValidBetAmountTrans,
  WinLossTrans
} from "../../trans/Game"
import { StatusTrans } from "../../trans/Status"

export const AddGameProviderRoundDialogDisclosure = ({
  id,
  dialogId = "add-game-provider-round-dialog",
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <AddDisclosure id={id} {...dialog} {...props} />
      {dialog.visible && (
        <AddRoundDialog
          dialog={dialog}
          dialogId={dialogId}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const AddRoundDialog = ({ onSubmitted, dialog, dialogId, ...props }) => {
  let title = useTrans({
    zh: "新增订单",
    en: "Add Round"
  })

  let formRef = useRef()

  let confirmSubmitDialog = useModalState()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useAddSystemGameRound(formData)

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id={dialogId}
      formRef={formRef}
      defaultValues={{}}
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
        <Modal
          id="confirm-dialog"
          actionButtonsProps={{
            submitText: <SubmitText />,
            cancelText: <CancelText />,
            onClickSubmit: () => {
              confirmSubmitDialog.hide()
              formRef.current.requestSubmit()
            }
          }}
          {...confirmSubmitDialog}
          showActionButtons
        >
          <Trans zh="確認送出?" en="Confirm Submit?" />
        </Modal>
      )}
    </FormDialog>
  )
}

const FormBody = ({}) => {
  let { control } = useFormContext()

  let GameProviderIdField = "gameProviderId"
  let gameProviderId = useWatch({
    control,
    name: GameProviderIdField
  })

  let SubGameProviderCodeField = "subGameProviderCode"
  let subGameProviderCode = useWatch({
    control,
    name: SubGameProviderCodeField
  })

  let ExternalCreatedOnField = "externalCreatedOn"
  let externalCreatedOn = useWatch({
    control,
    name: ExternalCreatedOnField
  })

  let ExternalClosedOnField = "externalClosedOn"
  let externalClosedOn = useWatch({
    control,
    name: ExternalClosedOnField
  })
  let now = new Date()

  //TODO: minDate & maxDate validate on DateTimeInputField
  return (
    <FieldStack paddingLeft="1.5rem" paddingRight="1.5rem" paddingBottom="1rem">
      <InputField name="playerCode" label={<PlayerCodeTrans />} required />
      <FieldWrapper label={<GameProviderTrans />}>
        <GameProviderSubGameProviderSelect
          gameProviderProps={{
            name: "gameProviderId",
            required: true
          }}
          subGameProviderProps={{
            name: SubGameProviderCodeField,
            required: true
          }}
        />
      </FieldWrapper>
      <GameSelectField
        name="gameId"
        required
        gameProviderId={gameProviderId}
        label={<Trans zh="游戏" en="Game" />}
        filter={(game) => {
          if (subGameProviderCode) {
            return game.subGpCode == subGameProviderCode
          }
          return true
        }}
      />
      <InputField
        name="externalRoundId"
        label={<Trans zh="三方訂單ID" en="External ID" />}
        required
      />
      <FieldStack orientation="horizontal">
        <FieldWrapper
          id={ExternalCreatedOnField}
          label={<ExternalBetTimeTrans />}
        >
          <DateTimeInput
            name={ExternalCreatedOnField}
            maxDate={externalClosedOn ?? now}
            required
          />
        </FieldWrapper>
        <FieldWrapper
          id={ExternalClosedOnField}
          label={<Trans zh="三方结算时间" en="External Closed On" />}
        >
          <DateTimeInput
            name={ExternalClosedOnField}
            minDate={externalCreatedOn}
            maxDate={now}
            required
          />
        </FieldWrapper>
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="betAmount"
          min={0}
          label={<BetAmountTrans />}
          required
        />
        <NumberInputField
          name="validBetAmount"
          min={0}
          label={<ValidBetAmountTrans />}
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="settleAmount"
          label={<GameSettleAmountTrans />}
          required
        />
        <NumberInputField
          name="commission"
          label={<Trans zh="佣金" en="Commission" />}
          min={0}
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="turnover"
          label={<TurnoverTrans />}
          min={0}
          required
        />
        <GameRoundStatusSelectField
          name="clientRoundStatus"
          filter={({ value }) => {
            return value != GameRoundStatus.Open
          }}
          label={<StatusTrans />}
          required
        />
      </FieldStack>
      <NumberInputField
        name="companyWinLoss"
        required
        label={<WinLossTrans />}
        hint={
          <Text fontWeight="bold" color="warning">
            <Trans
              zh="输赢金额 > 0,代表公司赢"
              en="Win loss > 0 means company win."
            />
          </Text>
        }
      />
      <TextareaField
        name="remark"
        label={<RemarkTrans />}
        transition="unset"
        css={css`
          textarea {
            transition: unset;
          }
        `}
      />
    </FieldStack>
  )
}
