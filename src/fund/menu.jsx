import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import {
  Code as DepositListCode,
  codeLabelPair as depositListPair
} from "./deposit/menu"
import {
  Code as WithdrawCode,
  codeLabelPair as withdrawListPair
} from "./withdraw/menu"
import { getTrans, useTrans } from "../i18n"
import { faWallet } from "@fortawesome/free-solid-svg-icons"

export const Name = ({}) => useTrans(nameMessages)

export const nameMessages = {
  zh: "资金管理",
  en: "Fund management"
}

export const Code = "fundmanagement"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faWallet}
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
    case DepositListCode:
      return getTrans(
        {
          zh: "充值列表",
          en: "Deposit List"
        },
        locale
      )

    case WithdrawCode:
      return getTrans(
        {
          zh: "提款列表",
          en: "Withdraw List"
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
      subLabelPairs: [depositListPair, withdrawListPair]
    })
]
