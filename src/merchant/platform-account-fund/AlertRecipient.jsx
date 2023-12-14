import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Flex, Text, Group, FieldStack, Button, Icon } from "bumbag"
import {
  Trans,
  useLocale,
  useTrans,
  Locales,
  FormattedNumberDecimalPercentage
} from "../../i18n"
import {
  useForm,
  useFormContext,
  useWatch,
  useFieldArray,
  Controller
} from "react-hook-form"
import Input from "../../input/Input"
import EmailInput from "../../input/EmailInput"
import { useMount } from "react-use"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"

//TODO: required atleast one validation
//TODO: add btn
//TODO: use useFieldArray?
//TODO: readOnly or editable?
export const AlertRecipientInputList = ({ name, ...props }) => {
  let { control } = useFormContext()

  let fieldArray = useFieldArray({
    control,
    name,
    keyName: "_id",
    rules: {
      required: (args) => {
        console.log("args", args)
      }
    }
  })

  useMount(() => {
    if (fieldArray.fields.length === 0) {
      fieldArray.append({}) //init default row
    }
  })

  //TODO: defaultValue?

  return (
    <FieldStack>
      {fieldArray.fields.map((field, index, list) => {
        let isLast = index === list.length - 1
        console.log("isLast", isLast)
        //TODO: setup name here?
        return (
          <AlertRecipientInputRow
            key={field._id}
            name={name}
            index={index}
            field={field}
            isLast={isLast}
            fieldArray={fieldArray}
          />
        )
      })}
    </FieldStack>
  )
}

//TODO: isLast = true > AddBtn
//TODO: useMemo?
const EmailStyle = css`
  flex: 1;
`
//TODO: placeholder
const AlertRecipientInputRow = ({ name, index, field, isLast, fieldArray }) => {
  let receipentPlaceholder = useTrans({
    zh: "通知對象",
    en: "Alert Recipient"
  })

  let emailPlaceholder = useTrans({
    zh: "郵箱地址",
    en: "E-mail address"
  })
  return (
    <Set orientation="horizontal">
      <Input
        name={`${name}.${index}.recipient`}
        required
        placeholder={receipentPlaceholder}
        size="small"
      />
      <EmailInput
        name={`${name}.${index}.email`}
        required
        placeholder={emailPlaceholder}
        size="small"
        css={EmailStyle}
      />
      {!isLast && <RemoveRow index={index} fieldArray={fieldArray} />}
      {isLast && <AddRow fieldArray={fieldArray} />}
    </Set>
  )
}

const RemoveRow = ({ index, fieldArray }) =>
  useMemo(
    () => (
      <Button
        size="small"
        palette="danger"
        variant="ghost"
        onClick={() => {
          fieldArray.remove(index)
        }}
      >
        <Icon icon={faMinus} type="font-awesome" />
      </Button>
    ),
    [index, fieldArray]
  )

const AddRow = ({ fieldArray }) =>
  useMemo(
    () => (
      <Button
        size="small"
        variant="ghost"
        onClick={() => {
          fieldArray.append({})
        }}
      >
        <Icon icon={faPlus} type="font-awesome" />
      </Button>
    ),
    [fieldArray]
  )
