import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { VipLevelCheckboxGroup } from "../../../vip-levels/CheckboxGroup"
import { usePromotionBrandId } from "../usePromotionFormData"

const FieldName = "vipLevels"

export const VipLevelCheckboxGroupField = ({ readOnly }) => {
  let brandId = usePromotionBrandId()

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
