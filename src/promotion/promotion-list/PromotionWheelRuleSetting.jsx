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

export const PromotionWheelRuleSetting = ({ ...props }) => {
  return (
    <FieldValues>
      <NormalLabel>
        <Trans zh="轮盘设置" en="Wheel Setting" />
      </NormalLabel>
      <SettingDisclosure width="fit-content" {...props} />
    </FieldValues>
  )
}

const ChancePercentageFieldName = "chancePercentage"

const validateTotalChancePercentage = (fieldName, settings = []) => {
  let totalChancePercentage = sumBy(settings, fieldName)
  let pass = totalChancePercentage === 100
  return pass
}

const ListFieldName = "list"
const SettingDisclosure = ({ name = ListFieldName, readOnly, ...props }) => {
  let dialog = useModalState()

  let { control, setValue } = useFormContext()
  let defaultValue = useWatch({
    control,
    name,
    defaultValue: Array.from({ length: 6 }, (x, i) => ({ rank: i + 1 }))
  })

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: true,
        validate: (settings) => {
          let passTotalChancePercentage = validateTotalChancePercentage(
            ChancePercentageFieldName,
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
    en: "Wheel Setting"
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
        minWidth="70vw"
        maxWidth="100vw"
      >
        <FormBody />
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
    en: "Winning chance must add up to 100"
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
              <Trans zh="中奖机率 %" en="Winning Chance %" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="流水倍数" en="Turnover Requirement" />
            </Table.HeadCell>
            <Table.HeadCell>
              <Trans zh="中奖次数/天" en="Winnings / Day" />
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
        name="totalChancePercentage"
        control={control}
        rules={{
          validate: () => {
            let pass = validateTotalChancePercentage(
              ChancePercentageFieldName,
              settings
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
  chancePercentageFieldName = ChancePercentageFieldName
}) => {
  let { setValue, getValues, formState } = useFormContext()
  let RankFieldName = `${name}.${index}.rank`
  useEffect(() => {
    setValue(RankFieldName, index + 1)
  }, [index])

  let editable = !readOnly
  let disabled = readOnly
  return (
    <Table.Row data-index={index}>
      <Table.Cell>
        <Box>
          {index + 1}
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
        <Input
          name={`${name}.${index}.name`}
          readOnly={readOnly}
          disabled={disabled}
          inputProps={{
            size: 10
          }}
          maxLength={10}
          size="small"
          // required
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.bouns`}
          min={0}
          max={10000}
          size="small"
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
          name={`${name}.${index}.turnover`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.turnover}
          registerOptions={{
            valueAsNumber: true
          }}
          min={0}
          // required
          size="small"
        />
      </Table.Cell>
      <Table.Cell>
        <NumberInput
          name={`${name}.${index}.winningsPerDay`}
          readOnly={readOnly}
          disabled={disabled}
          defaultValue={field.winningsPerDay}
          registerOptions={{
            valueAsNumber: true
          }}
          min={0}
          // required
          size="small"
        />
      </Table.Cell>
      <Table.Cell>
        <Switch
          name={`${name}.${index}.default`}
          registerOptions={{
            validate: () => {
              let defaultNames = fieldArray.fields.map(
                (_, fieldIndex) => `${name}.${fieldIndex}.default`
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
                  setValue(`${name}.${fieldIndex}.default`, false)
                }
              })
            }
          }}
        />
      </Table.Cell>
    </Table.Row>
  )
}
