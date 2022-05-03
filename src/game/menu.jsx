import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as BrandGameProviderCode,
  codeLabelPair as brandGameProviderPair
} from "./brandproviders/menu"
import {
  Code as BrandGameCode,
  codeLabelPair as brandGamePair
} from "./brandgames/menu"
import { getTrans, useTrans } from "../i18n"
import { faGamepad } from "@fortawesome/free-solid-svg-icons"

export const Code = "game"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Name = ({}) => useTrans(nameMessages)

export const nameMessages = {
  zh: "游戏管理",
  en: "Game Management"
}

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faGamepad}
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
    case BrandGameProviderCode:
      return getTrans(
        {
          zh: "厂商列表",
          en: "Game Provider List"
        },
        locale
      )
    case BrandGameCode:
      return getTrans(
        {
          zh: "游戏列表",
          en: "Game List"
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
      subLabelPairs: [brandGameProviderPair, brandGamePair]
    })
]
