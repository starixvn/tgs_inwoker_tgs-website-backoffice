import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as PlayerListCode,
  codeLabelPair as playerListPair
} from "./player-list/menu"
import {
  Code as OnlinePlayerListCode,
  codeLabelPair as onlinePlayerListPair
} from "./online-player-list/menu"
import {
  Code as BalanceAdjustmentCode,
  codeLabelPair as balanceAdjustmentPair
} from "./balance-adjustment/menu"
import {
  Code as PlayerIdentityCode,
  codeLabelPair as playerIdentityPair
} from "./player-identity/menu"
import { getTrans, useTrans } from "../i18n"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import {
  OnlinePlayers,
  PlayerBalanceAdjustment,
  PlayerIdVerification,
  Players
} from "../trans/Player"

export const Name = ({}) => useTrans(nameMessages)

export const nameMessages = {
  zh: "玩家管理",
  en: "Player management"
}

export const Code = "playermanagement"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faUser}
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
  codePaths = DefaultCodePath,
  ...props
}) => (
  <_Menu
    title={title}
    url={url}
    codes={codes}
    codePaths={codePaths}
    itemLabel={label}
  />
)

const label = ({ locale, code }) => {
  switch (code) {
    case PlayerListCode:
      return getTrans(Players, locale)
    case PlayerIdentityCode:
      return getTrans(PlayerIdVerification, locale)
    case OnlinePlayerListCode:
      return getTrans(OnlinePlayers, locale)
    case BalanceAdjustmentCode:
      return getTrans(PlayerBalanceAdjustment, locale)
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
      label,
      subLabelPairs: [
        playerListPair,
        playerIdentityPair,
        balanceAdjustmentPair,
        onlinePlayerListPair
      ]
    })
]
