import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Text, Button } from "bumbag"
import { Trans, useTrans } from "../../i18n"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { NormalLabel } from "../../form/Label"
import { useIsPromotionAdded } from "./edit"
import { today } from "../../date/range"

export const PromotionDateRangeFieldBox = ({ disabled, readOnly }) => {
  let isAdded = useIsPromotionAdded()
  let isAdd = !isAdded

  let { start: startOfToday } = today()

  let editable = !readOnly
  return (
    <>
      <NormalLabel>
        <Trans zh="活动时间" en="Promotion Period" />
      </NormalLabel>
      <Box id="promotion-period-box" alignY="center">
        <DateInputRange
          startProps={{
            name: "from",
            addonAfter: <Button isStatic>00:00:00</Button>
          }}
          endProps={{
            name: "to",
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
