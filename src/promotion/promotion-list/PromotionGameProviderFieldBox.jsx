import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { Switch } from "../../switch/Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import Checkbox from "../../checkbox"
import { NumberInput } from "../../input/NumberInput"
import {
  PromotionTypeGroup,
  useIsInstantlySettlementIntervalType
} from "../PromotionType"
import { BrandGameProviderCheckboxGroupTable } from "../../game/brandproviders/BrandGameProviderCheckboxGroup"
import { useGameType } from "./PromotionGameTypeFieldBox"

export const PromotionGameProviderFieldBox = ({ brandId, readOnly }) => {
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
