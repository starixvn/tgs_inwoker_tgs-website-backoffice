import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch
} from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  Text,
  Link,
  FieldStack,
  Alert,
  List,
  Popover,
  Icon
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  Trans,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { useAgentDividendList, API } from "./client"
import { AgentWinLossDialogDisclosure } from "./AgentWinLoss"
import { AgentProfitSharingDialogDisclosure } from "./AgentProfitSharingDialog"
import { AgentTypeSelect } from "../../agent/AgentType"
import {
  isDev,
  isFeaturePlatformAgentProfitSharingReportEnabled
} from "../../env"
import { urlWith } from "../../client"
import DownloadButton from "../../button/DownloadButton"
import { AgentTeamContributionDialogDisclosure } from "./AgentTeamContribution"
import { BonusDialogDisclosure } from "../BonusDialog"
import { PlatformAgentProfitSharingReport } from "./PlatformAgentProfitSharingReport"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()

  if (!isDisplay) {
    return null
  }

  return <Report />
}

export const CodeContentPair = [Code, Content]

const Report = () => {
  let title = <Trans zh="代理分红报表" en="Agent Profit Sharing Report" />
  return (
    <PlatformPageContent title={title} addonAfterTitle={<InfoTooltip />}>
      <ReportBody />
    </PlatformPageContent>
  )
}

const ReportBody = ({}) => {
  let brandId = usePlatformId()
  return <PlatformAgentProfitSharingReport brandId={brandId} />
}

const InfoTooltip = () => {
  return (
    <Popover.State placement="bottom">
      <Popover.Disclosure>
        <Icon icon="info-circle" color="info" />
      </Popover.Disclosure>
      <Popover
        hasArrow
        usePortal
        maxWidth="90vw"
        css={css`
          width: max-content;
        `}
      >
        <FieldStack>
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <Trans
                zh="红利金额 = VIP福利 + VIP反水 + 活动的优惠金额。"
                en="Bonus Amount = VIP Bonus + VIP Rebate + Promotion Bonus Amount."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="代理承担红利 = 红利金额 * 分红比例。"
                en="Agent-Covered Bonus = Bonus Amount * Profit Sharing Percentage."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="代理承担优惠调帐 = 优惠调帐 * 分红比例。"
                en="Agent-Covered Bonus Adjust = Bonus Adjustment Amount * Profit Sharing Percentage."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="净盈利 = 公司输赢金额 - 红利金额 - 优惠调帐。"
                en="Net Profit = CO. W/L - Bonus Amount - Bonus Adjustment Amount."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="直属玩家贡献 = 净盈利  * 分红比例。"
                en="Direct-Player Contribution = Net Profit * Profit Sharing Percentage."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="团队贡献 = 下级代理净盈利 * (代理分红% - 下级代理分红%)。"
                en="Team Contribution = Net Profit from Sub Agent * (Agent Profit Sharing Percentage - Sub Agent Profit Sharing Percentage)."
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="分红金额 = 直属玩家贡献 + 团队贡献 - 代理调帐。"
                en="Profit Sharing Amount = Direct-Player Contribution + Team Contribution - Agent Adjustment Amount."
              />
            </List.Item>
          </List>
        </FieldStack>
      </Popover>
    </Popover.State>
  )
}
