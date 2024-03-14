import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { CodeContentPair as MarketReportPair } from "./market-report"
import { CodeContentPair as OrderReportPair } from "./order-report"
import { CodeContentPair as OpenRoundPair } from "./open-round"
import { CodeContentPair as AgentContributionReportPair } from "./agent-contribution-report"
import { CodeContentPair as PlayerContributionReportPair } from "./player-contribution-report"
import { CodeContentPair as AgentBonusReportPair } from "./agent-profit-sharing-report"
import { CodeContentPair as BalanceChangeReportPair } from "./balance-change-report"
//TODO: rm game-provider-report when game-providers is ready
import { CodeContentPair as GameProviderReportPair } from "./game-provider-report"
import { CodeContentPair as GameProvidersPair } from "./game-providers"
import { CodeContentPair as TransferRecordsPair } from "./transfer-records"
import { CodeContentPair as WinlossReportPair } from "./winloss-report"
import { CodeContentPair as AllAgentRebateReportPair } from "./all-agent-rebate-report"
import { CodeContentPair as AgentDividendPair } from "./agent-dividend"
import { Routes } from "../content"
import { Code, DefaultCodePath, Menu } from "./menu"

export { Code } from "./menu"

const pairs = () => [
  MarketReportPair,
  OrderReportPair,
  OpenRoundPair,
  AgentContributionReportPair,
  PlayerContributionReportPair,
  AgentBonusReportPair,
  BalanceChangeReportPair,
  GameProviderReportPair,
  TransferRecordsPair,
  WinlossReportPair,
  AllAgentRebateReportPair,
  AgentDividendPair,
  GameProvidersPair
]

export const Content = ({ codes, path = DefaultCodePath, ...props }) => (
  <Routes path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
