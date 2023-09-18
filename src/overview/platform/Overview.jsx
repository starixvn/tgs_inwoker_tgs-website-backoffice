import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect
} from "react"
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
import { useMeasure } from "react-use"

//TODO: layout for mobile, breakpoint value?
//TODO: find minwidth: 250?
const MinWidth = 230
export const Overview = ({}) => {
  let [ref, measure] = useMeasure()
  return (
    <>
      <Box
        ref={ref}
        css={css`
          display: grid;
          grid-gap: 0.5rem;
          grid-template-columns: repeat(
            ${measure.width > MinWidth ? 2 : 1},
            minmax(0, 1fr)
          );
          overflow: auto;
        `}
      >
        <NewPlayerCountStat />
        <PlayerLoginCountStat />
        <NetDepositStat />
        {/* 
        TODO: api
        <GrossProfitStat /> 
        */}
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

//TODO: left min size?
//TODO: mobile?
const StatHeader = ({ title = "", icon, children, ...props }) => {
  return (
    <Level
      spacing="major-1"
      css={css`
        gap: 0.25rem;
      `}
      {...props}
    >
      <Box fontSize="150">{title}</Box>
      <Box>{icon}</Box>
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
  let { isLoading, data: record, error } = usePlatformNewPlayerCount(id)

  let trend = trendOf(
    record?.yesterdayPlayerRegisterCount,
    record?.todayPlayerRegisterCount
  )
  return (
    <Stat>
      <StatHeader
        title={<Trans zh="注册人数" en="New Players" />}
        icon={trend && <TrendIcon value={trend} />}
      />

      <StatBody isLoading={isLoading}>
        <FormattedNumber
          value={record?.todayPlayerRegisterCount}
          placeholder="-"
        />
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
      <StatHeader title={<Trans zh="登入人數" en="Login Players" />} />

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
      <StatHeader
        title={<Trans zh="存提差" en="Net Deposits" />}
        icon={trend && <TrendIcon value={trend} />}
      />

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
      <StatHeader title={<Trans zh="毛利" en="Gross Profit" />} />

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={value} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//E. > no trend
const ReviewingWithdrawalStat = () => {
  let id = usePlatformId()
  let { isLoading, data: value, error } = usePlatformReviewingWithdrawal(id)

  return (
    <Stat>
      <StatHeader title={<Trans zh="待處理提款" en="Reviewing Withdrawal" />} />

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={value} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//F. > no trend
const OutstandingWithdrawalStat = () => {
  let id = usePlatformId()
  let { isLoading, data: value, error } = usePlatformOutstandingWithdrawal(id)

  return (
    <Stat>
      <StatHeader
        title={<Trans zh="待支付提款" en="Outstanding Withdrawal" />}
      />

      <StatBody isLoading={isLoading}>
        <FormattedNumber value={value} placeholder="-" />
      </StatBody>
    </Stat>
  )
}

//G. > no trend
const OnlinePlayerCountStat = () => {
  let id = usePlatformId()
  let { isLoading, data: value, error } = usePlatformOnlinePlayerCount(id)

  return (
    <Stat>
      <StatHeader title={<Trans zh="在線人數" en="Online Players" />} />

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
      <StatHeader
        title={<Trans zh="存款成功率" en="Deposit Approval Rate" />}
        icon={trend && <TrendIcon value={trend} />}
      />

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
