import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import { Switch, SwitchField } from "./Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useAutoTrans, useManualTrans } from "../trans/Status"

export const AutoOrManualSwitch = ({ name, ...props }) => {
  let formContext = useFormContext()
  let checked =
    formContext?.watch(name) ?? props.checked ?? props?.defaultChecked

  let label = useAutoOrManualSwitchTrans(checked)

  return <Switch name={name} label={label} {...props} />
}

export const useAutoOrManualSwitchTrans = (checked) => {
  let autoTrans = useAutoTrans()
  let maunalTrans = useManualTrans()
  return checked ? autoTrans : maunalTrans
}

export const AutoOrManualSwitchLabel = ({ value }) => {
  let label = useAutoOrManualSwitchTrans(value)
  return label
}
