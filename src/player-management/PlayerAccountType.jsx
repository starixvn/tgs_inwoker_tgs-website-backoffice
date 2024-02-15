import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"

const Player = "Player"
const Agent = "Agent"

//TODO: Chief required?
// const Chief = "Chief"

const PlayerAccountType = {
  Player,
  Agent
}

export const PlayerAccountTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Player:
      return ""
    case Agent:
      return ""
    default:
      return value
  }
}
