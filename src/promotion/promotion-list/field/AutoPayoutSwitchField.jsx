import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box } from "bumbag"
import { Switch } from "../../../switch/Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { useFindPromotionType } from "../../PromotionType"
import { isNil, complement } from "ramda"
import { usePromotionType } from "./PromotionTypeField"

const isNotNil = complement(isNil)

const AutoPayoutFieldName = "autoSentPlayerBonus"

export const AutoPayoutSwitchField = ({ autoPayout, readOnly, disabled }) => {
  let promotionType = usePromotionType()

  let { setValue } = useFormContext()

  let promotion = useFindPromotionType(promotionType)
  let autoPayoutProps = promotion?.autoSentPlayerBonus ?? {}

  useEffect(() => {
    if (autoPayout) {
      setValue(AutoPayoutFieldName, autoPayout)
    }

    //TODO: rm
    if (isNotNil(autoPayoutProps?.checked)) {
      setValue(AutoPayoutFieldName, autoPayoutProps?.checked)
    }
  }, [autoPayoutProps, autoPayout])

  if (!promotionType) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="活动派发" en="Distribution Method" />
      </NormalLabel>
      <Box>
        <AutoOrManualPayoutSwitch
          {...autoPayoutProps}
          readOnly={readOnly || autoPayoutProps.readOnly || autoPayout}
          disabled={disabled || autoPayoutProps.disabled || autoPayout}
        />
      </Box>
    </>
  )
}

const AutoOrManualPayoutSwitch = ({
  name = AutoPayoutFieldName,
  readOnly = false,
  disabled,
  ...props
}) => {
  let { control, setValue } = useFormContext()

  let checked = useWatch({
    control,
    name: AutoPayoutFieldName,
    defaultValue: props.checked ?? props?.defaultValue
  })

  let autoPayoutLabel = useTrans({
    zh: "自動",
    en: "Automatic"
  })
  let manualPayoutLabel = useTrans({
    zh: "手动",
    en: "Manual"
  })
  let label = checked ? autoPayoutLabel : manualPayoutLabel

  if (readOnly || disabled) {
    return (
      <>
        <Switch label={label} checked={checked} disabled={disabled} />
        <Switch name={name} label={label} checked={checked} display="none" />
      </>
    )
  }

  return (
    <Switch
      name={name}
      label={label}
      checked={checked}
      onChange={(event) => {
        let checked = event.target.checked
        setValue(name, checked)
      }}
    />
  )
}
