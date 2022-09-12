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
  MaxNumber,
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
import { get, set } from "lodash-es"
import Big from "big.js"
import { useMount, useMeasure } from "react-use"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useIsActivePromotion } from "./edit"

export const DepositLottery = "DepositAccumulateRoulette"

export const PromotionDepositLotteryRuleSetting = ({ readOnly, ...props }) => {
  let isActive = useIsActivePromotion()
  readOnly = readOnly || isActive
  return (
    <FieldValues>
      <NormalLabel>
        <Trans zh="存款累計设置" en="Multi-Deposit Setting" />
      </NormalLabel>
      <BasicSettingListDisclosure
        readOnly={readOnly}
        width="fit-content"
        {...props}
      />

      <NormalLabel>
        <Trans zh="轮盘设置" en="Roulette Setting" />
      </NormalLabel>
      <RouletteSettingDisclosure
        readOnly={readOnly}
        width="fit-content"
        {...props}
      />
    </FieldValues>
  )
}

const RuleFieldName = "rule"
const SettingListFieldName = "depositItems"
const DepositFieldName = "accumulateAmount"

const BasicSettingListDisclosure = ({
  name = `${RuleFieldName}.${SettingListFieldName}`,
  readOnly,
  limitedTotalAmount,
  totalAmountLimit,
  ...props
}) => {
  let dialog = useModalState()

  let { control, setValue } = useFormContext()

  let defaultValue = useWatch({
    control,
    name,
    defaultValue: Array.from({ length: 1 }, (x, index) => {
      return {}
    })
  })

  let disabled = readOnly
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={true}
      rules={{
        required: true,
        validate: (items) => {
          if (disabled) {
            return true
          }

          let pass = validateAllRequired(DepositFieldName, items)
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
              id="basic-setting-dialog-disclosure"
              {...dialog}
              palette={palette}
              variant={variant}
              {...props}
            >
              <Trans zh="设置" en="Setting" />
            </Disclosure>
            {dialog.visible && (
              <BasicSettingDialog
                items={value}
                limitedTotalAmount={limitedTotalAmount}
                totalAmountLimit={totalAmountLimit}
                onChange={(items) => {
                  let editable = !readOnly
                  if (editable) {
                    setValue(name, items, { shouldValidate: true })
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

const BasicSettingDialog = ({
  items,
  limitedTotalAmount,
  totalAmountLimit,
  readOnly,
  dialog,
  onChange
}) => {
  let title = useTrans({
    zh: "存款累計设置",
    en: "Multi-Deposit Setting"
  })

  let editable = !readOnly
  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={{ items }}
        onSubmit={(data) => {
          onChange?.(data?.items)
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
        <BasicFormBody
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      </FormDialog>
    </Backdrop>
  )
}

const BasicFormBody = ({
  name = ItemsFieldName,
  limitedTotalAmount,
  totalAmountLimit,
  readOnly,
  ...props
}) => {
  let { control, register, formState } = useFormContext()

  let fieldArray = useFieldArray({
    control,
    name,
    keyName: "_id"
  })

  let editable = !readOnly
  return (
    <Box
      css={css`
        & .bb-Table {
          max-height: 80vh;
          overflow: auto;
        }
      `}
    >
      <Table>
        <Table.Head position="sticky" top="0" zIndex="1">
          <Table.Row>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="每日存款（累计）" en="Daily Deposit （Cumulative）" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="次数" en="Number of Times" />
            </Table.HeadCell>
            <Table.HeadCell minWidth="4.25rem"></Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {fieldArray.fields.map((field, index) => (
            <BasicSettingRow
              name={name}
              key={field._id}
              field={field}
              limitedTotalAmount={limitedTotalAmount}
              totalAmountLimit={totalAmountLimit}
              index={index}
              fieldArray={fieldArray}
              readOnly={readOnly}
            />
          ))}
          {editable && <AddSettingRow fieldArray={fieldArray} />}
        </Table.Body>
      </Table>
    </Box>
  )
}

const AddSettingRow = ({ fieldArray }) =>
  useMemo(
    () => (
      <Table.Row>
        <Table.HeadCell>
          <Button
            id="add-setting"
            size="small"
            variant="ghost"
            onClick={(event) => {
              fieldArray.append({})
            }}
          >
            <Icon icon={faPlus} type="font-awesome" />
          </Button>
        </Table.HeadCell>
        <Table.HeadCell colSpan="2"></Table.HeadCell>
      </Table.Row>
    ),
    [fieldArray]
  )

const MinNumber = 0

const BasicSettingRow = ({ name, field, index, fieldArray, readOnly }) => {
  let { setValue, getValues, formState, control } = useFormContext()

  let previous = useWatch({
    control,
    name: `${name}.${index - 1}`
  })
  let next = useWatch({
    control,
    name: `${name}.${index + 1}`
  })

  let editable = !readOnly
  let disabled = readOnly
  return (
    <Table.Row data-index={index}>
      <Table.Cell>
        <Box alignX="center">
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
        <NumberInput
          name={`${name}.${index}.${DepositFieldName}`}
          readOnly={readOnly}
          disabled={disabled}
          min={Math.max(
            ...[MinNumber, previous?.accumulateAmount].filter(Number.isFinite)
          )}
          max={Math.min(
            ...[MaxNumber, next?.accumulateAmount].filter(Number.isFinite)
          )}
          size="small"
          required
          registerOptions={{
            valueAsNumber: true
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.rouletteCount`}
          readOnly={readOnly}
          disabled={disabled}
          min={Math.max(
            ...[MinNumber, previous?.rouletteCount].filter(Number.isFinite)
          )}
          max={Math.min(
            ...[MaxNumber, next?.rouletteCount].filter(Number.isFinite)
          )}
          size="small"
          registerOptions={{
            valueAsNumber: true
          }}
          required
        />
      </Table.Cell>
      <Table.Cell>
        {index > 0 && (
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              fieldArray.remove(index)
            }}
          >
            <Icon icon={faMinus} type="font-awesome" />
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
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

  let pass = totalChancePercentage.toNumber() === 100
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

const RouletteListFieldName = "rouletteItems"
const TitleFieldName = "title"
const RouletteSettingDisclosure = ({
  name = `${RuleFieldName}.${RouletteListFieldName}`,
  readOnly,
  limitedTotalAmount,
  totalAmountLimit,
  ...props
}) => {
  let dialog = useModalState()

  let { control, setValue } = useFormContext()

  let defaultValue = useWatch({
    control,
    name,
    defaultValue: Array.from({ length: 12 }, (x, index) => {
      return {}
    })
  })

  let disabled = readOnly
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={true}
      rules={{
        required: true,
        validate: (items) => {
          if (disabled) {
            return true
          }

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
              id="roulette-setting-dialog-disclosure"
              {...dialog}
              palette={palette}
              variant={variant}
              {...props}
            >
              <Trans zh="设置" en="Setting" />
            </Disclosure>
            {dialog.visible && (
              <RouletteSettingDialog
                items={value}
                limitedTotalAmount={limitedTotalAmount}
                totalAmountLimit={totalAmountLimit}
                onChange={(items) => {
                  let editable = !readOnly
                  if (editable) {
                    // let items = get(data, RouletteListFieldName)
                    console.log(`setValue ${name} > `, items)
                    setValue(name, items, { shouldValidate: true })
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

const RouletteSettingDialog = ({
  items,
  limitedTotalAmount,
  totalAmountLimit,
  readOnly,
  dialog,
  onChange
}) => {
  let title = useTrans({
    zh: "轮盘设置",
    en: "Roulette Setting"
  })

  let editable = !readOnly

  items =
    items?.map((item) => {
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
          onChange?.(items)
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
        <RouletteFormBody
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      </FormDialog>
    </Backdrop>
  )
}

const ItemsFieldName = "items"
const RouletteFormBody = ({
  name = ItemsFieldName,
  limitedTotalAmount,
  totalAmountLimit,
  readOnly,
  ...props
}) => {
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
    zh: "中奖机率加总须等于100",
    en: "Total winning probability must be equal to 100"
  })
  let [errors, setErrors] = useState([])

  return (
    <Box
      css={css`
        & .bb-Table {
          max-height: 80vh;
          overflow: auto;
        }
      `}
    >
      <Table>
        <Table.Head position="sticky" top="0" zIndex="1">
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
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {fieldArray.fields.map((field, index) => (
            <RouletteSettingRow
              name={name}
              key={field._id}
              field={field}
              limitedTotalAmount={limitedTotalAmount}
              totalAmountLimit={totalAmountLimit}
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
    </Box>
  )
}

const RouletteSettingRow = ({
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
          required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.${chancePercentageFieldName}`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.winningProbability}
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
    </Table.Row>
  )
}
