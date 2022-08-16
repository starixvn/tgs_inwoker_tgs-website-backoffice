import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, FieldWrapper } from "bumbag"
import Select from "../../select/Select"
import { Locales, Trans, useTrans } from "../../i18n"
import { useGameProviderList } from "./client"
import GameProviderSelect from "./GameProviderSelect"
import { useFormContext, useWatch } from "react-hook-form"
import SubGameProviderSelect from "./SubGameProviderSelect"

export const GameProviderSubGameProviderSelect = ({
  gameProviderProps = {},
  subGameProviderProps = {},
  ...props
}) => {
  let gameProviderName = gameProviderProps.name ?? ""

  let { control, setValue } = useFormContext()
  let gameProviderId = useWatch({
    control,
    name: gameProviderName
  })

  let subGameProviderName = subGameProviderProps.name ?? ""

  useEffect(() => {
    setValue(subGameProviderName, "")
  }, [gameProviderId])

  return (
    <Group>
      <GameProviderSelect {...gameProviderProps} />
      {gameProviderId && (
        <SubGameProviderSelect
          gameProviderId={gameProviderId}
          {...subGameProviderProps}
        />
      )}
    </Group>
  )
}
