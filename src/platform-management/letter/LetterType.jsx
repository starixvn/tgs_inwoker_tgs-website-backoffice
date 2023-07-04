import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, OptionButtons } from "bumbag"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import Label from "../../form/Label"
import { PlayerSelect } from "../../player-management/player-list/PlayerSelect"

const AllPlayers = "BrandAllPlayers"
const AllPlayersTrans = {
  zh: "全部玩家",
  en: "All Players"
}

const DesignatedPlayers = "Receivers"
const DesignatedPlayersTrans = {
  zh: "特定玩家",
  en: "Designated Players"
}

export const LetterType = {
  AllPlayers,
  DesignatedPlayers
}

export const isAllPlayers = (value) => value === AllPlayers

export const isDesignatedPlayers = (value) => value === DesignatedPlayers

export const LetterTypeSelect = ({ name = "letterType", ...props }) => {
  let options = [
    {
      label: useTrans(AllPlayersTrans),
      value: AllPlayers
    },
    {
      label: useTrans(DesignatedPlayersTrans),
      value: DesignatedPlayers
    }
  ]
  return <Select name={name} options={options} {...props} />
}

export const LetterTypeLabel = ({ value = "" }) => {
  switch (value) {
    case AllPlayers:
      return <Trans {...AllPlayersTrans} />
    case DesignatedPlayers:
      return <Trans {...DesignatedPlayersTrans} />
    default:
      return value
  }
}
