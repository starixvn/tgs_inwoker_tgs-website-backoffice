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
  Stack,
  Popover,
  Alert
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure,
  NewDisclosure,
  ViewDisclosure
} from "../../../dialog/Disclosure"
import FormDialog from "../../../form/FormDialog"
import { Trans, useTrans } from "../../../i18n"
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
} from "../../PromotionType"
import { FieldValues } from "../../../layout/Grid"
import { NormalLabel } from "../../../form/Label"
import Input from "../../../input/Input"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../../input/NumberInput"
import clone from "clone-deep"
import Backdrop from "../../../dialog/Backdrop"
import { ConfirmText } from "../../../button/ActionButtons"
import { sumBy } from "lodash-es"
import AlertDialog, { AlertDialogModal } from "../../../dialog/Alert"
import { Switch } from "../../../switch/Switch"
import { isNil, isEmpty, either, complement, prop, all, compose } from "ramda"
import { CloseButtonFooter } from "../../../form/ConfirmButtonFooter"
import { get, set } from "lodash-es"
import Big from "big.js"
import {
  DepositLottery,
  DepositLotteryRewardRuleSetting
} from "./DepositLotteryReward"
import { VipLevelCheckboxGroupField } from "../field/VipLevelCheckboxGroupField"

const Roulette = "Roulette"

export const LotteryRewardRuleSetting = ({ promotionType, ...props }) => {
  switch (promotionType) {
    case Roulette:
      return <PromotionRouletteRuleSetting {...props} />
    case DepositLottery:
      return <DepositLotteryRewardRuleSetting {...props} />
    default:
      return null
  }
}

export const PromotionRouletteRuleSetting = ({ ...props }) => {
  return (
    <FieldValues>
      <VipLevelCheckboxGroupField {...props} />

      <NormalLabel>
        <Trans zh="轮盘设置" en="Roulette Setting" />
      </NormalLabel>
      <SettingDisclosure width="fit-content" {...props} />
    </FieldValues>
  )
}

const WinningProbabilityFieldName = "winningProbability"

const validateTotalWinningPercentage = (fieldName, settings = []) => {
  let totalChancePercentage = settings.reduce((totalPercentage, setting) => {
    let percentage = get(setting, fieldName)
    if (Number.isFinite(percentage)) {
      totalPercentage = totalPercentage.plus(new Big(percentage))
    }
    return totalPercentage
  }, new Big(0))

  let pass = totalChancePercentage.toNumber() <= 100
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

const SettingFieldName = "rule"
const ListFieldName = "items"
const TitleFieldName = "title"
const SettingDisclosure = ({ name = SettingFieldName, readOnly, ...props }) => {
  let dialog = useModalState()

  let { control, setValue } = useFormContext()
  let defaultValue = useWatch({
    control,
    name,
    defaultValue: {
      items: Array.from({ length: 6 }, (x, index) => {
        return index == 0 ? { isDefault: true } : {}
      })
    }
  })

  let disabled = readOnly
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: true,
        validate: (data) => {
          if (disabled) {
            return true
          }

          let items = get(data, ListFieldName)
          let pass = validateAllRequired(TitleFieldName, items)
          return pass
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
                    let items = get(data, ListFieldName)
                    console.log(`setValue ${name} > `, data)
                    setValue(name, { items }, { shouldValidate: true })
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

const SettingDialog = ({ record = {}, readOnly, dialog, onChange }) => {
  let title = useTrans({
    zh: "轮盘设置",
    en: "Roulette Setting"
  })

  let editable = !readOnly

  let items =
    record?.items?.map((item) => {
      if (item.isDefault && editable) {
        //backend will update default's winningProbability value
        return {
          ...clone(item),
          winningProbability: undefined
        }
      }

      let winningProbability = get(item, WinningProbabilityFieldName)
      if (Number.isFinite(winningProbability)) {
        winningProbability = new Big(winningProbability)
          .times(new Big(100))
          .toNumber()
      }

      return {
        ...clone(item),
        winningProbability
      }
    }) ?? []

  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={{ items }}
        onSubmit={(data) => {
          let items = data.items.map((item) => {
            let winningProbability = get(item, WinningProbabilityFieldName)
            if (Number.isFinite(winningProbability)) {
              winningProbability = new Big(winningProbability)
                .div(new Big(100))
                .toNumber()
            }

            return {
              ...item,
              winningProbability
            }
          })
          onChange?.({ items })
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
    zh: "中奖机率加总须小于100",
    en: "Total winning probability must be less than 100"
  })
  let [errors, setErrors] = useState([])
  return (
    <>
      <Table>
        <Table.Head position="sticky" top="0">
          <Table.Row>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="奖项名称" en="Winning Content" />
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
            let pass = validateTotalWinningPercentage(
              WinningProbabilityFieldName,
              values
            )

            if (!pass) {
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

  let IsDefaultFieldName = `${name}.${index}.isDefault`
  let isDefault = useWatch({
    control,
    name: IsDefaultFieldName
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
          name={`${name}.${index}.${TitleFieldName}`}
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
          disabled={disabled || isDefault}
          defaultValue={field.winningProbability}
          registerOptions={{
            valueAsNumber: true
          }}
          min={0}
          max={100}
          required={!isDefault}
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
          disabled={disabled || isDefault}
          defaultValue={field.dailyWinningLimit}
          registerOptions={{
            valueAsNumber: true
          }}
          min={0}
          required={!isDefault}
          size="small"
        />
      </Table.Cell>
      <Table.Cell>
        {index === 0 && (
          <Box>
            <Switch name={IsDefaultFieldName} checked display="none" />
            <Switch
              checked
              disabled={disabled}
              /*
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
          */
            />
          </Box>
        )}
      </Table.Cell>
    </Table.Row>
  )
}
