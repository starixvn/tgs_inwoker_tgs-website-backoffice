import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Button } from "bumbag"
import { Trans } from "../i18n"
import startOfYesterday from "date-fns/startOfYesterday"
import endOfYesterday from "date-fns/endOfYesterday"
import startOfToday from "date-fns/startOfToday"
import endOfToday from "date-fns/endOfToday"

const Yesterday = "Yesterday"
export const YesterdayButton = ({ onClick, ...props }) => {
  return (
    <Button {...props}>
      <Trans
        zh="昨日"
        en="Yesterday"
        onClick={() => {
          let start = startOfYesterday()
          let end = endOfToday()
          onClick?.({
            type: Yesterday,
            start,
            end
          })
        }}
      />
    </Button>
  )
}

const Today = "Today"
export const TodayButton = ({ onClick, ...props }) => {
  return (
    <Button {...props}>
      <Trans
        zh="昨日"
        en="Yesterday"
        onClick={() => {
          let start = startOfToday()
          let end = endOfYesterday()
          onClick?.({
            type: Today,
            start,
            end
          })
        }}
      />
    </Button>
  )
}

export const DateButtons = ({
  buttons = [YesterdayButton, TodayButton],
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
