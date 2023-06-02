import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, OptionButtons } from "bumbag"
import { useTrans } from "../../i18n"
import Select from "../../select/Select"

const AllPlayers = "All"
const DesignatedPlayers = "Players"
export const SendLetterType = {
  AllPlayers,
  DesignatedPlayers
}

//TODO: placeholder
export const SendLetterTypeSelect = ({ name = "sendLetterType", ...props }) => {
  let options = [
    {
      label: useTrans({
        zh: "全部玩家",
        en: "All Players"
      }),
      value: AllPlayers
    },
    {
      label: useTrans({
        zh: "特定玩家",
        en: "Designated Players"
      }),
      value: DesignatedPlayers
    }
  ]
  return <Select name={name} options={options} {...props} />
}
