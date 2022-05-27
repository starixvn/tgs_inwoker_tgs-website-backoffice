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
  Modal,
  Card,
  Flex,
  Heading,
  FieldStack,
  Table,
  Stack
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  NewDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { Trans, useTrans } from "../../i18n"
import {
  useForm,
  useFormContext,
  useWatch,
  Controller,
  useFieldArray
} from "react-hook-form"
import {
  PromotionTypeGroup,
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  usePromotionGroupValueOf
} from "../PromotionType"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import Input from "../../input/Input"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import clone from "clone-deep"
import Backdrop from "../../dialog/Backdrop"
import { ConfirmText } from "../../button/ActionButtons"
import { sumBy } from "lodash-es"
import AlertDialog, { AlertDialogModal } from "../../dialog/Alert"
import { Switch } from "../../switch/Switch"
import { isNil, isEmpty, either, complement, prop, all, compose } from "ramda"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"

export const PromotionLotteryRuleSetting = ({ promotionType, ...props }) => {
  switch (promotionType) {
    default:
      return <PromotionRouletteRuleSetting {...props} />
  }
}

export const PromotionRouletteRuleSetting = ({ ...props }) => {
  return (
    <FieldValues>
      <NormalLabel>
        <Trans zh="轮盘设置" en="Roulette Setting" />
      </NormalLabel>
      <SettingDisclosure width="fit-content" {...props} />
    </FieldValues>
  )
}

const WinningProbabilityFieldName = "winningProbability"

const validateTotalWinningProbability = (fieldName, settings = []) => {
  let totalChancePercentage = sumBy(settings, fieldName)
  let pass = totalChancePercentage === 100
  return pass
}

let isNilOrEmpty = either(isNil, isEmpty)
let hasValue = complement(isNilOrEmpty)

const validateAll = (predicate, settings = []) => {
  let pass = all(predicate, settings)

  return pass
}

const validateAllRequired = (fieldName, settings = []) => {
  let toField = prop(fieldName)
  let hasFieldValue = compose(hasValue, toField)
  let pass = validateAll(hasFieldValue, settings)
  return pass
}

const ListFieldName = "rule"
const SettingDisclosure = ({ name = ListFieldName, readOnly, ...props }) => {
  let dialog = useModalState()

  let { control, setValue } = useFormContext()
  let defaultValue = useWatch({
    control,
    name,
    defaultValue: Array.from({ length: 6 }, (x, i) => ({}))
  })

  let disabled = readOnly
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: true,
        validate: (settings) => {
          if (disabled) {
            return true
          }

          let passTotalChancePercentage = validateTotalWinningProbability(
            WinningProbabilityFieldName,
            settings
          )
          if (!passTotalChancePercentage) {
            return "TotalChancePercentage"
          }

          return true
        }
      }}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isTouched, isDirty, error }
      }) => {
        let palette = error ? "danger" : "default"
        let variant = error ? "outlined" : "default"
        return (
          <>
            <Disclosure
              id="setting-dialog-disclosure"
              {...dialog}
              palette={palette}
              variant={variant}
              {...props}
            >
              <Trans zh="设置" en="Setting" />
            </Disclosure>
            {dialog.visible && (
              <SettingDialog
                record={value}
                onChange={(data) => {
                  let editable = !readOnly
                  if (editable) {
                    console.log(`setValue ${name} > `, data)
                    setValue(name, data, { shouldValidate: true })
                  }
                }}
                readOnly={readOnly}
                dialog={dialog}
              />
            )}
          </>
        )
      }}
    />
  )
}

