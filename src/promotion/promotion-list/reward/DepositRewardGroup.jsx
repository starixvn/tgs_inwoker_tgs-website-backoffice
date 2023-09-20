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
import FormDialog from "../../../form/FormDialog"
import { FormattedNumberDecimal, Trans, useTrans } from "../../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { FieldValues } from "../../../layout/Grid"
import { NormalLabel } from "../../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../../input/NumberInput"
import { useTotalFunds } from "../field/TotalFundsField"
import { VipLevelCheckboxGroupField } from "../field/VipLevelCheckboxGroupField"
import { MainSetting } from "../MainSetting"
import { ContentSetting } from "../ContentSetting"
import { usePromotionBrandId } from "../usePromotionFormData"
import { PaymentChannelSelect } from "../../../payment/channel/PaymentChannel"
import { usePaymentMethodChannelList } from "../../../payment/client"
import { PlatformBucketSelect } from "../../../platform-management/PlatformBucket"

const FirstDeposit = "FirstDeposit"
const DailyFirstDeposit = "DailyFirstDeposit"
const DailySecondDeposit = "DailySecondDeposit"
const DepositReward = "DepositReward"

const DepositPaymentChannelReward = "PromoteDepositChannel"

export const PromotionTypes = [
  FirstDeposit,
  DailyFirstDeposit,
  DailySecondDeposit,
  DepositReward,
  DepositPaymentChannelReward
]

const Main = (props) => <MainSetting autoPayout={true} {...props} />

const DepositRewardMain = (props) => (
  <MainSetting autoPayout={true} totalFundsUnlimited={true} {...props} />
)

const Content = ContentSetting

const DepositPaymentRewardRule = ({ readOnly }) => {
  let brandId = usePromotionBrandId()
  let {
    isLoading,
    data: paymentMethodChannelList,
    error
  } = usePaymentMethodChannelList()
  let paymentChannelIds = paymentMethodChannelList?.allData?.map(
    ({ channelId }) => channelId
  )

  let totalFunds = useTotalFunds()

  let disabled = readOnly

  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <BucketTypeLabel />
      <PlatformBucketSelect name="rule.bucketType" platformId={brandId} />

      <NormalLabel>
        <Trans zh="金流渠道" en="Payment Channel" />
      </NormalLabel>
      <PaymentChannelSelect
        name="rule.channelIds[0]"
        range={paymentChannelIds}
        required
        disabled={disabled}
      />

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

const DepositRewardRule = ({ readOnly }) => {
  let { control } = useFormContext()
  let brandId = usePromotionBrandId()
  let totalFunds = useTotalFunds()
  let disabled = readOnly

  let PercentageField = "rule.percentage"
  let percentage = useWatch({
    control,
    name: PercentageField
  })

  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <BucketTypeLabel />
      <PlatformBucketSelect name="rule.bucketType" platformId={brandId} />

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

const BucketTypeLabel = () => {
  return (
    <NormalLabel>
      <Trans zh="活动游戏类型" en="Game Type" />
    </NormalLabel>
  )
}

const DefaultRule = ({ readOnly }) => {
  let { control } = useFormContext()
  let totalFunds = useTotalFunds()
  let brandId = usePromotionBrandId()

  let disabled = readOnly
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <BucketTypeLabel />
      <PlatformBucketSelect name="rule.bucketType" platformId={brandId} />

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

export const Rewards = [
  {
    PromotionType: DepositReward,
    Main: DepositRewardMain,
    Content,
    Rule: DepositRewardRule
  },
  {
    PromotionType: FirstDeposit,
    Main,
    Content,
    Rule: DefaultRule
  },
  {
    PromotionType: DailyFirstDeposit,
    Main,
    Content,
    Rule: DefaultRule
  },
  {
    PromotionType: DailySecondDeposit,
    Main,
    Content,
    Rule: DefaultRule
  },
  {
    PromotionType: DepositPaymentChannelReward,
    Main,
    Content,
    Rule: DepositPaymentRewardRule
  }
]

export default Rewards
