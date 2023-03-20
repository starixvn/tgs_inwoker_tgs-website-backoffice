import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import { VipLevelCheckboxGroup } from "../../vip-levels/CheckboxGroup"
import { PromotionTypeGroup, useFindPromotionType } from "../PromotionType"
import { usePromotionType } from "./edit"
import { get } from "lodash-es"
import { useBrandIdFromPromotionForm } from "./usePromotionFormData"

const FieldName = "vipLevels"

export const PromotionVipLevelsFieldBox = ({ readOnly }) => {
  let brandId = useBrandIdFromPromotionForm()
  let promotionType = usePromotionType()

  /*
  let promotionTypeSettins = useFindPromotionType(promotionType)
  let { visible = true, ...vipLevelsProps } =
    get(promotionTypeSettins, FieldName) ?? {}

  if (!visible) {
    return null
  }
  */

  let disabled = readOnly
  return (
    <>
      <NormalLabel>
        <Trans zh="活动用户群" en="User Group" />
      </NormalLabel>
      <Box alignY="center">
        <VipLevelCheckboxGroup
          id="vipLevels"
          name={FieldName}
          valueFieldName="level"
          brandId={brandId}
          disabled={disabled}
          required
        />
      </Box>
    </>
  )
}
