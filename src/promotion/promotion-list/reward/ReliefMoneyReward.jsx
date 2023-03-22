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
import { useIsDisplayMenuByRoute } from "../../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  NewDisclosure,
  ViewDisclosure
} from "../../../dialog/Disclosure"
import FormDialog from "../../../form/FormDialog"
import { Trans, useTrans } from "../../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import {
  PromotionTypeGroup,
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../../PromotionType"
import { FieldValues } from "../../../layout/Grid"
import { NormalLabel } from "../../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../../input/NumberInput"
import { PlayerAutoJoinField } from "../field/PlayerAutoJoinField"
import { VipLevelCheckboxGroupField } from "../field/VipLevelCheckboxGroupField"
import { GameTypeSelectField } from "../field/GameTypeSelectField"
import { GameProviderSelectField } from "../field/GameProviderSelectField"

export const ReliefMoneyRewardRuleSetting = ({
  limitedTotalAmount,
  totalAmountLimit,
  readOnly
}) => {
  let { control, setValue } = useFormContext()

  let disabled = readOnly
  let editable = !readOnly
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <GameTypeSelectField readOnly={readOnly} />

      <GameProviderSelectField readOnly={readOnly} />

      <PlayerAutoJoinField readOnly={readOnly} disabled={disabled} />
      <NormalLabel>
        <Trans zh="彩金百分比" en="Bonus Percentage" />
      </NormalLabel>
      <PercentageNumberInputField
        name="rule.percentage"
        registerOptions={{
          valueAsNumber: true,
          shouldUnregister: true
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
        max={
          limitedTotalAmount && Number.isFinite(totalAmountLimit)
            ? totalAmountLimit
            : undefined
        }
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        registerOptions={{
          valueAsNumber: true,
          shouldUnregister: true
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
