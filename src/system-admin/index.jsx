import React, { useRef, useEffect } from "react"
import { CodeContentPair as GameProviderPair } from "./game-provider"
import { CodeContentPair as GameProvideReportPair } from "./game-provider-report"
import { CodeContentPair as BrandPaymentPair } from "./brand-payment"
import { CodeContentPair as LanguagePair } from "./language"
import { CodeContentPair as CurrencyPair } from "./currency"
import { CodeContentPair as BetLimitPair } from "./betlimit"
import { CodeContentPair as SettingsPair } from "./setting"
import { CodeContentPair as GameRoundPair } from "./game-open-round"
import { CodeContentPair as GameResettleOpenedRoundPair } from "./game-resettle-opened-round"
import { CodeContentPair as PlatformGameProviderPair } from "./platform-game-provider"
import { CodeContentPair as GameProviderRoundPair } from "./game-provider-round"
import { Switch } from "../content"
import { Code, DefaultCodePath, Menu } from "./menu"

export { Code } from "./menu"

const pairs = () => [
  GameProviderPair,
  GameProvideReportPair,
  BrandPaymentPair,
  LanguagePair,
  CurrencyPair,
  BetLimitPair,
  SettingsPair,
  GameRoundPair,
  GameResettleOpenedRoundPair,
  PlatformGameProviderPair,
  GameProviderRoundPair
]

export const Content = ({ codes, path = DefaultCodePath, ...props }) => (
  <Switch path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
