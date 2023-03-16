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
import { useTotalFunds } from "./PromotionTotalFundsFieldBox"
import { PromotionDepositRuleSetting } from "./PromotionDepositRuleSetting"
import { PromotionTurnoverRuleSetting } from "./PromotionTurnoverRuleSetting"
import { PromotionReliefMoneyRuleSetting } from "./PromotionReliefMoneyRuleSetting"
import { PromotionOfflineRuleSetting } from "./PromotionOfflineRuleSetting"

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
  promotionType
}) => {
  let { control } = useFormContext()

  switch (promotionTypeGroup) {
    case PromotionTypeGroup.Signin:
      return (
        <PromotionSigninRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.NewUser:
      return (
        <PromotionNewUserRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.LuckyDraw:
      return (
        <PromotionLotteryRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.Deposit:
      return (
        <PromotionDepositRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.Turnover:
      return (
        <PromotionTurnoverRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.ReliefMoney:
      return (
        <PromotionReliefMoneyRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    /*
    TODO
    case PromotionTypeGroup.Offline:
      return <PromotionOfflineRuleSetting readOnly={readOnly} />
    */
    default:
      return promotionType ? (
        <DefaultSetting promotionType={promotionType} readOnly={readOnly} />
      ) : null
  }
}

const DefaultSetting = ({ readOnly }) => {
  let totalFunds = useTotalFunds()
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
