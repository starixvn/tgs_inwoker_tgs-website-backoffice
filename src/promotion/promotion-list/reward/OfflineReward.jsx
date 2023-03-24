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
  Table
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

const LoginReward = "OfflineLoginReward"
const DepositReward = "OfflineDepositReward"

export const TypeList = [LoginReward, DepositReward]

export const OfflineRewardRuleSetting = ({ readOnly }) => {
  let promotionType = usePromotionType()

  switch (promotionType) {
    case LoginReward:
      return <LoginRewardRuleSetting />
    default:
      return null
  }
}

const LoginRewardRuleSetting = ({ readOnly }) => {
  let isAdded = useIsPromotionAdded()
  let isCreate = !isAdded

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
        <Trans zh="彩金金额" en="Bonus Amount" />
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
    </FieldValues>
  )
}

const DepositRewardRuleSetting = ({}) => {
  let isAdded = useIsPromotionAdded()
  let isCreate = !isAdded

  if (isAdded) {
    readOnly = true
  }

  return (
    <FieldValues>
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

      <DepositRewardRangeFieldArray />
    </FieldValues>
  )
}

const DepositRewardRangeFieldArray = ({ name = "phases" }) => {
  //TODO: need useWatch?
  /*
  let defaultValue = useWatch({
    control,
    name,
    defaultValue: Array.from({ length: 1 }, (x, index) => {
      return {}
    })  
  })
  */
  let { control, register, formState } = useFormContext()

  //TODO: test shouldUnregister
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

  //TODO: useColumns?
  return (
    <>
      <NormalLabel>
        <Trans zh="存款区间设置" en="Deposit Range Settings" />
      </NormalLabel>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="存款金额" en="Deposit Amount" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="彩金" en="Bonus" />
            </Table.HeadCell>
            {/* 
            TODO: need del btn?
            <Table.HeadCell minWidth="4.25rem"></Table.HeadCell> */}
          </Table.Row>
        </Table.Head>
        <Table.Body></Table.Body>
      </Table>
    </>
  )
}

const DepositRewardSettingRow = ({
  name,
  field,
  index,
  fieldArray,
  readOnly
}) => {
  let previous = useWatch({
    control,
    name: `${name}.${index - 1}`
  })
  return (
    <Table.Row data-index={index}>
      <Table.Cell>
        <Box alignX="center">{index + 1}</Box>
      </Table.Cell>
    </Table.Row>
  )
}
