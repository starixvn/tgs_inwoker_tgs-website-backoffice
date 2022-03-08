import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useTrans, Trans } from "../../i18n"
import { Select } from "../../select/Select"
import { boolean } from "boolean"

const HasAgent = "true"
const HasAgentTrans = {
  zh: "有直属上级代理",
  en: "Has upper level agnet"
}

const NoAgent = "false"
const NoAgentTrans = {
  zh: "无直属上级代理",
  en: "None upper level agnet"
}

export const DefaultFieldName = "hasUpperAgent"

export const PlayerHasAgentSelect = ({
  name = DefaultFieldName,
  placeholder,
  registerOptions = {},
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(HasAgentTrans),
      value: HasAgent
    },
    {
      label: useTrans(NoAgentTrans),
      value: NoAgent
    }
  ]

  return (
    <Select
      name={name}
      placeholder={placeholder}
      options={options}
      registerOptions={{
        setValueAs: (value = "") => {
          if (!value) {
            return null
          }

          let result = boolean(value)
          return result
        },
        ...registerOptions
      }}
      {...props}
    />
  )
}
