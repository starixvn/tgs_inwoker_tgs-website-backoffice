import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import { Select } from "../select/Select"

const PlayerCreated = "PlayerCreated"
const PlayerCreatedTrans = {
  zh: "玩家前台",
  en: "Player Site"
}

const AgentCreated = "AgentCreated"
const AgentCreatedTrans = {
  zh: "代理前台",
  en: "Agent System"
}

const BackendOfficeCreated = "BackendOfficeCreated"
const BackendOfficeCreatedTrans = {
  zh: "后台",
  en: "BO"
}

export const PlayerTagTypeSelect = ({ ...props }) => {
  let options = [
    {
      label: useTrans(PlayerCreatedTrans),
      value: PlayerCreated
    },
    {
      label: useTrans(AgentCreatedTrans),
      value: AgentCreated
    },
    {
      label: useTrans(BackendOfficeCreated),
      value: BackendOfficeCreatedTrans
    }
  ]

  return <Select options={options} {...props} />
}
