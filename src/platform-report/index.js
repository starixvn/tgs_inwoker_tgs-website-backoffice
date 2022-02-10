import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { CodeContentPair as MarketReportPair } from "./market-report"
import { CodeContentPair as OrderReportPair } from "./order-report"
import { CodeContentPair as AgentContributionReportPair } from "./agent-contribution-report"
import { CodeContentPair as PlayerContributionReportPair } from "./player-contribution-report"
import { CodeContentPair as AgentBonusReportPair } from "./agent-profit-sharing-report"
import { CodeContentPair as VipReportPair } from "./vip-report"
import { CodeContentPair as BalanceChangeReportPair } from "./balance-change-report"
import { CodeContentPair as GameProvideRreconciliationReportPair } from "./game-provider-reconciliation-report"
import { CodeContentPair as GameProvideReportPair } from "./game-provider-report"
import { CodeContentPair as ReconciliationPair } from "./reconciliation-report"
import { Switch } from "../content"
import { Code, DefaultCodePath, Menu } from "./menu"

export { Code } from "./menu"

const pairs = () => [
  MarketReportPair,
  OrderReportPair,
  AgentContributionReportPair,
  PlayerContributionReportPair,
  AgentBonusReportPair,
  VipReportPair,
  BalanceChangeReportPair,
  GameProvideRreconciliationReportPair,
  GameProvideReportPair,
  ReconciliationPair
]

export const Content = ({ codes, path = DefaultCodePath, ...props }) => (
  <Switch path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
