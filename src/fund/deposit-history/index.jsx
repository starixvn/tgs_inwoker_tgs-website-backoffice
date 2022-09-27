import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useLocation } from "react-router-dom"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Flex,
  Level,
  FieldStack,
  FieldWrapper,
  useToasts,
  Dialog,
  Card,
  Alert,
  Blockquote
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  FormattedNumberDecimal,
  Trans,
  useLangCode,
  useTrans
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { today } from "../../date/range"
import { Update } from "./menu"
import {
  PaymentMethodLabel,
  PaymentMethodSelect
} from "../../payment/method/PaymentMethod"
import { SortOrder } from "../../table/order"
import { startOfNextDay } from "../../date/startOfNextDay"
import { sortBy, head } from "lodash-es"
import { isDev } from "../../env"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client"
import { subDays, parseISO, isAfter, isSameDay, isValid, max } from "date-fns"
import { SearchBar, Summary, useColumns } from "../deposit"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  return (
    <PageContent
      title={<Trans zh="历史存款列表" en="Historical Deposit List" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar />
        </Level>
      }
    >
      <FieldStack>
        <Summary />
      </FieldStack>
    </PageContent>
  )
}
