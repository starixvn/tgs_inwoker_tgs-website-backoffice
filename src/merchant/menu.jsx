import React, { useRef, useEffect, Children, isValidElement } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as ResellerCode,
  codeLabelPair as resellerPair
} from "./resellers/menu"
import {
  Code as LicenseeCode,
  codeLabelPair as licenseePair
} from "./licensees/menu"
import { Code as BrandCode, codeLabelPair as brandPair } from "./brands/menu"
import {
  Code as PlatformCode,
  codeLabelPair as platformPair
} from "./platforms/menu"
import {
  Code as PlatformCreditCode,
  codeLabelPair as platformCreditPair
} from "./platform-credit/menu"
import { getTrans, useTrans } from "../i18n"
import { faBriefcase } from "@fortawesome/free-solid-svg-icons"

export const nameMessages = {
  zh: "商户管理",
  en: "Merchant Management"
}

export const Name = () => useTrans(nameMessages)

export const Code = "merchant"

export const DefaultUrl = `/${Code}`

export const DefaultPaths = [Code]

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faBriefcase}
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
  paths = DefaultPaths,
  ...props
}) => (
  <_Menu
    title={title}
    url={url}
    codes={codes}
    codePaths={paths}
    itemLabel={label}
  />
)

const label = ({ locale, code }) => {
  switch (code) {
    case ResellerCode:
      return getTrans(
        {
          zh: "总公司列表",
          en: "Resellers"
        },
        locale
      )
    case LicenseeCode:
      return getTrans(
        {
          zh: "公司列表",
          en: "Licensees"
        },
        locale
      )
    case BrandCode:
    case PlatformCode:
      return getTrans(
        {
          zh: "平台列表",
          en: "Platforms"
        },
        locale
      )
    case PlatformCreditCode:
      return getTrans(
        {
          zh: "平台额度",
          en: "Platform Credit"
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
      label: label,
      subLabelPairs: [
        resellerPair,
        licenseePair,
        brandPair /* TODO: rm */,
        platformPair,
        platformCreditPair
      ]
    })
]
