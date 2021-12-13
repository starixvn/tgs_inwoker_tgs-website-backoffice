import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as GameProviderCode,
  codeLabelPair as gameProviderPair
} from "./game-provider/menu"
import {
  Code as BrandPaymentsCode,
  codeLabelPair as brandPaymentsPair
} from "./brand-payment/menu"
import {
  Code as LanguageCode,
  codeLabelPair as languagePair
} from "./language/menu"
import {
  Code as CurrencyCode,
  codeLabelPair as currencyPair
} from "./currency/menu"
import {
  Code as BetLimitCode,
  codeLabelPair as betLimitPair
} from "./betlimit/menu"
import {
  Code as SettingsCode,
  codeLabelPair as settingsPair
} from "./setting/menu"
import {
  Code as GameRoundCode,
  codeLabelPair as gameRoundPair
} from "./game-round/menu"
import {
  Code as PlatformGameProviderCode,
  codeLabelPair as platformGameProviderPair
} from "./platform-game-provider/menu"
import { getTrans, useTrans } from "../i18n"
import { faCogs } from "@fortawesome/free-solid-svg-icons"

export const Code = "systemadmin"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Name = ({}) => useTrans(nameMessages)

export const nameMessages = {
  zh: "系统管理",
  en: "System Admin"
}

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faCogs}
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
    case GameProviderCode:
      return getTrans(
        {
          zh: "游戏商管理",
          en: "Game Provider Management"
        },
        locale
      )
    case BrandPaymentsCode:
      return getTrans(
        {
          zh: "平台支付管理",
          en: "Platform Payment Management"
        },
        locale
      )
    case LanguageCode:
      return getTrans(
        {
          zh: "语系",
          en: "Language"
        },
        locale
      )
    case CurrencyCode:
      return getTrans(
        {
          zh: "币种",
          en: "Currency"
        },
        locale
      )
    case BetLimitCode:
      return getTrans(
        {
          zh: "限红",
          en: "Bet Limit"
        },
        locale
      )
    case SettingsCode:
      return getTrans(
        {
          zh: "设定",
          en: "Settings"
        },
        locale
      )
    case GameRoundCode:
      return getTrans(
        {
          zh: "游戏订单",
          en: "Game Round"
        },
        locale
      )
    case PlatformGameProviderCode:
      return getTrans(
        {
          zh: "平台 - 游戏商",
          en: "Platform - Game Provider"
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
        gameProviderPair,
        brandPaymentsPair,
        languagePair,
        currencyPair,
        betLimitPair,
        settingsPair,
        gameRoundPair,
        platformGameProviderPair
      ]
    })
]
