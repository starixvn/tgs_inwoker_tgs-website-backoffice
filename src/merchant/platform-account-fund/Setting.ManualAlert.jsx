import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Stack, Text, FieldStack, Columns } from "bumbag"
import {
  Trans,
  useLocale,
  useTrans,
  Locales,
  FormattedNumberDecimalPercentage
} from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { PercentageNumberInputField } from "../../input/NumberInput"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"

export const TabId = "manualAlert"

//TODO: rm Manual alert tab?
export const ManualAlertTab = (props) => (
  <Tab tabId={TabId} {...props}>
    <Trans zh="通知信-手動" en="Manual Alert" />
  </Tab>
)

export const ManualAlertPanel = ({ ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === TabId
  //TODO: return null if not active?

  return (
    <TabPanel tabId={TabId} {...props}>
      <FieldStack></FieldStack>
    </TabPanel>
  )
}
