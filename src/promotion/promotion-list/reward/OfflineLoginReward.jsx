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
  FieldStack,
  Table,
  Group
} from "bumbag"
import { FormattedNumberDecimal, Trans, useTrans } from "../../../i18n"
import {
  useForm,
  useFormContext,
  useWatch,
  Controller,
  useFieldArray
} from "react-hook-form"
import { useIsAddPromotion, useIsPromotionAdded } from "../usePromotionFormData"
import { FieldValues } from "../../../layout/Grid"
import { BatchUploadPlayerListField } from "../field/BatchUploadPlayerListField"
import { NormalLabel } from "../../../form/Label"
import { NumberInput, NumberInputField } from "../../../input/NumberInput"
import { useMount } from "react-use"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { MainSetting } from "../MainSetting"
import {
  PromotionBonusAmountTrans,
  PromotionTurnoverRequirementTrans
} from "../../../trans/Promotion"
import { MultipliersTrans } from "../../../trans/Field"

const PromotionType = "OfflineLoginReward"

const Main = (props) => (
  <MainSetting autoPayout={true} totalFundsUnlimited={true} {...props} />
)

const Content = null

const Rule = ({ readOnly }) => {
  let isAdded = useIsPromotionAdded()
  let isCreate = useIsAddPromotion()

  if (isAdded) {
    readOnly = true
  }

  let BonusAmountField = isAdded ? `rule.bonusAmount` : "bonusAmount"
  let TurnoverMultipleField = isAdded
    ? `rule.turnoverMultiple`
    : "turnoverMultiple"

  let disabled = readOnly
  return (
    <FieldValues>
      {isCreate && <BatchUploadPlayerListField />}

      <NormalLabel>
        <PromotionBonusAmountTrans />
      </NormalLabel>
      <NumberInput
        name={BonusAmountField}
        min="0"
        required
        disabled={disabled}
        registerOptions={{
          valueAsNumber: true
        }}
      />

      <NormalLabel>
        <PromotionTurnoverRequirementTrans />
      </NormalLabel>
      <NumberInputField
        name={TurnoverMultipleField}
        registerOptions={{
          valueAsNumber: true
        }}
        min="0"
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

export default {
  PromotionType,
  Main,
  Content,
  Rule
}
