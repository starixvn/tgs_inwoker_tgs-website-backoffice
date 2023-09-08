import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Columns,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Popover,
  Icon,
  Text,
  Card,
  Spinner,
  Level,
  useBreakpoint
} from "bumbag"
import { usePlatformId } from "../../page/PlatformPageContent"
import {
  usePlatformNewPlayerCount,
  usePlatformPlayerLoginCount,
  usePlatformNetDeposit,
  usePlatformGrossProfit,
  usePlatformReviewingWithdrawal,
  usePlatformOutstandingWithdrawal,
  usePlatformOnlinePlayerCount,
  usePlatformDepositSuccessRate
} from "./client"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  FormattedNumberDecimalPercentage,
  Trans
} from "../../i18n"
import { TrendIcon, Trend, trendOf } from "./TrendIcon"

//TODO: layout for mobile, breakpoint value?
export const Overview = ({}) => {
  let isMobile = useBreakpoint("mobile")
  let isTablet = useBreakpoint("max-tablet")
  return (
    <>
      <Box
        css={css`
          display: grid;
          grid-gap: 1rem;
          grid-template-columns: repeat(2, minmax(0px, 1fr));
        `}
      >
        <NewPlayerCountStat />
        <PlayerLoginCountStat />
        <NetDepositStat />
        <GrossProfitStat />
        <ReviewingWithdrawalStat />
        <OutstandingWithdrawalStat />
        <OnlinePlayerCountStat />
        <DepositSuccessRateStat />
      </Box>
    </>
  )
}

export const Stat = ({ children, ...props }) => {
  return (
    <Card
      variant="bordered"
      css={css`
        padding: 0.75rem;
        background-color: var(--bb-palette-white600, #000000);
      `}
      {...props}
    >
      {children}
    </Card>
  )
}

const StatHeader = ({ children, ...props }) => {
  return (
    <Level
      alignY="center"
      spacing="major-1"
      css={css`
        gap: 0.5rem;
      `}
      {...props}
    >
      {children}
    </Level>
  )
}

const StatBody = ({ isLoading, children, ...props }) => {
  return (
    <Box
      css={css`
        margin-top: 0.5rem;
        font-weight: bold;
      `}
      {...props}
    >
      {isLoading && <Spinner />}
      {!isLoading && children}
    </Box>
  )
}

// A.
const NewPlayerCountStat = () => {
  let id = usePlatformId()
  let { isLoading, data: count, error } = usePlatformNewPlayerCount(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="注册人数" en="New Players" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={count} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//B.
const PlayerLoginCountStat = () => {
  let id = usePlatformId()
  let { isLoading, data: count, error } = usePlatformPlayerLoginCount(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="登入人數" en="Login Players" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={count} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//C.
const NetDepositStat = ({}) => {
  let id = usePlatformId()
  let { isLoading, data: record, error } = usePlatformNetDeposit(id)

  let trend = trendOf(record?.yesterdayNetDeposit, record?.todayNetDeposit)
  return (
    <Stat>
      <StatHeader>
        <Trans zh="存提差" en="Net Deposits" />
        {trend && <TrendIcon value={trend} />}
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={record?.todayNetDeposit} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//D.
//TODO: fake api
const GrossProfitStat = () => {
  let id = usePlatformId()
  let { isLoading, data: value, error } = usePlatformGrossProfit(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="毛利" en="Gross Profit" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={value} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//E.
//TODO:
const ReviewingWithdrawalStat = () => {
  let id = usePlatformId()
  let { isLoading, data: value, error } = usePlatformReviewingWithdrawal(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="待處理提款" en="Reviewing Withdrawal" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={value} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//F.
//TODO:
const OutstandingWithdrawalStat = () => {
  let id = usePlatformId()
  let { isLoading, data: value, error } = usePlatformOutstandingWithdrawal(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="待支付提款" en="Outstanding Withdrawal" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={value} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//G.
//TODO
const OnlinePlayerCountStat = () => {
  let id = usePlatformId()
  let { isLoading, data: value, error } = usePlatformOnlinePlayerCount(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="在線人數" en="Online Players" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={value} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//H.
export const DepositSuccessRateStat = ({}) => {
  let id = usePlatformId()
  let { isLoading, data: record, error } = usePlatformDepositSuccessRate(id)

  let trend = trendOf(record?.yesterdaySuccessRate, record?.todaySuccessRate)
  return (
    <Stat>
      <StatHeader>
        <Trans zh="存款成功率" en="Deposit Approval Rate" />
        {trend && <TrendIcon value={trend} />}
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumberDecimalPercentage
          value={record?.todaySuccessRate}
          format="0,0"
          placeholder="-"
        />
      </StatBody>
    </Stat>
  )
}
