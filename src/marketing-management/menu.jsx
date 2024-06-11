import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as PlayerDepositCode,
  codeLabelPair as playerDepositReportPair
} from "./player-deposit/menu"
import {
  Code as MarketingReportCode,
  codeLabelPair as marketingReportPair
} from "./marketing-report/menu"
import { getTrans, useTrans, Trans } from "../i18n"
import { faTable } from "@fortawesome/free-solid-svg-icons"
import { MarketingManagementTrans } from "../trans/Platform"
import { PlayerDepositReport } from "../trans/Player"
import { AgentMarketingReport } from "../trans/Agent"

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

    case MarketingReportCode:
      return getTrans(AgentMarketingReport, locale)

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
      subLabelPairs: [playerDepositReportPair, marketingReportPair]
    })
]
