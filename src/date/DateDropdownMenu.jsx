import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { DropdownMenu, Icon, Button } from "bumbag"
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
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"

const Yesterday = "Yesterday"
const YesterdayDropdownMenuItem = ({ onClick, ...props }) => (
  <DropdownMenu.Item
    data-type={Yesterday}
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
  </DropdownMenu.Item>
)

const Today = "Today"
export const TodayDropdownMenuItem = ({ onClick, ...props }) => {
  return (
    <DropdownMenu.Item
      data-type={Today}
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
    </DropdownMenu.Item>
  )
}

const LastWeek = "LastWeek"
const WeekStartsOn = {
  Monday: 1
}
export const LastWeekDropdownMenuItem = ({ onClick, ...props }) => {
  return (
    <DropdownMenu.Item
      data-type={LastWeek}
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
    </DropdownMenu.Item>
  )
}

const ThisWeek = "ThisWeek"
export const ThisWeekDropdownMenuItem = ({ onClick, ...props }) => {
  return (
    <DropdownMenu.Item
      data-type={ThisWeek}
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
    </DropdownMenu.Item>
  )
}

const LastMonth = "LastMonth"
export const LastMonthDropdownMenuItem = ({ onClick, ...props }) => {
  return (
    <DropdownMenu.Item
      data-type={LastMonth}
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
    </DropdownMenu.Item>
  )
}

const ThisMonth = "ThisMonth"
export const ThisMonthDropdownMenuItem = ({ onClick, ...props }) => {
  return (
    <DropdownMenu.Item
      data-type={ThisMonth}
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
    </DropdownMenu.Item>
  )
}

export const DateDropdownMenu = ({ onClick, ...props }) => {
  return (
    <DropdownMenu
      menu={
        <>
          <YesterdayDropdownMenuItem onClick={onClick} />
          <TodayDropdownMenuItem onClick={onClick} />
          <LastWeekDropdownMenuItem onClick={onClick} />
          <ThisWeekDropdownMenuItem onClick={onClick} />
          <LastMonthDropdownMenuItem onClick={onClick} />
          <ThisMonthDropdownMenuItem onClick={onClick} />
        </>
      }
      {...props}
    >
      <Button iconAfter="chevron-down">
        <Icon icon={faCalendarAlt} type="font-awesome" />
      </Button>
    </DropdownMenu>
  )
}
