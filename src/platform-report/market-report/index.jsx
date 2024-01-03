import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, useModalState } from "bumbag"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import { useMarketReportList, API } from "./client"
import { MarketReportWithAgent } from "./MarketReportWithAgent"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { Trans } from "../../i18n"
import { MarketReportTrans } from "../../trans/Platform"

export { Code }

export const Content = () => {
  /*
  TODO: rm
  let [reportFeatureFlag, setReportFeatureFlag] = useState(
    isFeatureMarketReportWithAgentProfit()
  )
  */

  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Report />
  /*
  TODO: rm
  return reportFeatureFlag ? (
    <Report />
  ) : (
    <Body setReportFeatureFlag={setReportFeatureFlag} />
  )
  */
}

export const CodeContentPair = [Code, Content]

const Report = () => {
  return (
    <PlatformPageContent title={<MarketReportTrans />}>
      <ReportBody />
    </PlatformPageContent>
  )
}

const ReportBody = () => {
  let brandId = usePlatformId()
  return (
    <MarketReportWithAgent
      brandId={brandId}
      useFetch={useMarketReportList}
      exportUrl={`${API}/exportMarkets`}
    />
  )
}

/*
TODO: rm
export const Body = ({ setReportFeatureFlag }) => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set
      orientation="vertical"
      isFilled
      onClick={() => {
        setReportFeatureFlag(isFeatureMarketReportWithAgentProfit())
      }}
    >
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && (
        <MarketReport
          brandId={brandId}
          useFetch={useMarketReportList}
          exportUrl={`${API}/exportMarkets`}
        />
      )}
    </Set>
  )
}
*/
