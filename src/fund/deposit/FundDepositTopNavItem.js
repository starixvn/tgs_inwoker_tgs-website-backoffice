import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
  useParams,
  useRouteMatch
} from "react-router-dom"
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
import { useFundDepositFormList } from "./client"
import { DefaultUrl, Code as ParentCode } from "../menu"
import { Code, View, Update } from "./menu"
import TopNavNotifyItem from "../TopNavNotifyItem"
import { deposit } from "../../audio/deposit"
import { FundDepositVerified } from "./VerifyFundDeposit"
import FundDepositStatus from "./FundDepositStatus"

export const FundDepositTopNavItem = ({
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
  return (
    <TopNavNotifyItem
      brandId={brandId}
      audio={playAlertSound ? deposit() : undefined}
      useFetch={useFundDepositFormList}
      status={FundDepositStatus.Review} //v1.8
      // status={[FundDepositStatus.Review, FundDepositStatus.WaitingPayment]} //v1.9
      updateFetchEventName={FundDepositVerified}
      {...props}
    >
      <Trans zh="充值" en="Deposit" />
    </TopNavNotifyItem>
  )
}

export default FundDepositTopNavItem
