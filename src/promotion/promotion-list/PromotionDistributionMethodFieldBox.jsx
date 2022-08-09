import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box } from "bumbag"
import { Switch } from "../../switch/Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import {
  PromotionTypeGroup,
  useIsInstantlySettlementIntervalType
} from "../PromotionType"

export const PromotionDistributionMethodFieldBox = ({
  promotionType = "",
  promotionTypeGroup = "",
  readOnly,
  disabled
}) => {
  let { setValue } = useFormContext()

  let autoPayout = useIsInstantlySettlementIntervalType(promotionType)
  useEffect(() => {
    if (autoPayout) {
      setValue(AutoSentPlayerBonusFieldName, true)
    }
  }, [autoPayout])

  if (fieldNotUsed({ promotionTypeGroup, promotionType })) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="活动派发" en="Distribution Method" />
      </NormalLabel>
      <Box>
        {autoPayout && (
          <AutoOrManualPayoutSwitch readOnly disabled checked={true} />
        )}
        {!autoPayout && (
          <AutoOrManualPayoutSwitch readOnly={readOnly} disabled={disabled} />
        )}
      </Box>
    </>
  )
}

const notUsedConfigs = {
  promotionType: [PromotionTypeGroup.Dummy],
  promotionTypeGroup: [PromotionTypeGroup.Dummy]
}
const fieldNotUsed = ({ promotionType = "", promotionTypeGroup = "" }) => {
  if (
    notUsedConfigs.promotionTypeGroup.includes(promotionTypeGroup) ||
    notUsedConfigs.promotionType.includes(promotionType)
  ) {
    return true
  }

  return false
}

const AutoSentPlayerBonusFieldName = "autoSentPlayerBonus"
const AutoOrManualPayoutSwitch = ({
  name = AutoSentPlayerBonusFieldName,
  readOnly = false,
  disabled,
  ...props
}) => {
  let { control, setValue } = useFormContext()

  let checked = useWatch({
    control,
    name: AutoSentPlayerBonusFieldName,
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
