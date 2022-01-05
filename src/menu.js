import React, {
  useRef,
  useEffect,
  Children,
  isValidElement,
  useState
} from "react"
import { css } from "@emotion/react"
import { Link, useLocation } from "react-router-dom"
import { useMenuCodes } from "./user/context"
import { usePage, SideNav, Box, Level, Icon, Button } from "bumbag"
import memoize from "fast-memoize"
import { codeMenuContentPair as platformPair } from "./platform-management"
import {
  Code as PlatformCode,
  nameMessage as PlatformNameMessages,
  codeLabelPair as platformLabelPair
} from "./platform-management/menu"
import { codeMenuContentPair as promotionPair } from "./promotion"
import {
  Code as PromotionCode,
  nameMessages as PromotionNameMessages,
  codeLabelPair as promotionLabelPair
} from "./promotion/menu"
import { codeMenuContentPair as playerManagementPair } from "./player-management"
import {
  Code as PlayerManagementCode,
  nameMessages as PlayerManagementNameMessages,
  codeLabelPair as playerManagementLabelPair
} from "./player-management/menu"
import { codeMenuContentPair as agentManagementPair } from "./agent"
import {
  Code as AgentManagementCode,
  nameMessages as AgentManagementNameMessages,
  codeLabelPair as agentManagementLabelPair
} from "./agent/menu"
import { codeMenuContentPair as gameManagementPair } from "./game"
import {
  Code as GameManagementCode,
  nameMessages as GameManagementNameMessages,
  codeLabelPair as gameManagementLabelPair
} from "./game/menu"
import { codeMenuContentPair as platformReportManagementPair } from "./platform-report"
import {
  Code as PlatformReportManagementCode,
  nameMessages as PlatformReportManagementNameMessages,
  codeLabelPair as platformReportManagementLabelPair
} from "./platform-report/menu"
import { codeMenuContentPair as licenseeReportManagementPair } from "./licensee-report"
import {
  Code as LicenseeReportManagementCode,
  nameMessages as LicenseeReportManagementNameMessages,
  codeLabelPair as licenseeReportManagementLabelPair
} from "./licensee-report/menu"
import { codeMenuContentPair as merchantPair } from "./merchant"
import {
  Code as MerchantCode,
  nameMessages as MerchantName,
  codeLabelPair as merchantLabelPair
} from "./merchant/menu"
import { codeMenuContentPair as fundPair } from "./fund"
import {
  Code as FundCode,
  nameMessages as FundName,
  codeLabelPair as fundLabelPair
} from "./fund/menu"
import { codeMenuContentPair as systemPair } from "./system"
import {
  Code as SystemCode,
  nameMessages as SystemNameMessages,
  codeLabelPair as systemLabelPair
} from "./system/menu"
import { codeMenuContentPair as systemAdminPair } from "./system-admin"
import {
  Code as SystemAdminCode,
  nameMessages as SystemAdminNameMessages,
  codeLabelPair as systemAdminLabelPair
} from "./system-admin/menu"
import { codeMenuContentPair as logPair } from "./log"
import {
  Code as LogCode,
  nameMessages as LogNameMessages,
  codeLabelPair as logLabelPair
} from "./log/menu"
import { useLocale, getTrans } from "./i18n"
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { isDev, Features, isFeatureEnabled } from "./env"

export const Menu = ({ title, url, codes, codePaths, itemLabel }) => {
  let { sidebar, isCollapsed } = usePage()
  let [show, setShow] = useState(false)

  let locale = useLocale()
  let authCodes = useMenuCodes(codePaths)
  codes = codes ?? authCodes

  let { pathname } = useLocation()

  let items = codes
    .map((code) => {
      let label = itemLabel({ code, locale })
      let path = `${url}/${code}`
      let isActive = path == pathname

      return label ? (
        <MenuItem
          key={code}
          code={code}
          path={path}
          isActive={isActive}
          label={label}
          sidebar={sidebar}
        />
      ) : undefined
    })
    .filter((item) => !!item)

  return items && items.length ? (
    <SideNav.Level
      title={
        <Level
          orientation="horizontal"
          verticalBelow={null}
          alignY="center"
          width="100%"
          onClick={() => {
            setShow(!show)
          }}
          css={css`
            :hover {
              cursor: pointer;
            }
          `}
        >
          {title}
          <Button
            display={"inline-flex"}
            variant="ghost"
            size="small"
            marginRight="0.3rem"
          >
            <Icon icon={show ? faAngleUp : faAngleDown} type="font-awesome" />
          </Button>
        </Level>
      }
      css={css`
        border-bottom: 1px solid #edf1f7;

        .bb-SideNavLevelTitle {
          display: flex;
          align-items: center;
          line-height: 1.25rem;
          min-height: 2.75em;
          margin-bottom: 0;
          padding-left: 0.6rem;
          text-transform: none;
        }
      `}
    >
      <SideNav.Level
        css={css`
          li.bb-ListItem {
            border-top: 1px solid #edf1f7;
            margin-bottom: 0;
          }
        `}
      >
        {show && items}
      </SideNav.Level>
    </SideNav.Level>
  ) : null
}

