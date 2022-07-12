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
import { PromotionSigninRuleSetting } from "./PromotionSigninRuleSetting"
import { PromotionLotteryRuleSetting } from "./PromotionLotteryRuleSetting"
import { PromotionNewUserRuleSetting } from "./PromotionNewUserRuleSetting"

export const PromotionRuleSettingFieldBox = ({
  promotionType,
  promotionTypeGroup,
  ...props
}) => {
  if (!promotionType || fieldNotUsed({ promotionType, promotionTypeGroup })) {
    return null
  }

  return (
    <>
      <Heading use="h5">
        <Trans zh="規則設定" en="Rule Settings" />
      </Heading>

      <PromotionRuleSetting
        promotionTypeGroup={promotionTypeGroup}
        promotionType={promotionType}
        {...props}
      />
    </>
  )
}

const notUsedConfigs = {
  promotionType: [PromotionTypeGroup.Dummy],
  promotionTypeGroup: [PromotionTypeGroup.Dummy]
}
const fieldNotUsed = ({ promotionType = "", promotionTypeGroup = "" }) => {
  if (
    notUsedConfigs.promotionTypeGroup.includes(promotionTypeGroup) ||
    notUsedConfigs.promotionType.includes(promotionType)
  ) {
    return true
  }

  return false
}

export const PromotionRuleSetting = ({
  readOnly,
  promotionTypeGroup,
  promotionType,
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
        <PromotionSigninRuleSetting
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.NewUser:
      return (
        <PromotionNewUserRuleSetting
          promotionType={promotionType}
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.LuckyDraw:
      return (
        <PromotionLotteryRuleSetting
          promotionType={promotionType}
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      )
    default:
      return promotionType ? (
        <DefaultSetting
          promotionType={promotionType}
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      ) : null
  }
}

const FieldName = "rule"
const DefaultSetting = ({ limitedTotalAmount, totalAmountLimit, readOnly }) => {
  let disabled = readOnly
  return (
    <FieldValues>
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
          valueAsNumber: true,
          shouldUnregister: true
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
