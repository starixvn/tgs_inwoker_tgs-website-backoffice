import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import { Switch, SwitchField } from "./Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useLiableTrans, useNotLiableTrans } from "../trans/Status"

export const LiableOrNotSwitch = ({ name, ...props }) => {
  let formContext = useFormContext()
  let checked =
    formContext?.watch(name) ?? props.checked ?? props?.defaultChecked

  let label = useLiableOrNotSwitchTrans(checked)
  return (
    <Switch
      name={name}
      label={label}
      css={css`
        width: max-content;
      `}
      {...props}
    />
  )
}

export const LiableOrNotSwitchLabel = ({ value }) => {
  let label = useLiableOrNotSwitchTrans(value)
  return label
}

export const useLiableOrNotSwitchTrans = (checked) => {
  let liable = useLiableTrans()
  let notLiable = useNotLiableTrans()

  return checked ? liable : notLiable
}
