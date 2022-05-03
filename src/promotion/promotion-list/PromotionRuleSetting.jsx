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
import { useForm, useFormContext, useWatch } from "react-hook-form"
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
import { PromotionRuleSignSetting } from "./PromotionRuleSignSetting"

export const PromotionRuleSetting = ({
  readOnly,
  promotionTypeGroup,
  totalAmountLimitFieldName,
  limitedTotalAmount
}) => {
  let { control } = useFormContext()
  let totalAmountLimit = useWatch({
    control,
    name: totalAmountLimitFieldName
  })

  switch (promotionTypeGroup) {
    case PromotionTypeGroup.Signin:
      return (
        <PromotionRuleSignSetting
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.NewUser:
      return (
        <NewUserSetting
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      )
    default:
      return (
        <DefaultSetting
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      )
  }
}

const NewUserSetting = ({ limitedTotalAmount, totalAmountLimit, readOnly }) => {
  let disabled = readOnly
  return (
    <FieldValues>
      <NormalLabel>
        <Trans zh="彩金金额" en="Bonus Amount" />
      </NormalLabel>
      <NumberInput
        name="bonusAmount"
        min="0"
        max={limitedTotalAmount ? totalAmountLimit : undefined}
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="turnoverMultiple"
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

const DefaultSetting = ({ limitedTotalAmount, totalAmountLimit, readOnly }) => {
  let disabled = readOnly
  return (
    <FieldValues>
      <NormalLabel>
        <Trans zh="彩金百分比" en="Bonus Percentage" />
      </NormalLabel>
      <PercentageNumberInputField
        name="percentage"
        max="999"
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="彩金上限" en="Bonus Limit" />
      </NormalLabel>
      <NumberInput
        name="bonusAmountLimit"
        min="0"
        max={limitedTotalAmount ? totalAmountLimit : undefined}
        required
        disabled={disabled}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="turnoverMultiple"
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
