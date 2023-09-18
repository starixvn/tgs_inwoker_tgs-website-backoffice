import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as PlatformCode,
  codeLabelPair as platformPair
} from "./platform/menu"
import { getTrans, useTrans, Trans } from "../i18n"
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons"

export const Code = "overview"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const nameMessages = {
  zh: "总览",
  en: "Overview"
}

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faTachometerAlt}
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
    case PlatformCode:
      return getTrans(
        {
          zh: "平台",
          en: "Platform"
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
      subLabelPairs: [platformPair]
    })
]
