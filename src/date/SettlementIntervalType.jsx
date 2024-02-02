import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Select } from "../select/Select"
import { useTrans } from "../i18n"
import { range } from "lodash"

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

const Biweekly = "Biweekly"
const BiweeklyTrans = {
  
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
  Monthly,
  Instantly
}
