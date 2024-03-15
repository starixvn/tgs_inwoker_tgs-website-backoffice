import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  FieldStack,
  Box,
  Button,
  Text,
  Modal,
  Set,
  useModalState,
  Columns,
  Heading,
  Level,
  Group,
  Divider
} from "bumbag"
import {
  Create as CreateMenu,
  Update as UpdateMenu,
  View as ViewMenu
} from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { FormattedNumber, FormattedNumberDecimal, Trans } from "../../i18n"
import {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import Input, { InputField } from "../../input/Input"
import { useAddVipLevel, useUpdateVipLevel } from "../../vip-levels/client"
import { NormalLabel } from "../../form/Label"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import clone from "clone-deep"
import { useFormContext, useWatch } from "react-hook-form"
import Switch from "../../switch/Switch"
import { useAddTrans, useEditTrans, useViewTrans } from "../../trans/Action"
import {
  BirthdayBonusTrans,
  CardGameCommissionRebateTrans,
  EGameCommissionRebateTrans,
  LiveDealerCommissionRebateTrans,
  LotteryCommissionRebateTrans,
  PromotionBonusTrans,
  QuarterlyBonusTrans,
  RequiredBetAmountToLevelUpTrans,
  RequiredDepositAmountToLevelUpTrans,
  SportsbookCommissionRebateTrans,
  TotalAmountPerDayTrans,
  TransactionsPerDayTrans,
  UpgradeConditionsTrans,
  VipBenefitsTrans,
  VipCommissionRebateTrans,
  VirtualSportsCommissionRebateTrans,
  WithdrawalPolicyTrans
} from "../../trans/Vip"

export const AddButton = ({ brandId, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([CreateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} {...props} />
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

const AddDialog = ({ brandId, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { result, error, mutate, deleteCache, isLoading } =
    useAddVipLevel(formData)

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      brandId
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useAddTrans()
  return (
    <FormDialog
      id="add-vip-level-dialog"
      defaultValues={{}}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="100vw"
      minWidth="85vw"
      placement="top"
    >
      <EditBody isAdd={true} />
    </FormDialog>
  )
}

export const EditButton = ({ brandId, record, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} {...props} />
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

const EditDialog = ({ brandId, record, onSubmitted, dialog, ...props }) => {
  let { id } = record

  let [formData, setSubmit] = useState()
  let { result, error, mutate, deleteCache, isLoading } = useUpdateVipLevel(
    id,
    formData
  )

  let title = useEditTrans()

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      brandId
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="edit-vip-level-dialog"
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="100vw"
      minWidth="85vw"
      placement="top"
    >
      <EditBody record={record} />
    </FormDialog>
  )
}

const WithdrawTransactionsPerDayField = "withdrawTransactionsPerDay"
const WithdrawTransactionsPerDayInputGroup = ({
  name = WithdrawTransactionsPerDayField,
  ...props
}) => <WithdrawLimitInputGroup name={name} {...props} />

const WithdrawTotalAmountPerDayField = "withdrawTotalAmountPerDay"
const WithdrawTotalAmountPerDayInputGroup = ({
  name = WithdrawTotalAmountPerDayField,
  ...props
}) => <WithdrawLimitInputGroup name={name} {...props} />

const WithdrawLimitInputGroup = ({
  name,
  valueForUnlimited = -1,
  readOnly,
  ...props
}) => {
  let { control, setValue } = useFormContext()
  let EnableInputField = `enable-${name}`

  let value = useWatch({
    name,
    control
  })

  let isDefaultEnabled = Number.isFinite(value) && value !== valueForUnlimited
  let isEnable = useWatch({
    name: EnableInputField,
    control,
    defaultValue: isDefaultEnabled
  })
  let inputDisabled = !isEnable

  useEffect(() => {
    if (!isEnable) {
      setValue(name, null)
    }
  }, [isEnable])

  if (readOnly) {
    let isNumber = Number.isFinite(value)
    if (!isNumber || value === valueForUnlimited) {
      return <Box>-</Box>
    }
    return (
      <Box alignY="center">
        <FormattedNumber value={value} />
      </Box>
    )
  }

  return (
    <Set>
      <Switch name={EnableInputField} defaultChecked={isEnable} />
      <NumberInputField
        name={name}
        value={value}
        min="1"
        required={isEnable}
        disabled={inputDisabled}
        addonBefore={
          <Button isStatic tabIndex="-1">
            ＜＝
          </Button>
        }
        css={css`
          flex: 1;
        `}
        {...props}
      />
    </Set>
  )
}

const EditBody = ({ record, readonly = false, isAdd = false }) => {
  let { getValues } = useFormContext()
  let editable = !readonly
  let id = getValues("id")

  let isLevel1 = record?.level === 1
  return (
    <FieldStack orientation="vertical" paddingBottom="1.5rem">
      <Level width="100%" paddingLeft="1rem" paddingRight="1rem">
        <Set orientation="vertical" isFilled flex="1">
          <Heading use="h5">
            <UpgradeConditionsTrans />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <RequiredBetAmountToLevelUpTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput
                    name="levelUpAccumulateBetAmount"
                    min="0"
                    disabled={isLevel1}
                  />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.levelUpAccumulateBetAmount} />
                </Box>
              )}

              <NormalLabel>
                <RequiredDepositAmountToLevelUpTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput
                    name="levelUpAccumulateDeposit"
                    min="0"
                    disabled={isLevel1}
                  />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.levelUpAccumulateDeposit} />
                </Box>
              )}
            </FieldValues>
          </Set>

          <Divider marginTop="1rem" marginRight="1rem" />

          <Heading use="h5" marginTop="1rem">
            <VipBenefitsTrans />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <BirthdayBonusTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput name="birthBenefit" min="0" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.birthBenefit} />
                </Box>
              )}

              <NormalLabel>
                <PromotionBonusTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput
                    name="promotionBenefit"
                    min="0"
                    disabled={isLevel1}
                  />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.promotionBenefit} />
                </Box>
              )}

              <NormalLabel>
                <QuarterlyBonusTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput name="quarterlyBenefit" min="0" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.quarterlyBenefit} />
                </Box>
              )}
            </FieldValues>
          </Set>

          <Divider marginTop="1rem" marginRight="1rem" />

          <Heading use="h5" marginTop="1rem">
            <WithdrawalPolicyTrans />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <TransactionsPerDayTrans />
              </NormalLabel>
              <WithdrawTransactionsPerDayInputGroup
                // value={readonly && record?.withdrawTransactionsPerDay}
                readOnly={readonly}
              />

              <NormalLabel>
                <TotalAmountPerDayTrans />
              </NormalLabel>
              <WithdrawTotalAmountPerDayInputGroup readOnly={readonly} />
            </FieldValues>
          </Set>
        </Set>
        <Set orientation="vertical" isFilled flex="1">
          <Heading use="h5">
            <VipCommissionRebateTrans />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <LiveDealerCommissionRebateTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="liveDealerRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.liveDealerRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <EGameCommissionRebateTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="slotRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.slotRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <CardGameCommissionRebateTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="cardGameRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.cardGameRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <SportsbookCommissionRebateTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="sportsRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.sportsRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <VirtualSportsCommissionRebateTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="virtualSportsRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.virtualSportsRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <LotteryCommissionRebateTrans />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="lotteryRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.lotteryRebate}
                    postfix="%"
                  />
                </Box>
              )}
            </FieldValues>
          </Set>
        </Set>
      </Level>
      <Input type="hidden" name="id" value={id} />
    </FieldStack>
  )
}

export const ViewButton = ({ record, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && <ViewDialog record={record} dialog={dialog} />}
    </>
  )
}

const ViewDialog = ({ record, dialog }) => {
  let title = useViewTrans()
  return (
    <FormDialog
      id="view-vip-level-dialog"
      defaultValues={record}
      onCloseErrorAlert={dialog.hide}
      title={title}
      dialog={dialog}
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      maxWidth="100vw"
      minWidth="70vw"
      placement="top"
    >
      <EditBody record={record} readonly={true} />
    </FormDialog>
  )
}
