import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import {
  Box,
  Button,
  Set,
  Text,
  useModalState,
  FieldStack,
  Table,
  Icon
} from "bumbag"
import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch
} from "react-hook-form"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import Disclosure, { ViewDisclosure } from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import FormDialog from "../../form/FormDialog"
import clone from "clone-deep"
import { FieldValues } from "../../layout/Grid"
import { PromotionTypeLabel, usePromotionGroupLabelOf } from "../PromotionType"
import {
  CloseButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import {
  MaxNumber,
  NumberInput,
  PercentageNumberInputField
} from "../../input/NumberInput"
import { NormalLabel } from "../../form/Label"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import Backdrop from "../../dialog/Backdrop"
import { ConfirmText } from "../../button/ActionButtons"
import Input from "../../input/Input"
import { get, set } from "lodash-es"
import { isNil, isEmpty, either, complement, prop, all, compose } from "ramda"

export const PromotionSigninRuleSetting = ({ ...props }) => {
  return (
    <FieldValues>
      <NormalLabel>
        <Trans zh="签到礼金设置" en="Sign-in Reward Setting" />
      </NormalLabel>
      <SettingDisclosure width="fit-content" {...props} />
    </FieldValues>
  )
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
const BonusFieldName = "bonus"
const SettingDisclosure = ({
  name = SettingFieldName,
  limitedTotalAmount,
  totalAmountLimit,
  readOnly,
  ...props
}) => {
  let dialog = useModalState()

  let { control, setValue } = useFormContext()
  let defaultValue = useWatch({
    control,
    name,
    defaultValue: {
      items: [{ bonus: undefined }]
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
          let items = get(data, ListFieldName)
          let pass = validateAllRequired(BonusFieldName, items)
          console.log("pass", pass, "")
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
              id="signin-setting-dialog-disclosure"
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
                limitedTotalAmount={limitedTotalAmount}
                totalAmountLimit={totalAmountLimit}
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

const SettingDialog = ({
  record = {},
  limitedTotalAmount,
  totalAmountLimit,
  readOnly,
  dialog,
  onChange
}) => {
  let title = useTrans({
    zh: "签到活动",
    en: "Sign-in Event Setting"
  })

  let editable = !readOnly
  let defaultValues = clone(record)

  return (
    <Backdrop {...dialog}>
      <FormDialog
        id="signin-setting-dialog"
        defaultValues={defaultValues}
        onSubmit={(data) => {
          onChange?.(data)
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
        minWidth="50vw"
        maxWidth="100vw"
      >
        <FormBody
          limitedTotalAmount={limitedTotalAmount}
          totalAmountLimit={totalAmountLimit}
          readOnly={readOnly}
        />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = ({
  name = ListFieldName,
  limitedTotalAmount,
  totalAmountLimit,
  readOnly
}) => {
  let editable = !readOnly
  let { control } = useFormContext()

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
          <Table.HeadCell>
            <Trans zh="天数" en="Days" />
          </Table.HeadCell>
          <Table.HeadCell>
            <Trans zh="礼金" en="Bonus" />
          </Table.HeadCell>
          <Table.HeadCell>
            <Trans zh="流水倍数" en="Turnover Requirement" />
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
            limitedTotalAmount={limitedTotalAmount}
            totalAmountLimit={totalAmountLimit}
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
        {editable && <AddRow fieldArray={fieldArray} />}
      </Table.Body>
    </Table>
  )
}

const Min = 0
const SettingRow = ({
  name,
  field,
  index,
  fieldArray,
  limitedTotalAmount,
  totalAmountLimit,
  readOnly
}) => {
  let { control, setValue } = useFormContext()
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

  let RankFieldName = `${name}.${index}.rank`
  useEffect(() => {
    //update rank when row got removed
    setValue(RankFieldName, index + 1)
  }, [index])

  return (
    <Table.Row>
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
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.days`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.days}
          registerOptions={{
            valueAsNumber: true
          }}
          min={Math.max(...[Min, previous?.days].filter(Number.isFinite))}
          max={Math.min(...[MaxNumber, next?.days].filter(Number.isFinite))}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.${BonusFieldName}`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.bonus}
          registerOptions={{
            valueAsNumber: true
          }}
          min={Math.max(...[Min, previous?.bonus].filter(Number.isFinite))}
          max={Math.min(
            ...[
              MaxNumber,
              limitedTotalAmount ? totalAmountLimit : undefined,
              next?.bonus
            ].filter(Number.isFinite)
          )}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.wageringRequirement`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.wageringRequirement}
          registerOptions={{
            valueAsNumber: true
          }}
          min={Math.max(
            ...[Min, previous?.wageringRequirement].filter(Number.isFinite)
          )}
          max={Math.min(
            ...[MaxNumber, next?.wageringRequirement].filter(Number.isFinite)
          )}
          required
        />
      </Table.Cell>
    </Table.Row>
  )
}

const AddRow = ({ fieldArray }) =>
  useMemo(
    () => (
      <Table.Row>
        <Table.HeadCell>
          <Button
            id="add-setting"
            size="small"
            variant="ghost"
            onClick={(event) => {
              let field = {
                days: null,
                reward: null,
                wageringRequirement: null
              }
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
