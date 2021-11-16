import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
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
  TopNav,
  Icon
} from "bumbag"
import {
  useMenuCodes,
  useUserBrandId,
  useIsDisplayMenuByCodes
} from "../../user/context"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import clone from "clone-deep"
import {
  useFundWithdrawFormList,
  useUnprocessedFundWithdrawForm
} from "./client"
import { SortOrder } from "../../table/order"
import { sortBy, head, differenceBy } from "lodash-es"
import { subDays, addSeconds, setMilliseconds } from "date-fns"
import { DefaultUrl, Code as ParentCode } from "../menu"
import { Code, View, Update } from "./menu"
import TopNavNotifyItem from "../TopNavNotifyItem"
import { withdraw } from "../../audio/withdraw"
import { FundWithdrawVerified } from "./VerifyFundWithdraw"
import FundWithdrawStatus from "./FundWithdrawStatus"
import { isDev } from "../../env"

export const FundWithdrawTopNavItem = ({
  href = `${DefaultUrl}/${Code}`,
  ...props
}) => {
  let brandId = useUserBrandId()
  let readable = useIsDisplayMenuByCodes([ParentCode, Code, View])

  if (!brandId || !readable) {
    return null
  }

  return <Body brandId={brandId} href={href} {...props} />
}

const Body = ({ brandId, ...props }) => {
  let playAlertSound = useIsDisplayMenuByCodes([ParentCode, Code, Update])
  let label = useTrans({
    zh: "提款",
    en: "Withdraw"
  })

  return (
    <TopNavNotifyItem
      brandId={brandId}
      audio={playAlertSound ? withdraw() : undefined}
      useFetch={useUnprocessedFundWithdrawForm}
      status={FundWithdrawStatus.UnprocessedStatus}
      updateFetchEventName={FundWithdrawVerified}
      {...props}
    >
      {label}
    </TopNavNotifyItem>
  )
}

export default FundWithdrawTopNavItem
