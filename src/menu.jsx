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
import { codeMenuContentPair as overviewPair } from "./overview"
import {
  Code as OvewviewCode,
  nameMessages as OverviewNameMessages,
  codeLabelPair as overviewLabelPair
} from "./overview/menu"
import { codeMenuContentPair as platformPair } from "./platform-management"
import {
  Code as PlatformCode,
  codeLabelPair as platformLabelPair
} from "./platform-management/menu"
import { codeMenuContentPair as promotionPair } from "./promotion"
import {
  Code as PromotionCode,
  codeLabelPair as promotionLabelPair
} from "./promotion/menu"
import { codeMenuContentPair as playerManagementPair } from "./player-management"
import {
  Code as PlayerManagementCode,
  codeLabelPair as playerManagementLabelPair
} from "./player-management/menu"
import { codeMenuContentPair as agentManagementPair } from "./agent"
import {
  Code as AgentManagementCode,
  codeLabelPair as agentManagementLabelPair
} from "./agent/menu"
import { codeMenuContentPair as gameManagementPair } from "./game"
import {
  Code as GameManagementCode,
  codeLabelPair as gameManagementLabelPair
} from "./game/menu"
import { codeMenuContentPair as platformReportManagementPair } from "./platform-report"
import {
  Code as PlatformReportManagementCode,
  codeLabelPair as platformReportManagementLabelPair
} from "./platform-report/menu"
import { codeMenuContentPair as licenseeReportManagementPair } from "./licensee-report"
import {
  Code as LicenseeReportManagementCode,
  codeLabelPair as licenseeReportManagementLabelPair
} from "./licensee-report/menu"
import { codeMenuContentPair as resellerReportPair } from "./reseller-report"
import {
  Code as ResellerReportCode,
  nameMessages as ResellerReportNameMessages,
  codeLabelPair as resellerReportLabelPair
} from "./reseller-report/menu"
import { codeMenuContentPair as merchantPair } from "./merchant"
import {
  Code as MerchantCode,
  nameMessages as MerchantName,
  codeLabelPair as merchantLabelPair
} from "./merchant/menu"
import { codeMenuContentPair as fundPair } from "./fund"
import { Code as FundCode, codeLabelPair as fundLabelPair } from "./fund/menu"
import { codeMenuContentPair as marketingPair } from "./marketing-management"
import {
  Code as MarketingCode,
  codeLabelPair as marketingLabelPair
} from "./marketing-management/menu"
import { codeMenuContentPair as systemPair } from "./system"
import {
  Code as SystemCode,
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
import {
  LicenseeReport,
  MarketingManagement,
  PlatformManagement,
  PlatformReport,
  SystemConfig
} from "./trans/Platform"
import { PromotionManagement } from "./trans/Promotion"
import { PlayerManagement } from "./trans/Player"
import { GameManagement } from "./trans/Game"
import { AgentManagement } from "./trans/Agent"
import { FundManagement } from "./trans/Payment"

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
      data-code={codePaths?.[0]}
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
      data-code={code}
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
  overviewPair,
  platformPair,
  promotionPair,
  playerManagementPair,
  agentManagementPair,
  gameManagementPair,
  platformReportManagementPair,
  licenseeReportManagementPair,
  resellerReportPair,
  merchantPair,
  fundPair,
  marketingPair,
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
    overviewLabelPair,
    playerManagementLabelPair,
    agentManagementLabelPair,
    systemLabelPair,
    gameManagementLabelPair,
    platformReportManagementLabelPair,
    licenseeReportManagementLabelPair,
    resellerReportLabelPair,
    merchantLabelPair,
    fundLabelPair,
    marketingLabelPair,
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
    case OvewviewCode:
      return getTrans(OverviewNameMessages, locale)
    case PlatformCode:
      return getTrans(PlatformManagement, locale)
    case PromotionCode:
      return getTrans(PromotionManagement, locale)
    case PlayerManagementCode:
      return getTrans(PlayerManagement, locale)
    case AgentManagementCode:
      return getTrans(AgentManagement, locale)
    case GameManagementCode:
      return getTrans(GameManagement, locale)
    case PlatformReportManagementCode:
      return getTrans(PlatformReport, locale)
    case LicenseeReportManagementCode:
      return getTrans(LicenseeReport, locale)
    case ResellerReportCode:
      return getTrans(ResellerReportNameMessages, locale)
    case MerchantCode:
      return getTrans(MerchantName, locale)
    case FundCode:
      return getTrans(FundManagement, locale)
    case MarketingCode:
      return getTrans(MarketingManagement, locale)
    case SystemCode:
      return getTrans(SystemConfig, locale)
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
