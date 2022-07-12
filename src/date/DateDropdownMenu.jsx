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
  endOfMonth,
  isValid,
  isAfter,
  isBefore,
  differenceInDays
} from "date-fns"
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"
import { isNil, isEmpty, either } from "ramda"

let isNilOrEmpty = either(isNil, isEmpty)

const DateRangeDropdownMenuItem = ({
  type = "",
  start,
  end,
  minDate,
  maxDate,
  maxRangeDays,
  onClick,
  children,
  ...props
}) => {
  if (!start || !isValid(start) || !end || !isValid(end)) {
    return null
  }

  if (
    minDate &&
    isValid(minDate) &&
    (isBefore(start, minDate) || isBefore(end, minDate))
  ) {
    return null
  }

  if (
    maxDate &&
    isValid(maxDate) &&
    (isBefore(maxDate, start) || isBefore(maxDate, end))
  ) {
    return null
  }

  let days = differenceInDays(end, start)
  if (Number.isFinite(maxRangeDays) && days > maxRangeDays) {
    return null
  }

  return (
    <DropdownMenu.Item
      data-type={type}
      onClick={(event) => {
        onClick?.({
          type,
          start,
          end
        })
      }}
      {...props}
    >
      {children}
    </DropdownMenu.Item>
  )
}

const Yesterday = "Yesterday"
const YesterdayDropdownMenuItem = ({
  type = Yesterday,
  start = startOfYesterday(),
  end = endOfYesterday(),
  ...props
}) => {
  return (
    <DateRangeDropdownMenuItem type={type} start={start} end={end} {...props}>
      <Trans zh="昨日" en="Yesterday" />
    </DateRangeDropdownMenuItem>
  )
}

const Today = "Today"
export const TodayDropdownMenuItem = ({
  type = Today,
  start = startOfToday(),
  end = endOfToday(),
  ...props
}) => {
  return (
    <DateRangeDropdownMenuItem type={type} start={start} end={end} {...props}>
      <Trans zh="今日" en="Today" />
    </DateRangeDropdownMenuItem>
  )
}

const LastWeek = "LastWeek"
const WeekStartsOn = {
  Monday: 1
}

const startOfLastWeek = (weekStartsOn = WeekStartsOn.Monday) => {
  let lastWeekDay = subWeeks(new Date(), 1)
  return startOfWeek(lastWeekDay, {
    weekStartsOn
  })
}

const endOfLastWeek = (weekStartsOn = WeekStartsOn.Monday) => {
  let lastWeekDay = subWeeks(new Date(), 1)
  return endOfWeek(lastWeekDay, {
    weekStartsOn
  })
}

export const LastWeekDropdownMenuItem = ({
  type = LastWeek,
  start = startOfLastWeek(),
  end = endOfLastWeek(),
  ...props
}) => {
  return (
    <DateRangeDropdownMenuItem type={type} start={start} end={end} {...props}>
      <Trans zh="上周" en="Last Week" />
    </DateRangeDropdownMenuItem>
  )
}

const ThisWeek = "ThisWeek"
const startOfThisWeek = (weekStartsOn = WeekStartsOn.Monday) => {
  let now = new Date()
  return startOfWeek(now, {
    weekStartsOn
  })
}

const endOfThisWeek = (weekStartsOn = WeekStartsOn.Monday) => {
  let now = new Date()
  return endOfWeek(now, {
    weekStartsOn
  })
}

export const ThisWeekDropdownMenuItem = ({
  type = ThisWeek,
  start = startOfThisWeek(),
  end = endOfThisWeek(),
  ...props
}) => {
  return (
    <DateRangeDropdownMenuItem type={type} start={start} end={end} {...props}>
      <Trans zh="本周" en="This Week" />
    </DateRangeDropdownMenuItem>
  )
}

const LastMonth = "LastMonth"

const startOfLastMonth = () => {
  let lastMonthDay = subMonths(new Date(), 1)
  return startOfMonth(lastMonthDay)
}

const endOfLastMonth = () => {
  let lastMonthDay = subMonths(new Date(), 1)
  return endOfMonth(lastMonthDay)
}

export const LastMonthDropdownMenuItem = ({
  type = LastMonth,
  start = startOfLastMonth(),
  end = endOfLastMonth(),
  ...props
}) => {
  return (
    <DateRangeDropdownMenuItem type={type} start={start} end={end} {...props}>
      <Trans zh="上月" en="Last Month" />
    </DateRangeDropdownMenuItem>
  )
}

const ThisMonth = "ThisMonth"
const startOfThisMonth = () => {
  let now = new Date()
  return startOfMonth(now)
}

const endOfThisMonth = () => {
  let now = new Date()
  return endOfMonth(now)
}

export const ThisMonthDropdownMenuItem = ({
  type = ThisMonth,
  start = startOfThisMonth(),
  end = endOfThisMonth(),
  ...props
}) => {
  return (
    <DateRangeDropdownMenuItem type={type} start={start} end={end} {...props}>
      <Trans zh="本月" en="This Month" />
    </DateRangeDropdownMenuItem>
  )
}

const WeekDays = 7
const MonthDays = 31
export const DateDropdownMenu = ({
  maxRangeDays,
  minDate,
  maxDate,
  onClick,
  thisWeekProps = {},
  thisMonthProps = [],
  ...props
}) => {
  return (
    <DropdownMenu
      menu={
        <>
          <YesterdayDropdownMenuItem
            minDate={minDate}
            maxDate={maxDate}
            onClick={onClick}
          />
          <TodayDropdownMenuItem
            minDate={minDate}
            maxDate={maxDate}
            onClick={onClick}
          />
          <LastWeekDropdownMenuItem
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            onClick={onClick}
          />
          <ThisWeekDropdownMenuItem
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            onClick={onClick}
            {...thisWeekProps}
          />
          <LastMonthDropdownMenuItem
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            onClick={onClick}
          />
          <ThisMonthDropdownMenuItem
            minDate={minDate}
            maxDate={maxDate}
            maxRangeDays={maxRangeDays}
            onClick={onClick}
            {...thisMonthProps}
          />
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
