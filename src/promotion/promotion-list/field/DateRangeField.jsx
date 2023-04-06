import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Text, Button } from "bumbag"
import { Trans, useTrans } from "../../../i18n"
import { DateInputRange } from "../../../date/DateTimeRangeInput"
import { NormalLabel } from "../../../form/Label"
import { useIsAddPromotion } from "../usePromotionFormData"
import { today } from "../../../date/range"
import { isValidDate } from "../../../date/isValidDate"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { parseISO, isAfter, isBefore } from "date-fns"

const FromFieldName = "from"
export const usePromotionStart = () => {
  let { control } = useFormContext()
  let start = useWatch({
    control,
    name: FromFieldName
  })

  if (!isValidDate(start)) {
    return null
  }
  return start
}

export const useIsBeforePromotionStart = () => {
  let start = usePromotionStart()

  if (!isValidDate(start)) {
    return false // or should return null instead?
  }

  let now = new Date()
  let isBeforeStart = isBefore(now, start)
  return isBeforeStart
}

export const useIsAfterPromotionStart = () => {
  let start = usePromotionStart()

  if (!isValidDate(start)) {
    return false // or should return null instead?
  }

  let now = new Date()
  let isAfterStart = isAfter(now, start)
  return isAfterStart
}

const ToFieldName = "to"

export const PromotionDateRangeFieldBox = ({ readOnly }) => {
  let isAdd = useIsAddPromotion()

  let { start: startOfToday } = today()

  let disabled = readOnly
  return (
    <>
      <NormalLabel>
        <Trans zh="活动时间" en="Promotion Period" />
      </NormalLabel>
      <Box id="promotion-period-box" alignY="center">
        <DateInputRange
          startProps={{
            name: FromFieldName,
            addonAfter: <Button isStatic>00:00:00</Button>
          }}
          endProps={{
            name: ToFieldName,
            addonAfter: <Button isStatic>00:00:00</Button>,
            minDate: startOfToday
          }}
          minDate={isAdd ? startOfToday : undefined}
          disabled={disabled}
          required
        />
      </Box>
    </>
  )
}
