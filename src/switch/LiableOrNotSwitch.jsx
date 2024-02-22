import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import { Switch, SwitchField } from "./Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useLiableTrans, useNotLiableTrans } from "../trans/Status"
import { boolean } from "boolean"
import Select from "../select/Select"

export const LiableOrNotSwitch = ({ name, ...props }) => {
  let formContext = useFormContext()
  let checked =
    formContext?.watch(name) ?? props.checked ?? props?.defaultChecked

  let label = useLiableOrNotSwitchTrans(checked)
  return <Switch name={name} label={label} {...props} />
}

export const LiableOrNotSwitchSelect = ({
  name,
  registerOptions,
  ...props
}) => {
  const True = "true"
  const False = "false"

  let options = [
    {
      label: useLiableTrans(),
      value: True
    },
    {
      label: useNotLiableTrans(),
      value: False
    }
  ]

  return (
    <Select
      name={name}
      options={options}
      registerOptions={{
        setValueAs: (value = "") => {
          if (!value) {
            return ""
          }
          value = boolean(value)
          return value
        },
        ...registerOptions
      }}
      {...props}
    />
  )
}

export const useLiableOrNotSwitchTrans = (checked) => {
  let liable = useLiableTrans()
  let notLiable = useNotLiableTrans()

  return checked ? liable : notLiable
}

export const LiableOrNotSwitchLabel = ({ value }) => {
  let label = useLiableOrNotSwitchTrans(value)
  return label
}
