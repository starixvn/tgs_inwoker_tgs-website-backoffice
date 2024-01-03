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
  useModalState
} from "bumbag"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch
} from "react-hook-form"
import Checkbox from "../../checkbox"
import Input from "../../input/Input"
import { isAllChecked, isAllPropChecked } from "../../checkbox/isAllChecked"
import get from "lodash-es/get"
import { NumberInput } from "../../input/NumberInput"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import Disclosure, { ConfigIconDisclosure } from "../../dialog/Disclosure"
import { CloseText, ConfirmText } from "../../button/ActionButtons"
import Backdrop from "../../dialog/Backdrop"
import FormDialog from "../../form/FormDialog"
import { CurrencyTrans } from "../../trans/Payment"

export const GameProviderCurrencyBetLimitFieldsBox = ({
  currencyFieldName = "currencies",
  betLimitFieldName = "betLimits",
  width = "100%",
  disabled,
  ...props
}) => {
  /*
    let { control, watch } = useFormContext()

    let currencies = watch(currencyFieldName)
    if (!currencies || currencies.length == 0) {
        return null
    }
    */
  return (
    <Body
      currencyFieldName={currencyFieldName}
      betLimitFieldName={betLimitFieldName}
      disabled={disabled}
      width={width}
    />
  )
}

const Body = ({
  currencyFieldName,
  betLimitFieldName,
  disabled,
  width = "100%"
}) => {
  let {
    control,
    formState: { errors }
  } = useFormContext()

  let currencyFieldArray = useFieldArray({
    control,
    name: currencyFieldName,
    keyName: "_id"
  })

  let betLimitFieldArray = useFieldArray({
    control,
    name: betLimitFieldName,
    keyName: "_id"
  })

  return (
    <>
      <NormalLabel>
        <Trans zh="币种限红" en="Currency Bet Limit" />
      </NormalLabel>
      <Set orientation="vertical" width={width}>
        <Table width={width} hasDividers>
          <Table.Head>
            <Table.Row>
              <Table.HeadCell>
                <Box></Box>
              </Table.HeadCell>
              <Table.HeadCell colSpan="5">
                <Box marginLeft="1rem">
                  <CurrencyTrans />
                </Box>
              </Table.HeadCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {currencyFieldArray.fields.map((currencyField, index) => {
              return (
                <CurrencyBetLimitsRow
                  key={currencyField._id}
                  currencyField={currencyField}
                  currencyFieldIndex={index}
                  currencyFieldName={currencyFieldName}
                  betLimitFieldName={betLimitFieldName}
                  betLimitFieldArray={betLimitFieldArray}
                  disabled={disabled}
                />
              )
            })}
          </Table.Body>
        </Table>
      </Set>
    </>
  )
}

