import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import { pastWeek } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab, TabPanel } from "../../tab"
import textColumn from "../../table/column/textColumn"
import { Descending, SortOrder } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { usePlayerPromotions } from "./client"
import { useForm, FormProvider, useFormContext } from "react-hook-form"

export const Key = "vip-change-list"

export const PlayerVipChangeListTab = ({ ...props }) => {
  return (
    <Tab tabId={Key} {...props}>
      <Trans zh="VIP升降记录" en="VIP Records" />
    </Tab>
  )
}

export const PlayerVipChangeListPanel = ({ brandId, playerCode, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  //TODO
}
