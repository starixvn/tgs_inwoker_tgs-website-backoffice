import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as PromotionListCode,
  codeLabelPair as promotionListPair
} from "./promotion-list/menu"
import {
  Code as PayoutListCode,
  codeLabelPair as payoutListPair
} from "./payout-list/menu"
import {
  Code as WinningListCode,
  codeLabelPair as winningListPair
} from "./winning-list/menu"
import { getTrans, useTrans } from "../i18n"
import { faGift } from "@fortawesome/free-solid-svg-icons"
import {
  PromotionManagement,
  PromotionManagementTrans,
  PromotionPayouts,
  WinningList
} from "../trans/Promotion"

export const Code = "promotion"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Name = ({}) => <PromotionManagementTrans />

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faGift}
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
    itemLabel={labelOf}
  />
)

const labelOf = ({ locale, code }) => {
  switch (code) {
    case PromotionListCode:
      return getTrans(PromotionManagement, locale)
    case PayoutListCode:
      return getTrans(PromotionPayouts, locale)
    case WinningListCode:
      return getTrans(WinningList, locale)
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
      subLabelPairs: [promotionListPair, payoutListPair, winningListPair]
    })
]
