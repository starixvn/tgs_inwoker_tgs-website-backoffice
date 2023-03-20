import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import {
  Box,
  Text,
  Button,
  Set,
  Icon,
  useModalState,
  Dialog,
  Card,
  Flex,
  Heading,
  FieldStack
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import FormDialog from "../../form/FormDialog"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import { useTotalFunds } from "./PromotionTotalFundsFieldBox"
import { PromotionVipLevelsFieldBox } from "./PromotionVipLevelsFieldBox"

const FirstDeposit = "FirstDeposit"
const DailyFirstDeposit = "DailyFirstDeposit"
const DailySecondDeposit = "DailySecondDeposit"

const DepositReward = "DepositReward"

export const PromotionDepositRuleSetting = ({ promotionType, readOnly }) => {
  switch (promotionType) {
    case DepositReward:
      return <DepositRewardSetting readOnly={readOnly} />
    default:
      return promotionType ? <DefaultSetting readOnly={readOnly} /> : null
  }
}

const DepositRewardSetting = ({ readOnly }) => {
  let { control } = useFormContext()
  let totalFunds = useTotalFunds()
  let disabled = readOnly

  let BonusAmountLimitField = "rule.bonusAmountLimit"
  let bonusAmountLimit = useWatch({
    control,
    name: BonusAmountLimitField
  })

  let PercentageField = "rule.percentage"
  let percentage = useWatch({
    control,
    name: PercentageField
  })

  let bonusAmountLimitHintLabel = useTrans({
    zh: "彩金上限/彩金百分比",
    en: "Bonus Limit/彩金百分比"
  })
  let bonusAmountLimitHint = bonusAmountLimit / (percentage / 100)
  return (
    <FieldValues>
      <PromotionVipLevelsFieldBox readOnly={readOnly} />

      <NormalLabel>
        <Trans zh="存款最低金额" en="Minimum Deposit Amount" />
      </NormalLabel>
      <NumberInput
        name="rule.depositMinimumLimit"
        min={1}
        registerOptions={{
          valueAsNumber: true
        }}
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="彩金百分比" en="Bonus Percentage" />
      </NormalLabel>
      <PercentageNumberInputField
        name={PercentageField}
        registerOptions={{
          valueAsNumber: true
        }}
        max="999"
        required
        disabled={disabled}
      />

      <BonusLimitFieldBox percentage={percentage} disabled={disabled} />
      {/* <NormalLabel>
        <Trans zh="彩金上限" en="Bonus Limit" />
      </NormalLabel>
      <NumberInputField
        name={BonusAmountLimitField}
        registerOptions={{
          valueAsNumber: true
        }}
        min="0"
        max={totalFunds}
        required
        disabled={disabled}
        hint={
          Number.isFinite(bonusAmountLimitHint) && (
            <Text fontSize="150">
              {bonusAmountLimitHintLabel}:
              <FormattedNumberDecimal value={bonusAmountLimitHint} />
            </Text>
          )
        }
      /> */}

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        registerOptions={{
          valueAsNumber: true
        }}
        min="0"
        required
        disabled={disabled}
        addonAfter={
          <Button isStatic tabIndex="-1">
            <Trans zh="倍" en="Multipliers" />
          </Button>
        }
      />
    </FieldValues>
  )
}

const BonusLimitFieldBox = ({ percentage, disabled }) => {
  let { control } = useFormContext()
  let totalFunds = useTotalFunds()

  let BonusAmountLimitField = "rule.bonusAmountLimit"
  let bonusAmountLimit = useWatch({
    control,
    name: BonusAmountLimitField
  })

  let bonusAmountLimitHintLabel = useTrans({
    zh: "彩金上限/彩金百分比",
    en: "Bonus Limit/彩金百分比"
  })
  let bonusAmountLimitHint = bonusAmountLimit / (percentage / 100)
  return (
    <>
      <NormalLabel>
        <Trans zh="彩金上限" en="Bonus Limit" />
      </NormalLabel>
      <NumberInputField
        name={BonusAmountLimitField}
        registerOptions={{
          valueAsNumber: true
        }}
        min="0"
        max={totalFunds}
        required
        disabled={disabled}
        hint={
          Number.isFinite(bonusAmountLimitHint) && (
            <Text fontSize="150">
              {bonusAmountLimitHintLabel}:
              <FormattedNumberDecimal value={bonusAmountLimitHint} />
            </Text>
          )
        }
      />
    </>
  )
}

const DefaultSetting = ({ readOnly }) => {
  let { control } = useFormContext()
  let totalFunds = useTotalFunds()
  let disabled = readOnly
  return (
    <FieldValues>
      <PromotionVipLevelsFieldBox readOnly={readOnly} />

      <NormalLabel>
        <Trans zh="彩金百分比" en="Bonus Percentage" />
      </NormalLabel>
      <PercentageNumberInputField
        name="rule.percentage"
        registerOptions={{
          valueAsNumber: true
        }}
        max="999"
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="彩金上限" en="Bonus Limit" />
      </NormalLabel>
      <NumberInput
        name="rule.bonusAmountLimit"
        registerOptions={{
          valueAsNumber: true
        }}
        min="0"
        max={totalFunds}
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        registerOptions={{
          valueAsNumber: true
        }}
        min="0"
        required
        disabled={disabled}
        addonAfter={
          <Button isStatic tabIndex="-1">
            <Trans zh="倍" en="Multipliers" />
          </Button>
        }
      />
    </FieldValues>
  )
}
