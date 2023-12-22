import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Icon, Flex } from "bumbag"
import { Menu as _Menu, findlLabel } from "../menu"
import { Code as AdminCode, codeLabelPair as adminPair } from "./admins/menu"
import { Code as GroupCode, codeLabelPair as rolePair } from "./roles/menu"
import {
  Code as DepartmentCode,
  codeLabelPair as departmentPair
} from "./departments/menu"
import {
  Code as BrandPaymentCode,
  codeLabelPair as brandPaymentPair
} from "./brandpayments/menu"
import { getTrans, useTrans } from "../i18n"
import { faTools } from "@fortawesome/free-solid-svg-icons"
import {
  Admins,
  Departments,
  Roles,
  SystemConfigTrans
} from "../trans/Platform"
import { PaymentManagement } from "../trans/Payment"

export const Code = "system"

export const DefaultUrl = `/${Code}`

export const DefaultCodePath = [Code]

export const Menu = ({
  title = (
    <Flex alignY="center" color="black200">
      <Icon
        icon={faTools}
        type="font-awesome"
        marginRight="0.5rem"
        fontSize="1.1rem"
        color="black200"
      />
      <SystemConfigTrans />
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
    case AdminCode:
      return getTrans(Admins, locale)
    case GroupCode:
      return getTrans(Roles, locale)
    case DepartmentCode:
      return getTrans(Departments, locale)
    case BrandPaymentCode:
      return getTrans(PaymentManagement, locale)
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
      subLabelPairs: [adminPair, rolePair, departmentPair, brandPaymentPair]
    })
]
