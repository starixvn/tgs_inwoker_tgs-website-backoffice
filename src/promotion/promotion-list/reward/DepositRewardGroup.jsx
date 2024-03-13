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
import { GameTypeTrans } from "../../../trans/Game"
import {
  PromotionBonusLimitTrans,
  PromotionBonusPercentageTrans,
  PromotionTurnoverRequirementTrans,
  usePromotionBonusAmountLimitHintTrans,
  usePromotionBucketTypeNotSpecifyTrans
} from "../../../trans/Promotion"
import { MultipliersTrans } from "../../../trans/Field"
import { isEmpty, isNil } from "lodash-es"
import { either, complement } from "ramda"

let isNilOrEmpty = either(isNil, isEmpty)
let notEmpty = complement(isNilOrEmpty)

const FirstDeposit = "FirstDeposit" //Account First Deposit-Lifetime only
const AccountFirstDeposit = "AccountFirstDeposit" //Account First Deposit-First deposit only

const DailyFirstDeposit = "DailyFirstDeposit"
const DailySecondDeposit = "DailySecondDeposit"
const DepositReward = "DepositReward"

const DepositPaymentChannelReward = "PromoteDepositChannel"

//TODO: able to rm PromotionTypes? used somewhere?
export const PromotionTypes = [
  FirstDeposit,
  AccountFirstDeposit,
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

const BucketTypeSelect = ({
  name = "rule.bucketTypes[0]",
  brandId,
  disabled,
  bucketTypePlaceholder
}) => {
  return (
    <PlatformBucketSelect
      name={name}
      defaultValue=""
      platformId={brandId}
      disabled={disabled}
      placeholder={bucketTypePlaceholder}
    />
  )
}

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

  let bucketTypePlaceholder = usePromotionBucketTypeNotSpecifyTrans()

  let disabled = readOnly

  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <BucketTypeLabel />
      <BucketTypeSelect
        brandId={brandId}
        disabled={disabled}
        placeholder={bucketTypePlaceholder}
      />

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
        <PromotionBonusPercentageTrans />
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
        <PromotionBonusLimitTrans />
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
        <PromotionTurnoverRequirementTrans />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        registerOptions={{
          valueAsNumber: true
        }}
        min="1"
        required
        disabled={disabled}
        addonAfter={
          <Button isStatic tabIndex="-1">
            <MultipliersTrans />
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

  let bucketTypePlaceholder = usePromotionBucketTypeNotSpecifyTrans()

  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <BucketTypeLabel />
      <BucketTypeSelect
        brandId={brandId}
        disabled={disabled}
        placeholder={bucketTypePlaceholder}
      />

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
        <PromotionBonusPercentageTrans />
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
        <PromotionTurnoverRequirementTrans />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        registerOptions={{
          valueAsNumber: true
        }}
        min="1"
        required
        disabled={disabled}
        addonAfter={
          <Button isStatic tabIndex="-1">
            <MultipliersTrans />
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

  let bonusAmountLimitHintLabel = usePromotionBonusAmountLimitHintTrans()
  let bonusAmountLimitHint = bonusAmountLimit / (percentage / 100)
  return (
    <>
      <NormalLabel>
        <PromotionBonusLimitTrans />
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
      <GameTypeTrans />
    </NormalLabel>
  )
}

const DefaultRule = ({ readOnly }) => {
  let { control } = useFormContext()
  let totalFunds = useTotalFunds()
  let brandId = usePromotionBrandId()

  let bucketTypePlaceholder = usePromotionBucketTypeNotSpecifyTrans()

  let disabled = readOnly
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <BucketTypeLabel />
      <BucketTypeSelect
        brandId={brandId}
        disabled={disabled}
        placeholder={bucketTypePlaceholder}
      />

      <NormalLabel>
        <PromotionBonusPercentageTrans />
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
        <PromotionBonusLimitTrans />
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
        <PromotionTurnoverRequirementTrans />
      </NormalLabel>
      <NumberInputField
        name="rule.turnoverMultiple"
        registerOptions={{
          valueAsNumber: true
        }}
        min="1"
        required
        disabled={disabled}
        addonAfter={
          <Button isStatic tabIndex="-1">
            <MultipliersTrans />
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
    PromotionType: AccountFirstDeposit,
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
