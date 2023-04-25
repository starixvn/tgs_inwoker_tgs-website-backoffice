import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { BrandGameProviderCheckboxGroupTable } from "../../../game/brandproviders/BrandGameProviderCheckboxGroup"
import { useGameType } from "./GameTypeSelectField"
import { usePromotionBrandId } from "../usePromotionFormData"

export const GameProviderSelectField = ({ readOnly }) => {
  let brandId = usePromotionBrandId()
  let gameType = useGameType()

  if (!gameType) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="活动厂商" en="GP Participation" />
      </NormalLabel>
      <Box>
        <BrandGameProviderCheckboxGroupTable
          brandId={brandId}
          disabled={readOnly}
          gameType={gameType}
        />
      </Box>
    </>
  )
}
