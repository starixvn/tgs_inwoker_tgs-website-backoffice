import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, OptionButtons } from "bumbag"
import { useTrans } from "../../i18n"
import { InputField } from "../../input/Input"

const Player = "Player"
const PlayerTrans = {
  zh: "玩家",
  en: "Player"
}

const Agent = "Agent"
const AgentTrans = {
  zh: "代理",
  en: "Agent"
}

export const UserType = {
  Player,
  Agent
}

const UserTypeLabel = ({ userType }) => {
  switch (userType) {
    case Player:
      return <Trans {...PlayerTrans} />
    case Agent:
      return <Trans {...AgentTrans} />
    default:
      return ""
  }
}

export const UsernameInputField = ({ userType, ...props }) => {
  return (
    <InputField
      addonBefore={
        <Button isStatic>
          <UserTypeLabel userType={userType} />
        </Button>
      }
      {...props}
    />
  )
}
