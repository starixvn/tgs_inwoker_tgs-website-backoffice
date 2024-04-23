import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { CodeContentPair as PlayerDepositPair } from "./player-deposit"
import { CodeContentPair as MarketingReportPair } from "./marketing-report"
import { Routes } from "../content"
import { Code, DefaultCodePath, Menu } from "./menu"

export { Code } from "./menu"

const pairs = () => [PlayerDepositPair, MarketingReportPair]

export const Content = ({ codes, path = DefaultCodePath, ...props }) => (
  <Routes path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
