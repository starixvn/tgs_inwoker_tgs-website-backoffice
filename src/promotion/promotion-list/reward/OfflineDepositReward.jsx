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
import { useIsPromotionAdded, usePromotionType } from "../edit"
import { FieldValues } from "../../../layout/Grid"
import { BatchUploadPlayerListField } from "../field/BatchUploadPlayerListField"
import { NormalLabel } from "../../../form/Label"
import { NumberInput, NumberInputField } from "../../../input/NumberInput"
import { useMount } from "react-use"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { MainSetting } from "../MainSetting"

const PromotionType = "OfflineDepositReward"

const Main = (props) => (
  <MainSetting autoPayout={true} totalFundsUnlimited={true} {...props} />
)

const Content = null

const Rule = ({ readOnly }) => {
  let isAdded = useIsPromotionAdded()
  let isCreate = !isAdded

  if (isAdded) {
    readOnly = true
  }

  let TurnoverMultipleField = isAdded ? `rule.bucketRate` : "turnoverMultiple"

  let disabled = readOnly
  return (
    <FieldValues>
      {isCreate && <BatchUploadPlayerListField />}

      <NormalLabel>
        <Trans zh="流水倍数" en="Turnover Requirement" />
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
            <Trans zh="倍" en="Multipliers" />
          </Button>
        }
      />

      <DepositRewardRangeFieldArray readOnly={readOnly} />
    </FieldValues>
  )
}

const DepositRewardRangeFieldArray = ({ readOnly }) => {
  let isAdded = useIsPromotionAdded()
  let isAdd = !isAdded
  let name = isAdded ? "rule.hierarchy.phases" : "phases"

  let { control } = useFormContext()

  let fieldArray = useFieldArray({
    control,
    name,
    keyName: "_id",
    shouldUnregister: true
  })

  useMount(() => {
    if (fieldArray.fields.length === 0) {
      fieldArray.append({}) //init default row
    }
  })

  return (
    <>
      <NormalLabel>
        <Trans zh="存款区间设置" en="Deposit Range Settings" />
      </NormalLabel>
      <Set orientation="vertical" isFilled>
        {fieldArray.fields?.map((field, index) => (
          <RewardSetting
            name={name}
            key={field._id}
            field={field}
            index={index}
            fieldArray={fieldArray}
            readOnly={readOnly}
          />
        ))}
        {isAdd && !readOnly && <AddRewardSetting fieldArray={fieldArray} />}
      </Set>
    </>
  )
}

const MinNumber = 0
const RewardSetting = ({
  name,
  field,
  index,
  fieldArray,
  readOnly,
  conditionFieldName = "condition",
  bonusFieldName = "bonus"
}) => {
  let { control } = useFormContext()

  let previous = useWatch({
    control,
    name: `${name}.${index - 1}`
  })

  let disabled = readOnly
  return (
    <Set orientation="horizontal" isFilled>
      <Group flex="1">
        <Button isStatic tabIndex="-1">
          <Trans zh="存款金额" en="Deposit Amount" />
        </Button>
        <NumberInput
          data-type={conditionFieldName}
          name={`${name}.${index}.${conditionFieldName}`}
          readOnly={readOnly}
          disabled={disabled}
          min={Math.max(
            ...[MinNumber, previous?.condition].filter(Number.isFinite)
          )}
          required
          registerOptions={{
            valueAsNumber: true
          }}
          flex="1"
        />
      </Group>
      <Group flex="1">
        <Button isStatic tabIndex="-1">
          <Trans zh="彩金" en="Bonus" />
        </Button>
        <NumberInput
          data-type={bonusFieldName}
          name={`${name}.${index}.${bonusFieldName}`}
          readOnly={readOnly}
          disabled={disabled}
          min="0"
          // min={Math.max(
          //   ...[MinNumber, previous?.bonus].filter(Number.isFinite)
          // )}
          required
          registerOptions={{
            valueAsNumber: true
          }}
          flex="1"
        />
      </Group>
    </Set>
  )
}

const AddRewardSetting = ({ fieldArray }) =>
  useMemo(
    () => (
      <Box alignX="right">
        <Button
          id="add-setting"
          onClick={(event) => {
            fieldArray.append({})
          }}
        >
          <Icon icon={faPlus} type="font-awesome" />
        </Button>
      </Box>
    ),
    [fieldArray]
  )

export default {
  PromotionType,
  Main,
  Content,
  Rule
}
