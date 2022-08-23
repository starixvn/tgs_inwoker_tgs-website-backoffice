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

export const AddGameProviderRoundDialogDisclosure = ({
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
      <AddDisclosure {...dialog} />
      {dialog.visible && (
        <AddRoundDialog dialog={dialog} onSubmitted={onSubmitted} />
      )}
    </>
  )
}

const AddRoundDialog = ({ onSubmitted, dialog, ...props }) => {
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
    console.log("onSubmit > data", data)
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
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
        <Backdrop {...confirmSubmitDialog}>
          <Dialog.Modal
            actionButtonsProps={{
              submitText: <SubmitText />,
              cancelText: <CancelText />,
              onClickSubmit: () => {
                confirmSubmitDialog.hide()
                formRef.current.dispatchEvent(
                  new Event("submit", { cancelable: true })
                )
              }
            }}
            {...confirmSubmitDialog}
            showActionButtons
          >
            <Trans zh="確認送出?" en="Confirm Submit?" />
          </Dialog.Modal>
        </Backdrop>
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
      <InputField
        name="playerCode"
        label={<Trans zh="玩家代碼" en="Player Code" />}
        required
      />
      <FieldWrapper label={<Trans zh="游戏厂商" en="Game Provider" />}>
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
          label={<Trans zh="三方投注时间" en="External Created On" />}
        >
          <DateTimeInput
            name={ExternalCreatedOnField}
            maxDate={externalClosedOn ?? now}
            required
          />
        </FieldWrapper>
        <FieldWrapper
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
          label={<Trans zh="投注金额" en="Bet Amount" />}
          required
        />
        <NumberInputField
          name="validBetAmount"
          min={0}
          label={<Trans zh="有效投注金额" en="Valid Bet Amount" />}
          required
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="settleAmount"
          label={<Trans zh="结算金额" en="Settle Amount" />}
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
          label={<Trans zh="流水" en="CommiTurnoverssion" />}
          min={0}
          required
        />
        <GameRoundStatusSelectField
          name="clientRoundStatus"
          filter={({ value }) => {
            return value != GameRoundStatus.Open
          }}
          label={<Trans zh="状态" en="Status" />}
          required
        />
      </FieldStack>
      <NumberInputField
        name="companyWinLoss"
        required
        label={<Trans zh="输赢金额" en="Win Loss" />}
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
        label={<Trans zh="备注" en="Remark" />}
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
