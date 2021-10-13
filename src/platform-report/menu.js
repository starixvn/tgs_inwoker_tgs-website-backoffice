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
  Code as VipReportCode,
  codeLabelPair as vipReportPair
} from "./vip-report/menu"
import {
  Code as BalanceChangeReportCode,
  codeLabelPair as balanceChangeReportPair
} from "./balance-change-report/menu"
import { getTrans, useTrans, Trans } from "../i18n"
import { faTable } from "@fortawesome/free-solid-svg-icons"

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
      return getTrans(
        {
          zh: "订单查询",
          en: "Order Tracking"
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

    case VipReportCode:
      return getTrans(
        {
          zh: "VIP报表",
          en: "VIP Report"
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
        agentContributionReportPair,
        playerContributionReportPair,
        agentBonusReportPair,
        vipReportPair,
        balanceChangeReportPair
      ]
    })
]
