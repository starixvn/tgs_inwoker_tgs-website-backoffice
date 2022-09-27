import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Text } from "bumbag"
import { useTrans, Trans, useLocale } from "../../i18n"
import Select, { SelectField } from "../../select/Select"
import Input, { InputField } from "../../input/Input"

export const BankInfoTagTypeSelect = ({
  name = "bankInfoTagType",
  placeholder,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "银行卡栏位",
    en: "Bank Card Field"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans({
        zh: "银行卡号",
        en: "Bank Account"
      }),
      value: "BankAccount"
    },
    {
      label: useTrans({
        zh: "手机号码",
        en: "Phone"
      }),
      value: "Phone"
    }
  ]

  return (
    <Select
      placeholder={placeholder}
      name={name}
      options={options}
      {...props}
    />
  )
}

export const BankInfoFieldGroup = ({
  bankInfoTagTypeProps = {},
  bankInfoTagProps = {},
  ...props
}) => {
  let bankInfoTagName = bankInfoTagProps?.name ?? "bankInfoTag"
  return (
    <Group {...props}>
      <BankInfoTagTypeSelect {...bankInfoTagTypeProps} />
      <InputField
        name={bankInfoTagName}
        showEmptyFieldValueAddonAfter
        css={css`
          & .bb-InputFieldGroup,
          .bb-Input {
            border-radius: 0px !important;
          }
        `}
        {...bankInfoTagProps}
      />
    </Group>
  )
}
