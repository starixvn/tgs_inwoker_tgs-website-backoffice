import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { Switch } from "../../../switch/Switch"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../../i18n"
import { NormalLabel } from "../../../form/Label"
import { PromotionTypeGroup } from "../../PromotionType"
import { GameTypeGroupSelect, GameTypeSelect } from "../../../game/GameType"

const GameTypeGroupFieldName = "gameTypeGroup"

const GameTypeFieldName = "gameType"

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

  let gameTypeGroup = useWatch({
    control,
    name: GameTypeGroupFieldName
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
        <Trans zh="活动游戏类型" en="Game Type" />
      </NormalLabel>
      <Box>
        {editable && (
          <GameTypeGroupSelect
            name={GameTypeGroupFieldName}
            disabled={disabled}
            placeholder={gameTypePlaceholder}
            onChange={(event) => {
              setValue(GameTypeFieldName, "")
            }}
          />
        )}
        {disabled && (
          <>
            <GameTypeGroupSelect
              name={GameTypeGroupFieldName}
              value={gameTypeGroup}
              display="none"
            />
            <GameTypeGroupSelect
              placeholder={gameTypePlaceholder}
              value={gameTypeGroup}
              disabled
            />
          </>
        )}
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
