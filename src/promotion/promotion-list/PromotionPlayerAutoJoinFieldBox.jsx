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
import {
  useIsAfterStart,
  useIsBeforeStart,
  useIsPromotionAdded,
  usePromotionType
} from "./edit"

const isNotNil = complement(isNil)
const Name = "rule.playerAutoJoin"

export const PromotionPlayerAutoJoinFieldBox = ({
  name = Name,
  readOnly,
  disabled
}) => {
  let { setValue } = useFormContext()

  let promotionType = usePromotionType()
  let promotionSettings = useFindPromotionType(promotionType)

  let isAdded = useIsPromotionAdded()
  let editable = !readOnly
  let isOnEditing = isAdded && editable

  let isBeforeStart = useIsBeforeStart()
  let isStarted = useIsAfterStart()

  let {
    /*
    addProps = {},
    */
    editProps = {},
    /*
    beforeStartProps = {},
    afterStartProps = {},
    beforeEndProps = {},
    afterEndProps = {},
    */
    ...playerAutoJoinProps
  } = get(promotionSettings, name) ?? {}

  useEffect(() => {
    if (isNotNil(playerAutoJoinProps?.checked)) {
      setValue(name, playerAutoJoinProps?.checked)
    }
  }, [playerAutoJoinProps])

  if (isNotNil(playerAutoJoinProps?.visible) && !playerAutoJoinProps?.visible) {
    return null
  }

  if (isOnEditing && isStarted) {
    let { afterStartProps = {} } = editProps
    playerAutoJoinProps = {
      ...playerAutoJoinProps,
      ...afterStartProps
    }
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
