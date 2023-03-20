import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  FieldStack,
  Table,
  Button,
  Icon,
  Group,
  useModalState,
  Text
} from "bumbag"
import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch
} from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import clone from "clone-deep"
import { Input, InputField } from "../../input/Input"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import {
  MaxNumber,
  NumberInput,
  PercentageNumberInputField
} from "../../input/NumberInput"

export const AllAgentProfitSharingSetting = ({
  name,
  maxLevelSize = MaxNumber,
  profitSharingPercentageFieldName = "dividendPercentage",
  maxProfitSharingPercentage,
  activeNumberLabel = <Trans zh="活跃人数" en="Active Player" />,
  netProfitLabel = <Trans zh="净盈利" en="Net Profit" />,
  profitSharingPercentageLabel = <Trans zh="返佣比例" en="Rebate PT" />,
  readOnly
}) => {
  let editable = !readOnly
  let { control, watch } = useFormContext()

  let fieldArray = useFieldArray({
    control,
    name,
    keyName: "_id"
  })

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell>
            <Box></Box>
          </Table.HeadCell>
          <Table.HeadCell
            css={css`
              text-transform: none;
            `}
          >
            {activeNumberLabel}
          </Table.HeadCell>
          <Table.HeadCell
            css={css`
              text-transform: none;
            `}
          >
            {netProfitLabel}
          </Table.HeadCell>
          <Table.HeadCell
            css={css`
              text-transform: none;
            `}
          >
            {profitSharingPercentageLabel}
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {fieldArray.fields.map((field, index) => (
          <SettingRow
            name={name}
            key={field._id}
            field={field}
            index={index}
            fieldArray={fieldArray}
            profitSharingPercentageFieldName={profitSharingPercentageFieldName}
            maxProfitSharingPercentage={maxProfitSharingPercentage}
            readOnly={readOnly}
          />
        ))}
        {readOnly && !fieldArray.fields.length && (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={4}>
              <Trans zh="无资料" en="No Data" />
            </Table.Cell>
          </Table.Row>
        )}
        {editable && fieldArray.fields.length < maxLevelSize && (
          <AddRow
            fieldArray={fieldArray}
            profitSharingPercentageFieldName={profitSharingPercentageFieldName}
          />
        )}
      </Table.Body>
    </Table>
  )
}

const AddRow = ({ fieldArray, profitSharingPercentageFieldName }) =>
  useMemo(
    () => (
      <Table.Row id={`add-profit-sharing-setting`}>
        <Table.HeadCell>
          <Button
            id="add-profit-sharing-setting"
            size="small"
            variant="ghost"
            onClick={(event) => {
              let field = {
                netProfit: null,
                activeNumber: null
              }
              Reflect.set(field, profitSharingPercentageFieldName, null)
              fieldArray.append(field)
            }}
          >
            <Icon icon={faPlus} type="font-awesome" />
          </Button>
        </Table.HeadCell>
        <Table.HeadCell colSpan="3"></Table.HeadCell>
      </Table.Row>
    ),
    [fieldArray]
  )

const DefaultMinSetting = {
  netProfit: 0,
  activeNumber: 0
}

const SettingRow = ({
  name,
  field,
  index,
  fieldArray,
  readOnly,
  profitSharingPercentageFieldName,
  maxProfitSharingPercentage
}) => {
  let { control, setValue } = useFormContext()
  let previous = useWatch({
    control,
    name: `${name}.${index - 1}`
  })
  /*
  TODO: rm?
  let next = useWatch({
    control,
    name: `${name}.${index + 1}`
  })
  */

  let editable = !readOnly
  let disabled = readOnly

  let RankFieldName = `${name}.${index}.rank`
  useEffect(() => {
    setValue(RankFieldName, index + 1)
  }, [index])
  return (
    <>
      <Table.Row data-index={index}>
        <Table.Cell>
          <Box>
            {editable && (
              <Button
                size="small"
                palette="danger"
                variant="ghost"
                onClick={(event) => {
                  fieldArray.remove(index)
                }}
              >
                <Icon icon={faMinus} type="font-awesome" />
              </Button>
            )}
            <Input
              type="hidden"
              name={RankFieldName}
              value={index + 1}
              registerOptions={{
                valueAsNumber: true
              }}
            />
          </Box>
        </Table.Cell>
        <Table.Cell id="activeNumber">
          <NumberInput
            name={`${name}.${index}.activeNumber`}
            readOnly={readOnly}
            disabled={disabled}
            defaultValue={field.activeNumber}
            registerOptions={{
              valueAsNumber: true
            }}
            min={Math.max(
              ...[
                DefaultMinSetting.activeNumber,
                previous?.activeNumber
              ].filter(Number.isFinite)
            )}
            /*
            max={Math.min(
              ...[MaxNumber, next?.activeNumber].filter(Number.isFinite)
            )}
            */
            required
          />
        </Table.Cell>
        <Table.Cell id="netProfit">
          <NumberInput
            name={`${name}.${index}.netProfit`}
            readOnly={readOnly}
            disabled={disabled}
            defaultValue={field.netProfit}
            registerOptions={{
              valueAsNumber: true
            }}
            min={Math.max(
              ...[DefaultMinSetting.netProfit, previous?.netProfit].filter(
                Number.isFinite
              )
            )}
            /*
            max={Math.min(
              ...[MaxNumber, next?.netProfit].filter(Number.isFinite)
            )}
            */
            required
          />
        </Table.Cell>
        <Table.Cell id={profitSharingPercentageFieldName}>
          <ProfitSharingPercentageNumberInputField
            fieldArrayName={name}
            index={index}
            fieldName={profitSharingPercentageFieldName}
            maxProfitSharingPercentage={maxProfitSharingPercentage}
            field={field}
            readOnly={readOnly}
            disabled={disabled}
            registerOptions={{
              valueAsNumber: true
            }}
            required
          />
        </Table.Cell>
      </Table.Row>
    </>
  )
}

const ProfitSharingPercentageNumberInputField = ({
  fieldArrayName,
  index,
  fieldName,
  field = {},
  maxProfitSharingPercentage,
  ...props
}) => {
  let defaultValue = Reflect.get(field, fieldName)

  const MinProfitSharingPercentage = 0
  const MaxProfitSharingPercentage = maxProfitSharingPercentage ?? 100

  return (
    <PercentageNumberInputField
      name={`${fieldArrayName}.${index}.${fieldName}`}
      registerOptions={{
        valueAsNumber: true
      }}
      defaultValue={defaultValue}
      min={MinProfitSharingPercentage}
      max={MaxProfitSharingPercentage}
      {...props}
    />
  )
}
