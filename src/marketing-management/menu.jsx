import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as PlayerDepositCode,
  codeLabelPair as playerDepositReportPair
} from "./player-deposit/menu"
import {
  Code as PlayerWinLossCode,
  codeLabelPair as playerWinLossReportPair
} from "./player-win-loss/menu"
import {
  Code as MarketingReportCode,
  codeLabelPair as marketingReportPair
} from "./marketing-report/menu"
import {
  Code as AgentMarketingReportCode,
  codeLabelPair as agentMarketingReportPair
} from "./agent-marketing-report/menu"
import { getTrans, useTrans, Trans } from "../i18n"
import { faTable } from "@fortawesome/free-solid-svg-icons"
import { MarketingManagementTrans } from "../trans/Platform"
import { PlayerDepositReport } from "../trans/Player"

export const Code = "marketing"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faTable}
        type="font-awesome"
        marginRight="0.5rem"
        fontSize="1.1rem"
        color="black200"
      />
      <MarketingManagementTrans />
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
    case PlayerDepositCode:
      return getTrans(PlayerDepositReport, locale)

    case PlayerWinLossCode:
      return getTrans(
        {
          zh: "玩家总输赢报表",
          en: "Player Total Win Loss Report"
        },
        locale
      )

    case MarketingReportCode:
      return getTrans(
        {
          zh: "代理市場報表",
          en: "Agent Marketing Report"
        },
        locale
      )

    case AgentMarketingReportCode:
      return getTrans(
        {
          zh: "代理总報表",
          en: "Agent General Report"
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
        playerDepositReportPair,
        playerWinLossReportPair,
        marketingReportPair,
        agentMarketingReportPair
      ]
    })
]
