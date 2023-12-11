import React, { useState, useEffect, useMemo } from "react"
import {
  css,
  Stack,
  Heading,
  Box,
  Button,
  Select as _Select,
  SelectMenu,
  DropdownMenu
} from "bumbag"
import { useForm, useFormContext, Controller } from "react-hook-form"
import { useChangeBrandGameProviderScheduleStatus } from "./client"
import Alert from "../../dialog/Alert"
import { useTrans, Trans } from "../../i18n"
import { DisabledTrans, EnabledTrans } from "../../trans/Status"

const Enabled = "Enabled"

const Disabled = "Disabled"

export const ScheduleStatus = {
  Enabled,
  Disabled
}

export const ScheduleStatusLabel = ({ value = "" }) => {
  switch (value) {
    case Enabled:
      return <EnabledTrans />

    case Disabled:
      return <DisabledTrans />

    default:
      return value
  }
}

const toPalette = (value) => {
  switch (value) {
    case Enabled:
      return "success"
    case Disabled:
      return "danger"
    default:
      return "default"
  }
}

export const MaintenanceStatusToggleButton = ({
  name = "",
  value,
  ...props
}) => {
  let { control, setValue } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={true}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isTouched, isDirty }
      }) => {
        return (
          <Button
            palette={toPalette(value)}
            onClick={(event) => {
              let status = value == Enabled ? Disabled : Enabled
              setValue(name, status)
            }}
          >
            <ScheduleStatusLabel value={value} />
          </Button>
        )
      }}
    />
  )
}
