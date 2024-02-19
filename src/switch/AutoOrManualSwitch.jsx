import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import { Switch, SwitchField } from "./Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useAutoTrans, useManualTrans } from "../trans/Status"

export const AutoOrManualSwitch = ({ name, ...props }) => {
  let formContext = useFormContext()
  let checked =
    formContext?.watch(name) ?? props.checked ?? props?.defaultChecked

  let autoTrans = useAutoTrans()
  let maunalTrans = useManualTrans()
  let label = checked ? autoTrans : maunalTrans

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
