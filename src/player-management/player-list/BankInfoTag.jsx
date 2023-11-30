import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Text } from "bumbag"
import { useTrans, Trans, useLocale } from "../../i18n"
import Select, { SelectField } from "../../select/Select"
import Input, { InputField } from "../../input/Input"
import { useBankAccountTrans, usePhoneTrans } from "../../trans/User"

export const BankInfoTagTypeSelect = ({
  name = "bankInfoTagType",
  placeholder,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "银行卡栏位",
    en: "Bank Card Field",
    vi: "Tìm  kiếm thẻ ngân hàng"
  })
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
