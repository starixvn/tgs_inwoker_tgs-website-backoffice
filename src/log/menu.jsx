import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as AdminLogCode,
  codeLabelPair as adminLogPair
} from "./admin/menu"
import { Code as ApiLogCode, codeLabelPair as apiLogPair } from "./api/menu"
import { Code as LogCode, codeLabelPair as logPair } from "./log/menu"
import { getTrans, useTrans } from "../i18n"
import { faServer } from "@fortawesome/free-solid-svg-icons"

export const Name = ({}) => useTrans(nameMessages)

export const nameMessages = {
  zh: "Log",
  en: "Log"
}

export const Code = "log"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faServer}
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
    case AdminLogCode:
      return getTrans(
        {
          zh: "Admin Log",
          en: "Admin Log"
        },
        locale
      )

    case ApiLogCode:
      return getTrans(
        {
          zh: "API Log",
          en: "API Log"
        },
        locale
      )

    case LogCode:
      return getTrans(
        {
          zh: "Log",
          en: "Log"
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
      subLabelPairs: [adminLogPair, apiLogPair, logPair]
    })
]
