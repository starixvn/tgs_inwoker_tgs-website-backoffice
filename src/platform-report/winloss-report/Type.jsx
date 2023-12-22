import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { DropdownMenu, Button } from "bumbag"
import { useTrans, Trans } from "../../i18n"
import { useFormContext } from "react-hook-form"
import { AgentTrans } from "../../trans/Agent"

export const Agent = "agent"

export const Player = "player"
const PlayerTrans = {
  zh: "玩家",
  en: "Player"
}

export const Round = "round"
const RoundTrans = {
  zh: "订单",
  en: "Round"
}

//TODO: able to rm?
export const isPlayer = (value = "") =>
  value.toLowerCase() === Player.toLowerCase()

export const Type = {
  Agent,
  Player,
  Round
}

export const TypeLabel = ({ value = "" }) => {
  switch (value) {
    case Agent:
      return <AgentTrans />
    case Player:
      return <Trans {...PlayerTrans} />
    case Round:
      return <Trans {...RoundTrans} />
    default:
      return value
  }
}

const TypeSwitchMenu = ({ value, onChange }) => {
  switch (value) {
    case Agent:
      return (
        <>
          <DropdownMenu.Item onClick={() => onChange?.(Player)}>
            <TypeLabel value={Player} />
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onChange?.(Round)}>
            <TypeLabel value={Round} />
          </DropdownMenu.Item>
        </>
      )
    case Player:
      return (
        <>
          <DropdownMenu.Item onClick={() => onChange?.(Round)}>
            <TypeLabel value={Round} />
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onChange?.(Agent)}>
            <TypeLabel value={Agent} />
          </DropdownMenu.Item>
        </>
      )
    case Round:
      return (
        <>
          <DropdownMenu.Item onClick={() => onChange?.(Agent)}>
            <TypeLabel value={Agent} />
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onChange?.(Player)}>
            <TypeLabel value={Player} />
          </DropdownMenu.Item>
        </>
      )
    default:
      return null
  }
}

export const TypeDropdownMenu = ({
  placeholder,
  value,
  defaultValue = Agent,
  onChange,
  ...props
}) => {
  value = value ?? defaultValue
  return (
    <DropdownMenu
      menu={<TypeSwitchMenu value={value} onChange={onChange} />}
      {...props}
    >
      <Button iconAfter="chevron-down">
        <TypeLabel value={value} />
      </Button>
    </DropdownMenu>
  )
}
