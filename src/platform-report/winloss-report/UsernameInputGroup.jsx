import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group } from "bumbag"
import { UserTypeSelect } from "./UserTypeSelect"
import { InputField } from "../../input/Input"
import { useTrans } from "../../i18n"

export const UsernameInputGroup = ({ name = "username", userTypeProps }) => {
  let usernamePlaceholder = useTrans({
    zh: "用户名",
    en: "Username"
  })

  let defaultUserTypeName = "type"
  return (
    <InputField
      name={name}
      addonBefore={
        <UserTypeSelect name={defaultUserTypeName} {...userTypeProps} />
      }
      showEmptyFieldValueAddonAfter
      placeholder={usernamePlaceholder}
    />
  )
}
