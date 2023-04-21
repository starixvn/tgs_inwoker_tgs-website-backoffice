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

export const UserTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Agent:
      return <Trans {...AgentTrans} />
    case Player:
      return <Trans {...PlayerTrans} />
    default:
      return value
  }
}

const UserTypeSwitchMenu = ({ value, onChange }) => {
  switch (value) {
    case Agent:
      return (
        <DropdownMenu.Item onClick={() => onChange?.(Player)}>
          <UserTypeLabel value={Player} />
        </DropdownMenu.Item>
      )
    case Player:
      return (
        <DropdownMenu.Item onClick={() => onChange?.(Agent)}>
          <UserTypeLabel value={Agent} />
        </DropdownMenu.Item>
      )
    default:
      return null
  }
}

//TODO: use UserTypeDropdownMenu instead
export const UserTypeDropdownMenu = ({
  name = "type",
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
      menu={<UserTypeSwitchMenu value={value} onChange={onChange} />}
      {...props}
    >
      <Button iconAfter="chevron-down">
        <UserTypeLabel value={value} />
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
