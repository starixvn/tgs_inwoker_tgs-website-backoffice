import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Code, Menu, DefaultPaths } from "./menu"
import { Routes } from "../content"
import { Code as BannerCode, Content as BannerContent } from "./banner"
import {
  Code as AnnouncementCode,
  Content as AnnouncementContent
} from "./announcement"
import {
  Code as StationLetterCode,
  Content as StationLetterContent
} from "./station-letter"
import { Code as VipLevelCode, Content as VipLevelContent } from "./viplevel"
import {
  Code as IMSettingsCode,
  Content as IMSettingsContent
} from "./im-settings"
import {
  Code as IPAddressCode,
  Content as IPAddressContent
} from "./ip-address"

export { Code }

const pairs = () => [
  [BannerCode, BannerContent],
  [AnnouncementCode, AnnouncementContent],
  [StationLetterCode, StationLetterContent],
  [VipLevelCode, VipLevelContent],
  [IMSettingsCode, IMSettingsContent],
  [IPAddressCode, IPAddressContent]
]

export const Content = ({ codes, path = DefaultPaths, ...props }) => (
  <Routes path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
