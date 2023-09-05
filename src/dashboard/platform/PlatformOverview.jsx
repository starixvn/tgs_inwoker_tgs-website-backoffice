import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Heading,
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
  Level
} from "bumbag"
import { usePlatformId } from "../../page/PlatformPageContent"
import {
  usePlatformNewPlayerCount,
  usePlatformPlayerLoginCount,
  usePlatformNetDeposit,
  usePlatformDepositSuccessRate
} from "./client"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  FormattedNumberDecimalPercentage,
  Trans
} from "../../i18n"
import { TrendIcon, Trend } from "./TrendIcon"

//TODO: use grid layout?
export const PlatformOverview = ({}) => {
  return (
    <Set>
      <NewPlayerCountStat />
      <PlayerLoginCountStat />
      <NetDepositStat />
      <DepositSuccessRateStat />
    </Set>
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
//TODO: trend diff with yesterday, wait for api
const NetDepositStat = ({}) => {
  let id = usePlatformId()
  let { isLoading, data: netDeposit, error } = usePlatformNetDeposit(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="存提差" en="Net Deposits" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumberDecimal
          value={netDeposit}
          format="0,0[.]00"
          placeholder="-"
        />
      </StatBody>
    </Stat>
  )
}

//D.
//TODO
const GrossProfitStat = () => {
  let id = usePlatformId()
}

//E.
//TODO:
const ReviewingWithdrawalStat = () => {
  
}

//H.
export const DepositSuccessRateStat = ({}) => {
  let id = usePlatformId()
  let { isLoading, data: rate, error } = usePlatformDepositSuccessRate(id)

  return (
    <Stat>
      <StatHeader>
        <Trans zh="存款成功率" en="Deposit Approval Rate" />
      </StatHeader>

      <StatBody isLoading={isLoading}>
        <FormattedNumberDecimalPercentage
          value={rate}
          format="0,0"
          placeholder="-"
        />
      </StatBody>
    </Stat>
  )
}
