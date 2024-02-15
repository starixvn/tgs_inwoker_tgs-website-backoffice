import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, OptionButtons } from "bumbag"
import { useTrans } from "../../i18n"
import { InputField } from "../../input/Input"
import { AgentTrans } from "../../trans/Agent"
import { PlayerTrans } from "../../trans/Player"

const Player = "Player"

const Agent = "Agent"

export const UserType = {
  Player,
  Agent
}

export const isPlayer = (value) => value === Player

//TODO: able to rm?
const UserTypeLabel = ({ userType }) => {
  switch (userType) {
    case Player:
      return <PlayerTrans />
    case Agent:
      return <AgentTrans />
    default:
      return ""
  }
}

//TODO: able to rm?
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
