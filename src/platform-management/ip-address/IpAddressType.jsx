import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  Flex,
  Button,
  Text,
  Switch,
  Input,
  Stack,
  Dialog
} from "bumbag"
import { Select, SelectField } from "../../select/Select"
import { Trans, useTrans } from "../../i18n"
import {
  useRegisterIPTrans,
  RegisterIPTrans,
  useLoginIPTrans,
  LoginIPTrans
} from "../../trans/User"
import { useCheckTypeTrans } from "../../trans/Field"

const RegisterIP = "RegisterIP"

const LoginIP = "LoginIP"

export const FieldName = "ipType"

export const setIpAddressType = (value, target = {}) => {
  Reflect.set(target, FieldName, value)
  return target
}

export const setRegisterIpType = (target = {}) =>
  setIpAddressType(RegisterIP, target)

export const setLoginIpType = (target = {}) => setIpAddressType(LoginIP, target)

export const IpAddressTypeSelect = ({
  name = FieldName,
  placeholder,
  ...props
}) => {
  let defaultPlaceholder = useCheckTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useRegisterIPTrans(),
      value: RegisterIP
    },
    {
      label: useLoginIPTrans(),
      value: LoginIP
    }
  ]

  return (
    <Select
      name={name}
      placeholder={placeholder}
      options={options}
      {...props}
    />
  )
}

export const IpAddressTypeLabel = ({ value = "" }) => {
  switch (value) {
    case RegisterIP:
      return <RegisterIPTrans />
    case LoginIP:
      return <LoginIPTrans />
    default:
      return "IP"
  }
}

export default {
  RegisterIP,
  LoginIP,
  setRegisterIpType,
  setLoginIpType,
  IpAddressTypeSelect
}
