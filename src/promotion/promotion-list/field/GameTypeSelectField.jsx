import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { Switch } from "../../../switch/Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { PromotionTypeGroup } from "../../PromotionType"
import {
  GameTypeGroupSelect,
  GameTypeSelect,
  useGameTypeGroupValueOf
} from "../../../game/GameType"
import { GameTypeTrans } from "../../../trans/Game"

const GameTypeGroupFieldName = "gameTypeGroup"

const GameTypeFieldName = "rule.gameType"

export const useGameType = () => {
  let { control } = useFormContext()
  let gameType = useWatch({
    control,
    name: GameTypeFieldName
  })

  return gameType
}

export const GameTypeSelectField = ({ readOnly }) => {
  let { control, setValue } = useFormContext()

  let gameType = useGameType()
  let defaultGameTypeGroup = useGameTypeGroupValueOf(gameType)

  let gameTypeGroup = useWatch({
    control,
    name: GameTypeGroupFieldName,
    defaultValue: defaultGameTypeGroup
  })

  useEffect(() => {
    if (!gameTypeGroup) {
      setValue(GameTypeFieldName, null)
    }
  }, [gameTypeGroup])

  let gameTypePlaceholder = useTrans({
    zh: "全部",
    en: "All"
  })

  let disabled = readOnly
  let editable = !readOnly
  return (
    <>
      <NormalLabel>
        <GameTypeTrans />
      </NormalLabel>
      <Box>
        <GameTypeGroupSelect
          name={GameTypeGroupFieldName}
          defaultValue={gameTypeGroup}
          onChange={(event) => {
            setValue(GameTypeFieldName, "")
          }}
          placeholder={gameTypePlaceholder}
          readOnly={readOnly}
          disabled={disabled}
        />
      </Box>

      {gameTypeGroup && (
        <>
          <NormalLabel>
            <Trans zh="活动游戏子类型" en="Game SubType" />
          </NormalLabel>
          <GameTypeSelect
            name={GameTypeFieldName}
            group={gameTypeGroup}
            disabled={disabled}
            required
          />
        </>
      )}
    </>
  )
}