const CurrencyBetLimitsRow = ({
  currencyField,
  currencyFieldIndex,
  currencyFieldName,
  betLimitFieldName,
  betLimitFieldArray,
  disabled
}) => {
  let { control, setValue } = useFormContext()

  let currencyCheckedFieldName = toCurrencyCheckedFieldName(
    currencyFieldName,
    currencyFieldIndex
  )

  let isCurrencyChecked = useWatch({
    control,
    name: currencyCheckedFieldName
  })

  let betLimitHeaderVisibility = isCurrencyChecked ? "visible" : "hidden"

  const removeCurrencyBetLimitFields = (currencyCode = "") => {
    let betLimits = betLimitFieldArray.fields
      .map((betLimitField, index) => [betLimitField, index])
      .filter(([betLimitField, index]) => {
        return currencyCode === betLimitField.currencyCode
      })
      .map(([_, index]) => index)

    if (betLimits.length > 0) {
      betLimitFieldArray.remove(betLimits)
    }
  }

  let currencyFieldRow = useMemo(() => {
    return (
      <>
        <Table.Row key={currencyField._id}>
          <Table.HeadCell>
            <Box>
              <Input
                type="hidden"
                name={`${currencyFieldName}.${currencyFieldIndex}.code`}
                value={currencyField.code}
              />
              {disabled && (
                <>
                  <Checkbox
                    display="none"
                    name={currencyCheckedFieldName}
                    checked={currencyField.checked}
                  />
                  <Checkbox disabled checked={currencyField.checked} />
                </>
              )}
              {!disabled && (
                <>
                  <Checkbox
                    key={currencyField._id}
                    name={currencyCheckedFieldName}
                    defaultChecked={currencyField.checked}
                    onChange={(event) => {
                      let checked = event.target.checked
                      setValue(currencyCheckedFieldName, checked)

                      if (!checked) {
                        // Note: backend api not support delete bet limit, so no need to remove bet limit fields
                        // removeCurrencyBetLimitFields()
                      }
                    }}
                  />
                </>
              )}
            </Box>
          </Table.HeadCell>
          <Table.HeadCell>
            <CurrencyCodeDisclosure
              currencyFieldName={currencyFieldName}
              currencyField={currencyField}
              currencyFieldIndex={currencyFieldIndex}
              required={isCurrencyChecked}
              disabled={disabled}
            />
          </Table.HeadCell>
          <Table.HeadCell textAlign="center">
            <Box visibility={betLimitHeaderVisibility}>
              <Trans zh="最低投注" en="Min Bet" />
            </Box>
          </Table.HeadCell>
          <Table.HeadCell textAlign="center">
            <Box visibility={betLimitHeaderVisibility}>
              <Trans zh="最高投注" en="Max Bet" />
            </Box>
          </Table.HeadCell>
          <Table.HeadCell textAlign="center">
            <Box visibility={betLimitHeaderVisibility}>
              <Trans zh="单场最高投注" en="Max Bet Per Match" />
            </Box>
          </Table.HeadCell>
          <Table.HeadCell textAlign="center">
            <Box visibility={betLimitHeaderVisibility}>
              <Trans zh="External Setting" en="External Setting" />
            </Box>
          </Table.HeadCell>
        </Table.Row>
      </>
    )
  }, [currencyField._id, isCurrencyChecked])

  const toBetLimitFieldIndexPairs = (currencyCode, fields = []) => {
    let pairs = fields.map((field, index) => [field, index])
    let result = pairs.filter(
      ([betLimitField]) => betLimitField.currencyCode == currencyCode
    )
    return result
  }

  return (
    <>
      {currencyFieldRow}
      {isCurrencyChecked && (
        <BetLimitRows
          betLimitFieldIndexPairs={toBetLimitFieldIndexPairs(
            currencyField.code,
            betLimitFieldArray?.fields
          )}
          betLimitFieldName={betLimitFieldName}
          betLimitFieldArray={betLimitFieldArray}
          disabled={disabled}
        />
      )}
      {isCurrencyChecked && !disabled && (
        <AddBetLimitRow
          key={`add-${currencyField._id}-bet-limit`}
          currencyField={currencyField}
          betLimitFieldArray={betLimitFieldArray}
        />
      )}
    </>
  )
}

const BetLimitRows = ({
  betLimitFieldIndexPairs = [],
  betLimitFieldName,
  betLimitFieldArray,
  disabled
}) => {
  return betLimitFieldIndexPairs.map(([betLimitField, betLimitFieldIndex]) => (
    <BetLimitRow
      betLimitFieldName={betLimitFieldName}
      betLimitFieldArray={betLimitFieldArray}
      betLimitField={betLimitField}
      betLimitFieldIndex={betLimitFieldIndex}
      disabled={disabled}
    />
  ))
}

const AddBetLimitRow = ({ currencyField, betLimitFieldArray }) =>
  useMemo(
    () => (
      <Table.Row id={`add-${currencyField.code}-bet-limit`}>
        <Table.HeadCell></Table.HeadCell>
        <Table.HeadCell>
          <Button
            size="small"
            variant="ghost"
            onClick={(event) => {
              betLimitFieldArray.append({
                currencyCode: currencyField.code,
                minBet: "",
                maxBet: "",
                maxBetPerMatch: "",
                externalSetting: ""
              })
            }}
          >
            <Icon icon={faPlus} type="font-awesome" />
          </Button>
        </Table.HeadCell>
        <Table.HeadCell>
          <Input visibility="hidden" />
        </Table.HeadCell>
        <Table.HeadCell>
          <Input visibility="hidden" />
        </Table.HeadCell>
        <Table.HeadCell>
          <Input visibility="hidden" />
        </Table.HeadCell>
        <Table.HeadCell>
          <Input visibility="hidden" />
        </Table.HeadCell>
      </Table.Row>
    ),
    [currencyField._id, betLimitFieldArray]
  )

