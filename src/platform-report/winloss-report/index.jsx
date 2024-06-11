import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Popover,
  Icon,
  List
} from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { Trans } from "../../i18n"
import { WinlossReport } from "./WinlossReport"
import { WinlossReportTrans } from "../../trans/Platform"

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
  return (
    <PlatformPageContent
      title={
        <Set orientation="horizontal" alignY="center">
          <WinlossReportTrans />
          <Popover.State placement="bottom">
            <Popover.Disclosure alignY="center">
              <Icon icon="info-circle" color="info" fontSize="1rem" />
            </Popover.Disclosure>
            <Popover
              hasArrow
              usePortal
              maxWidth="85vw"
              css={css`
                width: max-content;
              `}
            >
              <List listStyleType="disc" listStylePosition="inside">
                <List.Item>
                  <Trans
                    zh="订单数: 该代理团队或直属玩家已結算的总订单数。"
                    en="No. of Tickets: The total settled order number from down line sub agent teams."
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="投注额: 该代理团队或直属玩家的总有效投注额。"
                    en="Turnover: The total valid bet amount from down line sub agent teams."
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="玩家输赢: 下级代理团队或直属玩家的总输赢金额。 (玩家赢: 显示正数；玩家输: 显示负数)"
                    en="Player Winloss: The total winloss amount from down line sub agent teams. (Positive amount: player win, Negative amount: player loss)"
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh={`玩家特别: 该代理线全部玩家的"红利金额" + "调帐"(公司、代理、优惠)`}
                    en="Player Special: The total cost from down line players, which is including Bonus Amount + Adjustment Amount (Bonus, Company, Agent)"
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="代理输赢: (0 - 玩家输赢金额) * 代理占成。"
                    en="Agent Winloss: (0 - Player Winloss) * P/T."
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="代理特别: (0 - 玩家特别) * 代理占成。"
                    en="Agent Special: (0- Player Special) * P/T."
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="代理总和: 代理输赢 + 代理特别。"
                    en="Agent Total: Agent Winloss + Agent Special. "
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="公司输赢: (0 - 玩家输赢金额) * (100% - 代理占成)。"
                    en="Company Winloss: (0 - Player Winloss) * (100% - P/T)."
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="公司特别: (0 - 玩家特别) * (100% - 代理占成)。"
                    en="Company Special: (0 - Player Special) * (100% - P/T)."
                  />
                </List.Item>
                <List.Item>
                  <Trans
                    zh="公司总和: 公司输赢 + 公司特别。"
                    en="Company Total: Company Winloss + Company Special."
                  />
                </List.Item>
              </List>
            </Popover>
          </Popover.State>
        </Set>
      }
    >
      <ReportBody />
    </PlatformPageContent>
  )
}

const ReportBody = () => {
  let brandId = usePlatformId()
  return <WinlossReport brandId={brandId} />
}
