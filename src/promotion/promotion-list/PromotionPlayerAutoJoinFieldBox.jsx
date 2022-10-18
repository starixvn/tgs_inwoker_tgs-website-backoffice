import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box } from "bumbag"
import { Switch } from "../../switch/Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import { PromotionTypeGroup, useFindPromotionType } from "../PromotionType"
import { isNil, complement } from "ramda"
import { get } from "lodash-es"

const isNotNil = complement(isNil)
const Name = "rule.playerAutoJoin"

export const PromotionPlayerAutoJoinFieldBox = ({
  promotionType = "",
  name = Name,
  readOnly,
  disabled
}) => {
  let { setValue } = useFormContext()

  let promotion = useFindPromotionType(promotionType)
  let playerAutoJoinProps = get(promotion, name) ?? {}
  useEffect(() => {
    if (isNotNil(playerAutoJoinProps?.checked)) {
      setValue(name, playerAutoJoinProps?.checked)
    }
  }, [playerAutoJoinProps])

  if (isNotNil(playerAutoJoinProps?.visible) && !playerAutoJoinProps?.visible) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="玩家自动参加" en="Player Auto Join" />
      </NormalLabel>
      <Box alignY="center">
        <Switch
          name={name}
          {...playerAutoJoinProps}
          readOnly={readOnly || playerAutoJoinProps.readOnly}
          disabled={disabled || playerAutoJoinProps.disabled}
        />
      </Box>
    </>
  )
}
