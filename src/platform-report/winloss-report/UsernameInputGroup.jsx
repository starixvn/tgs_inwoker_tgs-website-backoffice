import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group } from "bumbag"
import { MemberTypeDropdownMenu } from "./MemberType"
import { InputField } from "../../input/Input"
import { useTrans } from "../../i18n"

export const UsernameInputGroup = ({ name = "username", userTypeProps }) => {
  let usernamePlaceholder = useTrans({
    zh: "用户名",
    en: "Username"
  })

  return (
    <InputField
      name={name}
      addonBefore={
        <MemberTypeDropdownMenu
          {...userTypeProps}
          css={css`
            & .bb-DropdownMenuButton {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          `}
        />
      }
      showEmptyFieldValueAddonAfter
      placeholder={usernamePlaceholder}
    />
  )
}
