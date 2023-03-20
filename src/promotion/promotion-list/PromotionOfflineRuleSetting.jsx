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
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { usePromotionType } from "./edit"
import { FieldValues } from "../../layout/Grid"
import { PromotionBatchUploadPlayerListFieldBox } from "./PromotionBatchUploadPlayerListFieldBox"
import { NormalLabel } from "../../form/Label"
import { NumberInput, NumberInputField } from "../../input/NumberInput"

const LoginReward = "OfflineLoginReward"

export const PromotionOfflineRuleSetting = ({ readOnly }) => {
  let promotionType = usePromotionType()

  switch (promotionType) {
    case LoginReward:
      return <LoginRewardRuleSetting />
    default:
      return null
  }
}

const LoginRewardRuleSetting = ({ readOnly }) => {
  let disabled = readOnly
  return (
    <FieldValues>
      <PromotionBatchUploadPlayerListFieldBox />

      <NormalLabel>
        <Trans zh="彩金金额" en="Bonus Amount" />
      </NormalLabel>
      <NumberInput
        name="bonusAmount"
        min="0"
        required
        disabled={disabled}
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
      </NormalLabel>
      <NumberInputField
        name="turnoverMultiple"
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

const DepositRewardRuleSetting = ({}) => {}
