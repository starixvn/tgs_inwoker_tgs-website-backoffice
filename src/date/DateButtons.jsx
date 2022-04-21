import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Button } from "bumbag"
import { Trans } from "../i18n"
import {
  startOfYesterday,
  endOfYesterday,
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subMonths,
  startOfMonth,
  endOfMonth
} from "date-fns"

const Yesterday = "Yesterday"
export const YesterdayButton = ({ onClick, ...props }) => {
  return (
    <Button
      onClick={(event) => {
        let start = startOfYesterday()
        let end = endOfYesterday()
        onClick?.({
          type: Yesterday,
          start,
          end
        })
      }}
      {...props}
    >
      <Trans zh="昨日" en="Yesterday" />
    </Button>
  )
}

const Today = "Today"
export const TodayButton = ({ onClick, ...props }) => {
  return (
    <Button
      onClick={() => {
        let start = startOfToday()
        let end = endOfToday()
        onClick?.({
          type: Today,
          start,
          end
        })
      }}
      {...props}
    >
      <Trans zh="今日" en="Today" />
    </Button>
  )
}

const LastWeek = "LastWeek"
const WeekStartsOn = {
  Monday: 1
}
export const LastWeekButton = ({ onClick, ...props }) => {
  return (
    <Button
      onClick={() => {
        let lastWeekDay = subWeeks(new Date(), 1)
        let start = startOfWeek(lastWeekDay, {
          weekStartsOn: WeekStartsOn.Monday
        })
        let end = endOfWeek(lastWeekDay, {
          weekStartsOn: WeekStartsOn.Monday
        })
        onClick?.({
          type: LastWeek,
          start,
          end
        })
      }}
      {...props}
    >
      <Trans zh="上周" en="Last Week" />
    </Button>
  )
}

const ThisWeek = "ThisWeek"
export const ThisWeekButton = ({ onClick, ...props }) => {
  return (
    <Button
      onClick={() => {
        let now = new Date()
        let start = startOfWeek(now, {
          weekStartsOn: WeekStartsOn.Monday
        })
        let end = endOfWeek(now, {
          weekStartsOn: WeekStartsOn.Monday
        })
        onClick?.({
          type: ThisWeek,
          start,
          end
        })
      }}
      {...props}
    >
      <Trans zh="本周" en="This Week" />
    </Button>
  )
}

const LastMonth = "LastMonth"
export const LastMonthButton = ({ onClick, ...props }) => {
  return (
    <Button
      onClick={() => {
        let lastMonthDay = subMonths(new Date(), 1)
        let start = startOfMonth(lastMonthDay)
        let end = endOfMonth(lastMonthDay)
        onClick?.({
          type: LastMonth,
          start,
          end
        })
      }}
      {...props}
    >
      <Trans zh="上月" en="Last Month" />
    </Button>
  )
}

const ThisMonth = "ThisMonth"
export const ThisMonthButton = ({ onClick, ...props }) => {
  return (
    <Button
      onClick={() => {
        let now = new Date()
        let start = startOfMonth(now)
        let end = endOfMonth(now)
        onClick?.({
          type: ThisMonth,
          start,
          end
        })
      }}
      {...props}
    >
      <Trans zh="本月" en="This Month" />
    </Button>
  )
}

export const DateButtons = ({
  buttons = [
    YesterdayButton,
    TodayButton,
    LastWeekButton,
    ThisWeekButton,
    LastMonthButton,
    ThisMonthButton
  ],
  onClick,
  ...props
}) => {
  return (
    <Group {...props}>
      {buttons.map((Button) => (
        <Button onClick={onClick} />
      ))}
    </Group>
  )
}
