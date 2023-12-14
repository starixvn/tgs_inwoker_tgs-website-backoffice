import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group } from "bumbag"
import { TypeDropdownMenu } from "./Type"
import { InputField } from "../../input/Input"
import { useTrans } from "../../i18n"
import { useFormContext } from "react-hook-form"
import { Type } from "./Type"
import { useUnmount } from "react-use"
import { useRoundIdTrans } from "../../trans/Game"

export const TypeInputGroup = ({
  name = "memberType",
  value = Type.Agent,
  inputProps,
  ...props
}) => {
  let formMethods = useFormContext()
  let [type, setType] = useState(value)

  let addonBefore = (
    <TypeDropdownMenu
      value={type}
      onChange={(type) => {
        setType(type)

        if (type === Type.Round) {
          type = Type.Player //for api, api doesn't use Round type, use Player instead
        }

        if (name && formMethods) {
          formMethods.setValue(name, type)
        }
      }}
      // defaultValue={defaultValue}
      css={css`
        & .bb-DropdownMenuButton {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      `}
      {...props}
    />
  )

  switch (type) {
    case Type.Round:
      return <RoundIdInputField addonBefore={addonBefore} {...inputProps} />
    case Type.Agent:
    case Type.Player:
    default:
      return <UsernameInputField addonBefore={addonBefore} {...inputProps} />
  }
  /*
  return (
    <InputField
      addonBefore={
        <TypeDropdownMenu
          name="memberType"
          {...typeProps}
          css={css`
            & .bb-DropdownMenuButton {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          `}
        />
      }
      showEmptyFieldValueAddonAfter
    />
  )
  */
}

const UsernameInputField = ({
  name = "username",
  showEmptyFieldValueAddonAfter = true,
  ...props
}) => {
  let formMethods = useFormContext()

  useUnmount(() => {
    formMethods.setValue(name, "")
  })

  let placeholder = useTrans({
    zh: "用户名",
    en: "Username"
  })

  return (
    <InputField
      name={name}
      placeholder={placeholder}
      showEmptyFieldValueAddonAfter={showEmptyFieldValueAddonAfter}
      {...props}
    />
  )
}

const RoundIdInputField = ({
  name = "roundId",
  showEmptyFieldValueAddonAfter = true,
  ...props
}) => {
  let formMethods = useFormContext()

  useUnmount(() => {
    formMethods.setValue(name, "")
  })

  let placeholder = useRoundIdTrans()

  return (
    <InputField
      name={name}
      placeholder={placeholder}
      showEmptyFieldValueAddonAfter={showEmptyFieldValueAddonAfter}
      {...props}
    />
  )
}