const SettingDialog = ({ record = [], readOnly, dialog, onChange }) => {
  let title = useTrans({
    zh: "轮盘设置",
    en: "Roulette Setting"
  })

  let editable = !readOnly
  let defaultValues = {}
  Reflect.set(defaultValues, ListFieldName, clone(record))

  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={defaultValues}
        onSubmit={(data) => {
          onChange?.(Reflect.get(data, ListFieldName))
          dialog.hide()
        }}
        stopPropagation={true}
        dialog={dialog}
        hideBackdrop
        title={title}
        submitText={<ConfirmText />}
        showActionButtons={editable}
        footer={
          !editable && <CloseButtonFooter dialog={dialog} alignX="right" />
        }
        width="max-content"
        maxWidth="90vw"
        css={css`
          & .bb-DialogContent {
            height: max-content;
            max-height: 90vh;
          }
        `}
      >
        <FormBody readOnly={readOnly} />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = ({ name = ListFieldName, readOnly, ...props }) => {
  let { control, register, formState } = useFormContext()

  let fieldArray = useFieldArray({
    control,
    name,
    keyName: "_id"
  })

  let values = useWatch({
    name,
    control
  })

  let totalChancePercentageMessage = useTrans({
    zh: "中奖机率加总须为100",
    en: "Winning probability must add up to 100"
  })
  let [errors, setErrors] = useState([])
  return (
    <>
      <Table>
        <Table.Head position="sticky" top="0">
          <Table.Row>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="名称" en="Name" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="彩金" en="Bonus" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="中奖机率 %" en="Winning Probability %" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="流水倍数" en="Turnover Requirement" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="中奖次数/天" en="Winning Limit / Day" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="预设" en="Default" />
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
              readOnly={readOnly}
            />
          ))}
        </Table.Body>
      </Table>
      <Controller
        name="totalWinningProbability"
        control={control}
        rules={{
          validate: () => {
            let pass = validateTotalWinningProbability(
              WinningProbabilityFieldName,
              values
            )
            if (formState.isSubmitting && !pass) {
              setErrors([totalChancePercentageMessage])
            }
            return pass ? true : totalChancePercentageMessage
          }
        }}
        render={({ field, fieldState: { error }, formState }) => {
          return null
        }}
      />
      {errors?.length > 0 && (
        <AlertDialog
          errors={errors}
          placement="center"
          onClickClose={() => {
            setErrors([])
          }}
        />
      )}
    </>
  )
}

const SettingRow = ({
  name,
  field,
  index,
  fieldArray,
  readOnly,
  chancePercentageFieldName = WinningProbabilityFieldName
}) => {
  let { setValue, getValues, formState, control } = useFormContext()

  let BonusFieldName = `${name}.${index}.bonus`
  let bouns = useWatch({
    control,
    name: BonusFieldName
  })

  let editable = !readOnly
  let disabled = readOnly
  return (
    <Table.Row data-index={index}>
      <Table.Cell>
        <Box>
          {index + 1}
          {field.id && (
            <Input
              type="hidden"
              name={`${name}.${index}.id`}
              value={field.id}
            />
          )}
        </Box>
      </Table.Cell>
      <Table.Cell>
        <Input
          name={`${name}.${index}.title`}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={10}
          size="small"
          required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={BonusFieldName}
          readOnly={readOnly}
          disabled={disabled}
          min={0}
          max={10000}
          size="small"
          registerOptions={{
            valueAsNumber: true
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.${chancePercentageFieldName}`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.chancePercentage}
          registerOptions={{
            valueAsNumber: true
          }}
          min={0}
          max={100}
          required
          size="small"
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.turnoverRate`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.turnoverRate}
          registerOptions={{
            valueAsNumber: true
          }}
          min={bouns > 1 ? 1 : 0}
          required
          size="small"
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.dailyWinningLimit`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.dailyWinningLimit}
          registerOptions={{
            valueAsNumber: true
          }}
          min={0}
          required
          size="small"
        />
      </Table.Cell>
      <Table.Cell>
        <Switch
          name={`${name}.${index}.isDefault`}
          readOnly={readOnly}
          disabled={disabled}
          registerOptions={{
            validate: () => {
              let defaultNames = fieldArray.fields.map(
                (_, fieldIndex) => `${name}.${fieldIndex}.isDefault`
              )
              let values = getValues(defaultNames)
              let checkedValues = values.filter((bool) => bool)
              return checkedValues.length === 1 ? true : "OneDefault"
            }
          }}
          onChange={(event) => {
            let checked = event.target.checked
            if (checked) {
              fieldArray.fields.map((_, fieldIndex) => {
                if (fieldIndex != index) {
                  setValue(`${name}.${fieldIndex}.isDefault`, false)
                }
              })
            }
          }}
        />
      </Table.Cell>
    </Table.Row>
  )
}
