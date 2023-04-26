import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { DropdownMenu, Button } from "bumbag"
import { useTrans, Trans } from "../../i18n"
import { Select } from "../../select/Select"
import { useFormContext } from "react-hook-form"

export const Agent = "Agent"
const AgentTrans = {
  zh: "代理",
  en: "Agent"
}

export const Player = "Player"
const PlayerTrans = {
  zh: "玩家",
  en: "Player"
}

export const isPlayerMemberType = (value = "") =>
  value.toLowerCase() === Player.toLowerCase()

export const MemberType = {
  Agent,
  Player
}

export const MemberTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Agent:
      return <Trans {...AgentTrans} />
    case Player:
      return <Trans {...PlayerTrans} />
    default:
      return value
  }
}

const MemberTypeSwitchMenu = ({ value, onChange }) => {
  switch (value) {
    case Agent:
      return (
        <DropdownMenu.Item onClick={() => onChange?.(Player)}>
          <MemberTypeLabel value={Player} />
        </DropdownMenu.Item>
      )
    case Player:
      return (
        <DropdownMenu.Item onClick={() => onChange?.(Agent)}>
          <MemberTypeLabel value={Agent} />
        </DropdownMenu.Item>
      )
    default:
      return null
  }
}

export const MemberTypeDropdownMenu = ({
  name = "memberType",
  placeholder,
  value,
  defaultValue = Agent,
  required = true,
  ...props
}) => {
  let formMethods = useFormContext()
  value = value ?? formMethods?.watch(name, defaultValue) ?? defaultValue

  //TODO: wrap props?.onChange event?
  //TODO: use event or value?
  let onChange = (value) => {
    props?.onChange?.(value)

    if (name && formMethods) {
      //TODO: use event or value?
      formMethods.setValue(name, value)
    }
  }

  return (
    <DropdownMenu
      menu={<MemberTypeSwitchMenu value={value} onChange={onChange} />}
      {...props}
    >
      <Button iconAfter="chevron-down">
        <MemberTypeLabel value={value} />
      </Button>
    </DropdownMenu>
  )
  /*
  let options = [
    {
      label: useTrans(AgentTrans),
      value: Agent
    },
    {
      label: useTrans(PlayerTrans),
      value: Player
    }
  ]

  let defaultPlaceholder = useTrans({
    zh: "类型",
    en: "Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  return (
    <Select
      placeholder={placeholder}
      options={options}
      defaultValue={defaultValue}
      {...props}
    />
  )
  */
}
