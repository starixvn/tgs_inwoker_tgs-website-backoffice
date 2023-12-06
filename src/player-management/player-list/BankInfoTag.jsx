import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Text } from "bumbag"
import { useTrans, Trans, useLocale } from "../../i18n"
import Select, { SelectField } from "../../select/Select"
import Input, { InputField } from "../../input/Input"
import { usePhoneTrans } from "../../trans/User"
import { useBankCardFieldTrans, useBankAccountTrans } from "../../trans/Payment"

export const BankInfoTagTypeSelect = ({
  name = "bankInfoTagType",
  placeholder,
  ...props
}) => {
  let defaultPlaceholder = useBankCardFieldTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useBankAccountTrans(),
      value: "BankAccount"
    },
    {
      label: usePhoneTrans(),
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
