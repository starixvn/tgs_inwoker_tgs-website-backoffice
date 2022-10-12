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
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  NewDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import {
  PromotionTypeGroup,
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../PromotionType"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import { useTotalFunds } from "./PromotionTotalFundsFieldBox"
import { PromotionPlayerAutoJoinFieldBox } from "./PromotionPlayerAutoJoinFieldBox"

const DailyTurnoverRebate = "TurnoverRebate"
const WeeklyTurnoverRebate = "TurnoverRebateWeekly"

export const PromotionTurnoverRuleSetting = ({ promotionType, readOnly }) => {
  switch (promotionType) {
    default:
      return <DefaultSetting readOnly={readOnly} />
  }
}

const DefaultSetting = ({ readOnly }) => {
  let totalFunds = useTotalFunds()
  let disabled = readOnly
  return (
    <FieldValues>
      <PromotionPlayerAutoJoinFieldBox />
      <NormalLabel>
        <Trans zh="流水门槛" en="Turnover Limit" />
      </NormalLabel>
      <NumberInput
        name="rule.turnoverLimit"
        defaultValue={0}
        registerOptions={{
          valueAsNumber: true
        }}
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="返水百分比" en="Rebate Percentage" />
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
        <Trans zh="返水上限" en="Rebate Limit" />
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
