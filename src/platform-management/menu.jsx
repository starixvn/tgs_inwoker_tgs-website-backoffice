import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import { Code as BannerCode, codeLabelPair as bannerPair } from "./banner/menu"
import {
  Code as AnnouncementCode,
  codeLabelPair as announcementPair
} from "./announcement/menu"
import {
  Code as StationLetterCode,
  codeLabelPair as stationLetterPair
} from "./station-letter/menu"
import {
  Code as VipLevelCode,
  codeLabelPair as vipLevelPair
} from "./viplevel/menu"
import {
  Code as IMSettingsCode,
  codeLabelPair as imSettingsPair
} from "./im-settings/menu"
import {
  Code as IPAddressCode,
  codeLabelPair as ipAddressPair
} from "./ip-address/menu"
import { getTrans, useTrans } from "../i18n"
import { faUniversity } from "@fortawesome/free-solid-svg-icons"

export const Name = () => useTrans(nameMessage)

export const nameMessage = {
  zh: "平台管理",
  en: "Platform"
}

export const Code = "platform"

export const DefaultUrl = `/${Code}`

export const DefaultPaths = [Code]

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faUniversity}
        type="font-awesome"
        marginRight="0.5rem"
        fontSize="1.1rem"
        color="black200"
      />
      <Name />
    </Flex>
  ),
  url = DefaultUrl,
  codes,
  paths = DefaultPaths,
  ...props
}) => (
  <_Menu
    title={title}
    url={url}
    codes={codes}
    codePaths={paths}
    itemLabel={labelOf}
  />
)

const labelOf = ({ locale, code }) => {
  switch (code) {
    case BannerCode:
      return getTrans(
        {
          zh: "Banner 管理",
          en: "Banners"
        },
        locale
      )
    case AnnouncementCode:
      return getTrans(
        {
          zh: "公告管理",
          en: "Announcements"
        },
        locale
      )
    case StationLetterCode:
      return getTrans(
        {
          zh: "站内信",
          en: "Station Letters"
        },
        locale
      )
    case VipLevelCode:
      return getTrans(
        {
          zh: "VIP等级",
          en: "VIP Levels"
        },
        locale
      )
    case IMSettingsCode:
      return getTrans(
        {
          zh: "营运设置",
          en: "Operation Settings"
        },
        locale
      )
    case IPAddressCode:
      return getTrans(
        {
          zh: "檢核IP地址",
          en: "Check IP"
        },
        locale
      )
    default:
      return ""
  }
}

export const codeLabelPair = [
  Code,
  ({ locale, codes }) =>
    findlLabel({
      locale,
      codes,
      label: labelOf,
      subLabelPairs: [
        bannerPair,
        announcementPair,
        stationLetterPair,
        vipLevelPair,
        imSettingsPair,
        ipAddressPair
      ]
    })
]
