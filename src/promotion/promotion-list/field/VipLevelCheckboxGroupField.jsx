import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { VipLevelCheckboxGroup } from "../../../vip-levels/CheckboxGroup"
import { usePromotionBrandId } from "../usePromotionFormData"
import { PromotionUserGroupTrans } from "../../../trans/Promotion"

const FieldName = "vipLevels"

export const VipLevelCheckboxGroupField = ({ readOnly }) => {
  let brandId = usePromotionBrandId()

  let disabled = readOnly
  return (
    <>
      <NormalLabel>
        <PromotionUserGroupTrans />
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
