import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Button, Set, Icon } from "bumbag"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { VipLevelCheckboxGroup } from "../../../vip-levels/CheckboxGroup"
import { usePromotionBrandId } from "../usePromotionFormData"
import { PromotionUserGroupTrans } from "../../../trans/Promotion"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { useVipLevelList } from "../../../vip-levels/client"
import { SelectAllTrans } from "../../../trans/Action"

const FieldName = "vipLevels"

export const VipLevelCheckboxGroupField = ({ readOnly }) => {
  const { control, setValue } = useFormContext()

  let brandId = usePromotionBrandId()
  let { isLoading, data, error } = useVipLevelList({
    brandId,
    showAll: true,
    sortby: "level"
  })

  let disabled = readOnly
  return (
    <>
      <NormalLabel>
        <PromotionUserGroupTrans />
      </NormalLabel>
      <Set alignY="center">
        {!disabled && (
          <Button
            disabled={isLoading}
            onClick={() => {
              let levels = data.items.map(({ level }) => `${level}`)
              setValue(FieldName, levels)
            }}
            size="small"
            variant="ghost"
          >
            <Icon icon={faCheck} type="font-awesome" />
            <SelectAllTrans />
          </Button>
        )}
        <VipLevelCheckboxGroup
          id="vipLevels"
          name={FieldName}
          valueFieldName="level"
          brandId={brandId}
          disabled={disabled}
          required
        />
      </Set>
    </>
  )
}
