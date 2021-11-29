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
import { getTrans, useTrans } from "../i18n"
import { faUser } from "@fortawesome/free-solid-svg-icons"

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
      return getTrans(
        {
          zh: "玩家列表",
          en: "Players"
        },
        locale
      )
    case OnlinePlayerListCode:
      return getTrans(
        {
          zh: "在线玩家列表",
          en: "Online Players"
        },
        locale
      )
    case BalanceAdjustmentCode:
      return getTrans(
        {
          zh: "玩家调账",
          en: "Balance Adjustment"
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
      label,
      subLabelPairs: [
        playerListPair,
        balanceAdjustmentPair,
        onlinePlayerListPair
      ]
    })
]