const MenuItem = ({ code, path, label, sidebar, isActive, ...props }) => {
  let ref = useRef()

  useEffect(() => {
    if (sidebar?.isOpen && ref?.current && isActive) {
      ref.current?.focus()
    }
  }, [sidebar?.isOpen, ref?.current, isActive])

  if (!label) {
    return null
  }

  return (
    <SideNav.Item
      navId={path}
      isActive={isActive}
      onClick={() => setTimeout(sidebar.drawer.hide, 100)}
      css={css`
        font-size: 0.875rem;
        line-height: 1.25rem;
      `}
      {...props}
    >
      <Link
        ref={ref}
        to={path}
        css={css`
          padding-left: 2.2rem;
        `}
      >
        {label}
      </Link>
    </SideNav.Item>
  )
}

export const allMenuContentPairs = () => [
  platformPair,
  promotionPair,
  playerManagementPair,
  agentManagementPair,
  gameManagementPair,
  platformReportManagementPair,
  licenseeReportManagementPair,
  merchantPair,
  fundPair,
  systemPair,
  systemAdminPair,
  logPair
]

export const AllMenus = ({ codes }) => {
  let authCodes = useMenuCodes()
  codes = codes ?? authCodes
  let list = allMenuContentPairs()
  return codes
    .map((code) => {
      return <MenuByCode key={code} code={code} pairs={list} />
    })
    .filter((item) => !!item)
}

export const useLabel = ({ codes = [] }) => {
  let locale = useLocale()
  let label = moduleLabel
  let subLabelPairs = [
    playerManagementLabelPair,
    agentManagementLabelPair,
    systemLabelPair,
    gameManagementLabelPair,
    platformReportManagementLabelPair,
    licenseeReportManagementLabelPair,
    merchantLabelPair,
    fundLabelPair,
    platformLabelPair,
    promotionLabelPair,
    logLabelPair,
    systemAdminLabelPair
  ]
  return findlLabel({
    locale,
    codes,
    label,
    subLabelPairs
  })
}

//TODO: cache?
export const findlLabel = ({ locale, codes = [], label, subLabelPairs }) => {
  let [code = "", ...rest] = codes
  code = code.toLowerCase()

  if (rest.length === 0) {
    return label({ locale, code })
  }

  let [, subLabel] = subLabelPairs.find(([id]) => id === code) ?? []

  return subLabel && subLabel({ locale, code, codes: rest })
}

const moduleLabel = ({ code = "", locale }) => {
  switch (code) {
    case PlatformCode:
      return getTrans(PlatformNameMessages, locale)
    case PromotionCode:
      return getTrans(PromotionNameMessages, locale)
    case PlayerManagementCode:
      return getTrans(PlayerManagementNameMessages, locale)
    case AgentManagementCode:
      return getTrans(AgentManagementNameMessages, locale)
    case GameManagementCode:
      return getTrans(GameManagementNameMessages, locale)
    case PlatformReportManagementCode:
      return getTrans(PlatformReportManagementNameMessages, locale)
    case LicenseeReportManagementCode:
      return getTrans(LicenseeReportManagementNameMessages, locale)
    case MerchantCode:
      return getTrans(MerchantName, locale)
    case FundCode:
      return getTrans(FundName, locale)
    case SystemCode:
      return getTrans(SystemNameMessages, locale)
    case SystemAdminCode:
      return getTrans(SystemAdminNameMessages, locale)
    case LogCode:
      return getTrans(LogNameMessages, locale)
    default:
      return ""
  }
}

const MenuByCode = ({ code = "", pairs = [] }) => {
  let [, pair] = pairs.find(([id]) => id === code) ?? []
  if (pair) {
    let [Menu] = pair
    return <Menu />
  }

  return null
}

export const find = (path = [], list = []) => {
  let [code, ...restPath] = path
  code = code.toLowerCase()
  let menu = list.find((item) => item?.code?.toLowerCase() === code) ?? {}

  if (restPath.length === 0) {
    return menu
  }

  return find(restPath, menu?.subMenus)
}

export const memoizedFind = memoize(find)
