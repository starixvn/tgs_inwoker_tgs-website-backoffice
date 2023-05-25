import React, { useRef, useEffect } from "react"
import { CodeContentPair as PromotionPair } from "./promotion-list"
import { CodeContentPair as PayoutPair } from "./payout-list"
import { CodeContentPair as WinningPair } from "./winning-list"
import { Routes } from "../content"
import { Code, DefaultCodePath, Menu } from "./menu"

export { Code } from "./menu"

const pairs = () => [PromotionPair, PayoutPair, WinningPair]

export const Content = ({ codes, path = DefaultCodePath, ...props }) => (
  <Routes path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
