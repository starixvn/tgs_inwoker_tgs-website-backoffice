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
import { Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { PromotionTypeGroup } from "../PromotionType"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import { SigninRewardRuleSetting } from "./reward/SigninReward"
import { LotteryRewardRuleSetting } from "./reward/LotteryReward"
import { NewUserRewardRuleSetting } from "./reward/NewUserReward"
import { useTotalFunds } from "./field/TotalFundsField"
import { DepositRewardRuleSetting } from "./reward/DepositReward"
import { TurnoverRewardRuleSetting } from "./reward/TurnoverReward"
import { ReliefMoneyRewardRuleSetting } from "./reward/ReliefMoneyReward"
import { OfflineRewardRuleSetting } from "./reward/OfflineReward"
import Separator from "../../layout/Separator"
import { VipLevelCheckboxGroupField } from "./field/VipLevelCheckboxGroupField"
import { Dummy } from "./reward/DummyReward"

const RuleSettingNotAvailable = [Dummy]

export const RuleSetting = ({
  promotionType,
  promotionTypeGroup,
  ...props
}) => {
  if (!promotionType || RuleSettingNotAvailable.includes(promotionType)) {
    return null
  }

  return (
    <>
      <Separator />

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

export const PromotionRuleSetting = ({
  readOnly,
  promotionTypeGroup,
  promotionType
}) => {
  let { control } = useFormContext()

  switch (promotionTypeGroup) {
    //TODO: rm?
    case PromotionTypeGroup.Signin:
      return (
        <SigninRewardRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.NewUser:
      return (
        <NewUserRewardRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.LuckyDraw:
      return (
        <LotteryRewardRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.Deposit:
      return (
        <DepositRewardRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.Turnover:
      return (
        <TurnoverRewardRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )
    case PromotionTypeGroup.ReliefMoney:
      return (
        <ReliefMoneyRewardRuleSetting
          promotionType={promotionType}
          readOnly={readOnly}
        />
      )

    case PromotionTypeGroup.Offline:
      return <OfflineRewardRuleSetting readOnly={readOnly} />
    default:
      //TODO: able to rm DefaultSetting?
      return null
    /*
      return promotionType ? (
        <DefaultSetting promotionType={promotionType} readOnly={readOnly} />
      ) : null
      */
  }
}

//TODO: able to rm?
const DefaultSetting = ({ readOnly }) => {
  let totalFunds = useTotalFunds()
  let disabled = readOnly
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

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
