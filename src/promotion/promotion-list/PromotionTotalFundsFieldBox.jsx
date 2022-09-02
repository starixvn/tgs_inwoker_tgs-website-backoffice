import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { Switch } from "../../switch/Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import Checkbox from "../../checkbox"
import { NumberInput } from "../../input/NumberInput"
import { PromotionTypeGroup, useFindPromotionType } from "../PromotionType"
import { isNil, complement } from "ramda"

const isNotNil = complement(isNil)

const TotalAmountLimitFieldName = "totalAmountLimit"

const UnlimitedFieldName = "unlimited"

export const useIsTotalFundsUnlimited = () => {
  let { control } = useFormContext()

  let isUnlimited = useWatch({
    control,
    name: UnlimitedFieldName
  })
  return isUnlimited
}

export const useIsTotalFundsLimited = () => {
  let isUnlimited = useIsTotalFundsUnlimited()
  let isLimited = !isUnlimited
  return isLimited
}

export const useTotalFunds = () => {
  let { control } = useFormContext()
  let isLimited = useIsTotalFundsLimited()

  let totalFunds = useWatch({
    control,
    name: TotalAmountLimitFieldName
  })

  return isLimited ? totalFunds : null //null, undefined or Number.NaN?
}

export const PromotionTotalFundsFieldBox = ({
  promotionType = "",
  promotionTypeGroup = "",
  readOnly,
  disabled
}) => {
  let { setValue } = useFormContext()
  let unlimiteTotalAmountLabel = useTrans({
    zh: "无限",
    en: "Unlimited"
  })

  let isTotalFundsLimited = useIsTotalFundsLimited()

  let promotion = useFindPromotionType(promotionType)
  let unlimitedProps = promotion?.unlimited ?? {}

  useEffect(() => {
    if (isNotNil(unlimitedProps?.checked)) {
      setValue(UnlimitedFieldName, unlimitedProps?.checked)
    }
  }, [unlimitedProps])

  //TODO: use unlimitedProps?.hide instead?
  if (fieldNotUsed({ promotionTypeGroup, promotionType })) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="活动总费用" en="Promotion Funds" />
      </NormalLabel>
      <Set orientation="horizontal" alignY="center">
        {isTotalFundsLimited && (
          <>
            <NumberInput
              name={TotalAmountLimitFieldName}
              registerOptions={{
                valueAsNumber: true
              }}
              required
              disabled={disabled}
            />
          </>
        )}
        <Checkbox
          name={UnlimitedFieldName}
          label={unlimiteTotalAmountLabel}
          disabled={disabled}
          {...unlimitedProps}
        />
      </Set>
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
