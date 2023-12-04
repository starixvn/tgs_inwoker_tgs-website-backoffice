import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as MarketReportCode,
  codeLabelPair as marketReportPair
} from "./market-report/menu"
import {
  Code as OrderReportCode,
  codeLabelPair as orderReportPair
} from "./order-report/menu"
import {
  Code as OpenRoundCode,
  codeLabelPair as openRoundPair
} from "./open-round/menu"
import {
  Code as AgentContributionReportCode,
  codeLabelPair as agentContributionReportPair
} from "./agent-contribution-report/menu"
import {
  Code as PlayerContributionReportCode,
  codeLabelPair as playerContributionReportPair
} from "./player-contribution-report/menu"
import {
  Code as AgentBonusReportCode,
  codeLabelPair as agentBonusReportPair
} from "./agent-profit-sharing-report/menu"
import {
  Code as BalanceChangeReportCode,
  codeLabelPair as balanceChangeReportPair
} from "./balance-change-report/menu"
import {
  Code as GameProviderReportCode,
  codeLabelPair as gameProviderReportPair
} from "./game-provider-report/menu"
import {
  Code as TransferRecordsCode,
  codeLabelPair as transferRecordsPair
} from "./transfer-records/menu"
import {
  Code as WinlossReportCode,
  codeLabelPair as winlossReportPair
} from "./winloss-report/menu"
import {
  Code as AllAgentRebateReportCode,
  codeLabelPair as allAgentRebateReportPair
} from "./all-agent-rebate-report/menu"
import { getTrans, useTrans, Trans } from "../i18n"
import { faTable } from "@fortawesome/free-solid-svg-icons"
import { OrderTracking } from "../trans/Game"

export const Code = "report"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const nameMessages = {
  zh: "平台报表",
  en: "Platform Report"
}

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
      <Trans {...nameMessages} />
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
    case MarketReportCode:
      return getTrans(
        {
          zh: "市场报表",
          en: "Market Report"
        },
        locale
      )
    case OrderReportCode:
      return getTrans(OrderTracking, locale)

    case OpenRoundCode:
      return getTrans(
        {
          zh: "未结算订单查询",
          en: "Unsettled Bet"
        },
        locale
      )

    case AgentContributionReportCode:
      return getTrans(
        {
          zh: "代理贡献报表",
          en: "Agent Contribution Report"
        },
        locale
      )

    case PlayerContributionReportCode:
      return getTrans(
        {
          zh: "玩家贡献报表",
          en: "Player Contribution Report"
        },
        locale
      )

    case AgentBonusReportCode:
      return getTrans(
        {
          zh: "代理分红报表",
          en: "Agent Profit Sharing Report"
        },
        locale
      )

    case TransferRecordsCode:
      return getTrans(
        {
          zh: "转帐纪录",
          en: "Transfer Records"
        },
        locale
      )

    case BalanceChangeReportCode:
      return getTrans(
        {
          zh: "帳變報表",
          en: "Balance Change Report"
        },
        locale
      )

    case GameProviderReportCode:
      return getTrans(
        {
          zh: "游戏商報表",
          en: "Game Provider Report"
        },
        locale
      )
    case WinlossReportCode:
      return getTrans(
        {
          zh: "输赢报表",
          en: "Winloss Report"
        },
        locale
      )

    case AllAgentRebateReportCode:
      return getTrans(
        {
          zh: "全民代理返水报表",
          en: "All Agent Rebate Report"
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
        marketReportPair,
        orderReportPair,
        openRoundPair,
        agentContributionReportPair,
        playerContributionReportPair,
        agentBonusReportPair,
        balanceChangeReportPair,
        gameProviderReportPair,
        transferRecordsPair,
        winlossReportPair,
        allAgentRebateReportPair
      ]
    })
]