const BetLimitRow = ({
  betLimitFieldName,
  betLimitFieldArray,
  betLimitField,
  betLimitFieldIndex,
  disabled
}) => (
  <Table.Row>
    <Table.Cell></Table.Cell>
    <Table.Cell>
      <Button
        display="none" //note. backend api not support delete bet limit
        size="small"
        palette="danger"
        variant="ghost"
        onClick={(event) => {
          betLimitFieldArray.remove(betLimitFieldIndex)
        }}
      >
        <Icon icon={faMinus} type="font-awesome" />
      </Button>
      <Box alignX="center">
        {betLimitField.id && (
          <Input
            type="hidden"
            name={toBetLimitFieldName({
              betLimitFieldName,
              betLimitFieldIndex,
              name: "id"
            })}
            value={betLimitField.id}
          />
        )}
        <Input
          type="hidden"
          key={betLimitField._id}
          name={toBetLimitFieldName({
            betLimitFieldName,
            betLimitFieldIndex,
            name: "currencyCode"
          })}
          value={betLimitField.currencyCode}
        />
      </Box>
    </Table.Cell>
    <Table.Cell textAlign="center">
      <NumberInput
        name={toBetLimitFieldName({
          betLimitFieldName,
          betLimitFieldIndex,
          name: "minBet"
        })}
        defaultValue={betLimitField.minBet}
        min="0"
        required
        disabled={disabled}
      />
    </Table.Cell>
    <Table.Cell textAlign="center">
      <NumberInput
        name={toBetLimitFieldName({
          betLimitFieldName,
          betLimitFieldIndex,
          name: "maxBet"
        })}
        defaultValue={betLimitField.maxBet}
        min="0"
        required
        disabled={disabled}
      />
    </Table.Cell>
    <Table.Cell textAlign="center">
      <NumberInput
        name={toBetLimitFieldName({
          betLimitFieldName,
          betLimitFieldIndex,
          name: "maxBetPerMatch"
        })}
        defaultValue={betLimitField.maxBetPerMatch}
        min="0"
        disabled={disabled}
      />
    </Table.Cell>
    <Table.Cell textAlign="center">
      <Input
        name={toBetLimitFieldName({
          betLimitFieldName,
          betLimitFieldIndex,
          name: "externalSetting"
        })}
        defaultValue={betLimitField.externalSetting}
        disabled={disabled}
      />
    </Table.Cell>
  </Table.Row>
)

const CurrencyCodeDisclosure = ({
  currencyFieldName,
  currencyField,
  currencyFieldIndex,
  disabled,
  required
}) => {
  let { control, setValue } = useFormContext()
  let name = `${currencyFieldName}.${currencyFieldIndex}.gameProviderCurrencyCode`

  let dialog = useModalState()
  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={true}
      defaultValue={currencyField.gameProviderCurrencyCode}
      rules={{ required }}
      render={({ field: { value }, fieldState, formState }) => {
        return (
          <>
            <Group>
              <Button size="small" isStatic>
                {currencyField.code}
              </Button>
              <ConfigIconDisclosure
                size="small"
                palette={fieldState?.error ? "warning" : "default"}
                variant={fieldState?.error ? "outlined" : "default"}
                {...dialog}
              />
            </Group>
            {dialog.visible && (
              <CurrencyCodeDialog
                value={value}
                disabled={disabled}
                onChange={(code) => {
                  if (!disabled) {
                    setValue(name, code, { shouldValidate: true })
                  }
                }}
                dialog={dialog}
              />
            )}
          </>
        )
      }}
    />
  )
}

const CurrencyCodeDialog = ({ value, disabled, onChange, dialog }) => {
  let title = useTrans({
    zh: `游戏商币种代码`,
    en: `Game Provider Currency Code`
  })

  return (
    <Backdrop {...dialog}>
      <FormDialog
        stopPropagation={true}
        onSubmit={({ code }) => {
          onChange(code)
          dialog.hide()
        }}
        submitText={<ConfirmText />}
        showActionButtons={!disabled}
        dialog={dialog}
        title={title}
        hideBackdrop={true}
        minWidth="max-content"
      >
        <Input name="code" defaultValue={value} disabled={disabled} />
      </FormDialog>
    </Backdrop>
  )
}

const toCurrencyCheckedFieldName = (name, index) => {
  return `${name}.${index}.checked`
}

const toBetLimitFieldName = ({
  betLimitFieldName,
  betLimitFieldIndex,
  name
}) => {
  return `${betLimitFieldName}.${betLimitFieldIndex}.${name}`
}
