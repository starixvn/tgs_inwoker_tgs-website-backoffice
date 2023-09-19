import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as MarketReportCode,
  codeLabelPair as marketReportPair
} from "./market-report/menu"
import {
  Code as BalanceAdjustReportCode,
  codeLabelPair as balanceAdjustReportPair
} from "./balance-adjust-report/menu"
import { getTrans, useTrans, Trans } from "../i18n"
import { faTable } from "@fortawesome/free-solid-svg-icons"

export const Code = "resellerreport"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const nameMessages = {
  zh: "总公司报表",
  en: "Reseller Report"
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

    case BalanceAdjustReportCode:
      return getTrans(
        {
          zh: "调帐报表",
          en: "Balance Adjust Report"
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
      subLabelPairs: [marketReportPair, balanceAdjustReportPair]
    })
]
