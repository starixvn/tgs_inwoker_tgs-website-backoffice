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
import {
  Code as AgentDividendDistCode,
  codeLabelPair as agentDividendDistPair
} from "./agent-dividend-dist/menu"
import { getTrans, useTrans, Trans } from "../i18n"
import { faTable } from "@fortawesome/free-solid-svg-icons"
import { GameProviderReport, OrderTracking, UnsettledBet } from "../trans/Game"
import {
  BalanceChangeReport,
  MarketReport,
  PlatformReportTrans,
  WinlossReport
} from "../trans/Platform"
import {
  AgentContributionReport,
  AgentProfitSharingReport
} from "../trans/Agent"
import { PlayerContributionReport } from "../trans/Player"
import { AgentDividendDistribution } from "../trans/Vip"

export const Code = "report"

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
      <PlatformReportTrans />
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
      return getTrans(MarketReport, locale)
    case OrderReportCode:
      return getTrans(OrderTracking, locale)

    case OpenRoundCode:
      return getTrans(UnsettledBet, locale)

    case AgentContributionReportCode:
      return getTrans(AgentContributionReport, locale)

    case PlayerContributionReportCode:
      return getTrans(PlayerContributionReport, locale)

    case AgentBonusReportCode:
      return getTrans(AgentProfitSharingReport, locale)

    case TransferRecordsCode:
      return getTrans(
        {
          zh: "转帐纪录",
          en: "Transfer Records"
        },
        locale
      )

    case BalanceChangeReportCode:
      return getTrans(BalanceChangeReport, locale)

    case GameProviderReportCode:
      return getTrans(GameProviderReport, locale)
    case WinlossReportCode:
      return getTrans(WinlossReport, locale)

    case AllAgentRebateReportCode:
      return getTrans(
        {
          zh: "全民代理返水报表",
          en: "All Agent Rebate Report"
        },
        locale
      )

    case AgentDividendDistCode:
      return getTrans(AgentDividendDistribution, locale)

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
        allAgentRebateReportPair,
        agentDividendDistPair
      ]
    })
]
