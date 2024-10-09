import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Text, Set, Icon, Table, FieldStack, Stack, Button } from "bumbag"
import { MainSetting } from "../MainSetting"
import { ContentSetting } from "../ContentSetting"
import {
  HtmlEditorDisclosure,
  ContentBox as ContentBody
} from "../ContentSetting"
import { usePromotionBrandId } from "../usePromotionFormData"
import { NormalLabel } from "../../../form/Label"
import {
  MilestoneTrans,
  PromotionBonusAmountTrans,
  PromotionContentTrans,
  PromotionMinDepositTrans,
  PromotionMinValidBetTrans,
  PromotionRulesTrans,
  PromotionSubTitleTrans,
  PromotionTurnoverRequirementTrans,
  usePromotionBucketTypeNotSpecifyTrans
} from "../../../trans/Promotion"
import Input, { InputField } from "../../../input/Input"
import { FieldValues } from "../../../layout/Grid"
import { VipLevelCheckboxGroupField } from "../field/VipLevelCheckboxGroupField"
import { GameTypeTrans } from "../../../trans/Game"
import { PlatformBucketSelect } from "../../../platform-management/PlatformBucket"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { NumberInput } from "../../../input/NumberInput"
import { useMount } from "react-use"
import Separator from "../../../layout/Separator"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { OrderTrans } from "../../../trans/Field"

export const PromotionType = "Milestone"

export const Main = (props) => (
  <MainSetting totalFundsUnlimited={true} {...props} />
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

export const Rule = ({ readOnly }) => {
  let brandId = usePromotionBrandId()

  let bucketTypePlaceholder = usePromotionBucketTypeNotSpecifyTrans()

  let disabled = readOnly
  return (
    <>
      <FieldValues>
        <VipLevelCheckboxGroupField readOnly={readOnly} />

        <NormalLabel>
          <GameTypeTrans />
        </NormalLabel>
        <BucketTypeSelect
          brandId={brandId}
          disabled={disabled}
          placeholder={bucketTypePlaceholder}
        />
      </FieldValues>
      <Separator />
      <FieldStack>
        <NormalLabel
          css={css`
            margin-bottom: 1rem;
          `}
        >
          <MilestoneTrans />
        </NormalLabel>

        <MilestoneSettings readOnly={readOnly} />
      </FieldStack>
    </>
  )
}

const MilestoneFieldName = "rule.conditions"
const MilestoneSettings = ({ name = MilestoneFieldName, readOnly }) => {
  let { control } = useFormContext()

  let fieldArray = useFieldArray({
    control,
    name
  })

  useMount(() => {
    if (fieldArray.fields.length === 0) {
      fieldArray.append({}) //init default row
    }
  })

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell>
            <OrderTrans />
          </Table.HeadCell>
          <Table.HeadCell>
            <PromotionMinValidBetTrans />
          </Table.HeadCell>
          <Table.HeadCell>
            <PromotionMinDepositTrans />
          </Table.HeadCell>
          <Table.HeadCell>
            <PromotionBonusAmountTrans />
          </Table.HeadCell>
          <Table.HeadCell>
            <PromotionTurnoverRequirementTrans />
          </Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {fieldArray.fields.map((field, index) => (
          <SettingRow
            name={name}
            key={index}
            field={field}
            index={index}
            fieldArray={fieldArray}
            readOnly={readOnly}
          />
        ))}
        {!readOnly && <AddSettingRow fieldArray={fieldArray} />}
      </Table.Body>
    </Table>
  )
}

const RemoveButton = ({ index, fieldArray, ...props }) =>
  useMemo(
    () => (
      <Button
        size="small"
        palette="danger"
        variant="ghost"
        onClick={() => {
          fieldArray.remove(index)
        }}
        {...props}
      >
        <Icon icon={faMinus} type="font-awesome" />
      </Button>
    ),
    [index, fieldArray]
  )

const AddSettingRow = ({ fieldArray }) =>
  useMemo(
    () => (
      <Table.Row>
        <Table.Cell>
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              fieldArray.append({})
            }}
          >
            <Icon icon={faPlus} type="font-awesome" />
          </Button>
        </Table.Cell>
      </Table.Row>
    ),
    [fieldArray]
  )

const DefaultMinRow = 1

const SettingRow = ({
  name,
  field,
  index,
  fieldArray,
  readOnly,
  minRow = DefaultMinRow
}) => {
  let { control } = useFormContext()

  let BonusFieldName = `${name}.${index}.bonus`
  let bouns = useWatch({
    control,
    name: BonusFieldName
  })

  let disabled = readOnly

  return (
    <Table.Row data-index={index}>
      <Table.Cell textAlign={"center"}>
        <Box>
          {index + 1}
          <Input
            type="hidden"
            name={`${name}.${index}.level`}
            value={index}
            registerOptions={{
              valueAsNumber: true
            }}
          />
        </Box>
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.minimumValidBet`}
          readOnly={readOnly}
          disabled={disabled}
          min={1}
          size="small"
          registerOptions={{
            valueAsNumber: true
          }}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.minimumDeposit`}
          readOnly={readOnly}
          disabled={disabled}
          min={1}
          size="small"
          registerOptions={{
            valueAsNumber: true
          }}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={BonusFieldName}
          readOnly={readOnly}
          disabled={disabled}
          min={1}
          size="small"
          registerOptions={{
            valueAsNumber: true
          }}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.turnoverMultiple`}
          readOnly={readOnly}
          disabled={disabled}
          min={1}
          size="small"
          registerOptions={{
            valueAsNumber: true
          }}
          required
        />
      </Table.Cell>
      <Table.Cell>
        {!readOnly && (
          <RemoveButton
            index={index}
            fieldArray={fieldArray}
            css={css`
              visibility: ${fieldArray.fields.length > minRow
                ? "visible"
                : "hidden"};
            `}
          />
        )}
      </Table.Cell>
    </Table.Row>
  )
}

export default {
  PromotionType,
  Main,
  Content,
  Rule
}
