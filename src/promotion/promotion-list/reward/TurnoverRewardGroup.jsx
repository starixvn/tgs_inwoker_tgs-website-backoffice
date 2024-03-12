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
import { Trans, useTrans } from "../../../i18n"
import { FieldValues } from "../../../layout/Grid"
import { NormalLabel } from "../../../form/Label"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../../input/NumberInput"
import { useTotalFunds } from "../field/TotalFundsField"
import { PlayerAutoJoinField } from "../field/PlayerAutoJoinField"
import { VipLevelCheckboxGroupField } from "../field/VipLevelCheckboxGroupField"
import { GameTypeSelectField } from "../field/GameTypeSelectField"
import { GameProviderSelectField } from "../field/GameProviderSelectField"
import { MainSetting } from "../MainSetting"
import { ContentSetting } from "../ContentSetting"
import { PromotionTurnoverRequirementTrans } from "../../../trans/Promotion"
import { MultipliersTrans } from "../../../trans/Field"

const DailyTurnoverRebate = "TurnoverRebate"
const WeeklyTurnoverRebate = "TurnoverRebateWeekly"

export const PromotionTypes = [DailyTurnoverRebate, WeeklyTurnoverRebate]

export const Main = (props) => <MainSetting autoPayout={true} {...props} />

export const Content = ContentSetting

//TODO: remove DailyTurnoverSetting and use DefaultSetting when backend api support "流水门槛" setting
const DailyTurnoverRule = ({ readOnly }) => {
  let totalFunds = useTotalFunds()
  let disabled = readOnly
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <GameTypeSelectField readOnly={readOnly} />

      <GameProviderSelectField readOnly={readOnly} />

      <PlayerAutoJoinField readOnly={readOnly} disabled={disabled} />
      {/* <NormalLabel>
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
      /> */}

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

const Rule = ({ readOnly }) => {
  let totalFunds = useTotalFunds()
  let disabled = readOnly
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField readOnly={readOnly} />

      <GameTypeSelectField readOnly={readOnly} />

      <GameProviderSelectField readOnly={readOnly} />

      <PlayerAutoJoinField readOnly={readOnly} disabled={disabled} />
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
    PromotionType: DailyTurnoverRebate,
    Main,
    Content,
    Rule: DailyTurnoverRule
  },
  {
    PromotionType: WeeklyTurnoverRebate,
    Main,
    Content,
    Rule
  }
]

export default Rewards

//TODO: rm
export const TurnoverRewardRuleSetting = ({ promotionType, readOnly }) => {
  switch (promotionType) {
    case DailyTurnoverRebate:
      return <DailyTurnoverRule readOnly={readOnly} />
    default:
      return <Rule readOnly={readOnly} />
  }
}
