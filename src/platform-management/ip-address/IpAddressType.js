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

const RegisterIP = "RegisterIP"
const RegisterIPTrans = {
  zh: "註冊IP地址",
  en: "Register IP"
}

const LoginIP = "LoginIP"
const LoginIPTrans = {
  zh: "登錄IP地址",
  en: "Login IP"
}

export const FieldName = "ipAddressType"

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
  let defaultPlaceholder = useTrans({
    zh: "查核類型",
    en: "Check Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    /*
    {
      label: useTrans(RegisterIPTrans),
      value: RegisterIP
    },
    */
    {
      label: useTrans(LoginIPTrans),
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
      return <Trans {...RegisterIPTrans} />
    case LoginIP:
      return <Trans {...LoginIPTrans} />
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
