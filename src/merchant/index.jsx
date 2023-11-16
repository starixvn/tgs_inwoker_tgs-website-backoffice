import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Code, Menu, DefaultPaths } from "./menu"
import { Routes } from "../content"
import { Code as ResellerCode, Content as ResellerContent } from "./resellers"
import { Code as LicenseeCode, Content as LicenseeContent } from "./licensees"
import { Code as BrandCode } from "./brands/menu"
import { Code as PlatformCode, Content as PlatformContent } from "./platforms"
import {
  Code as PlatformCreditCode,
  Content as PlatformCreditContent
} from "./platform-credit"
import {
  Code as PlatformAccountFundCode,
  Content as PlatformAccountFundContent
} from "./platform-account-fund"
import {
  Code as MaintenanceCode,
  Content as MaintenanceContent
} from "./maintenance"

export { Code }

const pairs = () => [
  [ResellerCode, ResellerContent],
  [LicenseeCode, LicenseeContent],
  [BrandCode, PlatformContent] /* TODO: rm */,
  [PlatformCode, PlatformContent],
  [PlatformCreditCode, PlatformCreditContent],
  [PlatformAccountFundCode, PlatformAccountFundContent],
  [(MaintenanceCode, MaintenanceContent)]
]

export const Content = ({ codes, path = DefaultPaths, ...props }) => (
  <Routes path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
