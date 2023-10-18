import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { useAgent } from "./client"

export const AgentIdUsername = ({ value: agentId }) => {
  let { isLoading, data: agent } = useAgent(agentId)
  if (isLoading) {
    return <Spinner />
  }

  return agent?.username ?? ""
}
