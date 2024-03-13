import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Select } from "../select/Select"
import { useTrans } from "../i18n"
import { range } from "lodash"

//TODO: move to trans/Date.jsx
const Daily = "Daily"
const DailyTrans = {
  zh: "每日",
  en: "Everyday"
}

const Weekly = "Weekly"
const WeeklyTrans = {
  zh: "每周",
  en: "Every Week"
}

const Biweekly = "DoubleWeekly"
const BiweeklyTrans = {
  zh: "双周",
  en: "Bi-Weekly"
}

const Monthly = "Monthly"
const MonthlyTrans = {
  zh: "每月",
  en: "Every Month"
}

const Instantly = "Instantly"

export const isMonthlySettlementInterval = (value) => value == Monthly

export const SettlementIntervalTypeSelect = ({
  placeholder,
  placeholderDisabled = false,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "周期",
    en: "Cycle"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(DailyTrans),
      value: Daily
    },
    {
      label: useTrans(WeeklyTrans),
      value: Weekly
    },
    {
      label: useTrans(BiweeklyTrans),
      value: Biweekly
    },
    {
      label: useTrans(MonthlyTrans),
      value: Monthly
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const MonthlyDaySelect = ({ ...props }) => {
  let options = range(1, 29).map((day) => ({
    label: day,
    value: `${day}`
  }))

  return (
    <Select
      placeholder={useTrans({
        zh: "每月最後一天",
        en: "Last day of the month"
      })}
      options={options}
      {...props}
    />
  )
}

export default {
  Daily,
  Weekly,
  Biweekly,
  Monthly,
  Instantly
}
