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
import { InputField } from "../../input/Input"
import { GameProviderSubGameProviderSelect } from "../../game/providers/GameProviderSubGameProviderSelect"
import { CurrencySelectField } from "../../currency/CurrencySelect"
import DateTimeInput from "../../date/DateTimeInput"
import { ConfirmText } from "../../button/ActionButtons"
import GameStatus, { GameStatusSelectField } from "../../game/games/GameStatus"
import { GameRoundStatusSelectField } from "../../game/round/GameRoundStatus"
import { GameSelect } from "../../game/games/GameSelect"

//TODO: game provider id?
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

const useFakeFetch = () => {
  return {
    isLoading: false,
    result: undefined,
    error: undefined,
    mutate: () => {},
    deleteCache: () => {}
  }
}

const AddRoundDialog = ({ onSubmitted, dialog, ...props }) => {
  let title = useTrans({
    zh: "新增订单",
    en: "Add Round"
  })

  let formRef = useRef()

  let confirmSubmitDialog = useModalState()

  let [formData, setSubmit] = useState()
  //TODO: useFetch
  let { isLoading, result, error, mutate, deleteCache } = useFakeFetch(formData)

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
  return (
    <FieldStack paddingLeft="1.5rem" paddingRight="1.5rem" paddingBottom="1rem">
      <FieldWrapper label={<Trans zh="平台" en="Platform" />}>
        <MerchantIdSelect />
      </FieldWrapper>
      <FieldStack orientation="horizontal">
        <InputField name="player" label={<Trans zh="玩家" en="Player" />} />
        <InputField
          name="playerCode"
          label={<Trans zh="玩家代碼" en="Player Code" />}
        />
      </FieldStack>
      <FieldWrapper label={<Trans zh="游戏厂商" en="Game Provider" />}>
        <GameProviderSubGameProviderSelect
          gameProviderProps={{
            name: "gameProviderId",
            required: true
          }}
          subGameProviderProps={{
            required: true
          }}
        />
      </FieldWrapper>
      <FieldStack orientation="horizontal" alignX="bottom">
        <FieldWrapper
          label={<Trans zh="游戏 input or select?" en="Game" />}
          flex="1"
        >
          <GameSelect name="game" gameProviderId={gameProviderId} />
        </FieldWrapper>
        <CurrencySelectField
          name="currencyCode"
          label={<Trans zh="币种" en="Currency" />}
          flex="1"
        />
      </FieldStack>
      <InputField label={<Trans zh="三方訂單ID" en="External ID" />} />
      <FieldStack orientation="horizontal">
        <FieldWrapper
          label={<Trans zh="三方投注时间" en="External Created On" />}
        >
          <DateTimeInput name="externalCreatedOn" />
        </FieldWrapper>
        <FieldWrapper
          label={<Trans zh="三方结算时间" en="External Closed On" />}
        >
          <DateTimeInput name="externalClosedOn" />
        </FieldWrapper>
      </FieldStack>
      <Box>TODO: 平台訂單ID?</Box>
      <FieldStack orientation="horizontal">
        <FieldWrapper label={<Trans zh="平台投注时间" en="Created On" />}>
          <DateTimeInput name="createdOn" />
        </FieldWrapper>
        <FieldWrapper label={<Trans zh="平台结算时间" en="Closed On" />}>
          <DateTimeInput name="closedOn" />
        </FieldWrapper>
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="betAmount"
          label={<Trans zh="投注金额" en="Bet Amount" />}
        />
        <NumberInputField
          name="validBetAmount"
          label={<Trans zh="有效投注金额" en="Valid Bet Amount" />}
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="settleAmount"
          label={<Trans zh="结算金额" en="Settle Amount" />}
        />
        <NumberInputField
          name="commission"
          label={<Trans zh="佣金" en="Commission" />}
        />
      </FieldStack>
      <FieldStack orientation="horizontal">
        <NumberInputField
          name="turnover"
          label={<Trans zh="流水" en="CommiTurnoverssion" />}
        />
        <GameRoundStatusSelectField
          name="status"
          label={<Trans zh="状态" en="Status" />}
        />
      </FieldStack>
      <NumberInputField
        name="winLoss"
        label={<Trans zh="输赢金额" en="Win Loss" />}
        hint={
          <Trans
            zh="输赢金额 > 0,代表公司赢"
            en="Win loss > 0 means company win."
            css={css`
              font-weight: bold;
            `}
          />
        }
      />
    </FieldStack>
  )
}
