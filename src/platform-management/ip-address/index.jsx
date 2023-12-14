import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  Flex,
  Button,
  Text,
  Switch,
  Input,
  Stack,
  Dialog
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { View, Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import {
  SamePlayerIpAddressTabId,
  SamePlayerIpAddressTab,
  SamePlayerIpAddressTabPanel
} from "./SamePlayerIpAddress"
import {
  PlayerIPAddressByUsernameTab,
  PlayerIPAddressByUsernameTabPanel
} from "./PlayerIpAddressByUsername"
import {
  PlayerByIpAddressTabId,
  PlayerByIpAddressTab,
  PlayerByIpAddressTabPanel
} from "./PlayerByIpAddress"
import { Trans } from "../../i18n"
import { CheckIPTrans } from "../../trans/Platform"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        id="page-merchant-bar"
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  let DefaultTab = SamePlayerIpAddressTabId
  let tab = useTabState({
    selectedId: DefaultTab
  })

  const activePlayerIPAddressByUsernameTab = () => {
    tab.select(PlayerByIpAddressTabId)
  }

  let table = useTable({
    brandId
  })

  let { setState, setPageIndex, setSortOrder } = table

  useEffect(() => {
    setState({
      brandId,
      pageIndex: 0,
      ipType: undefined,
      userName: undefined,
      ipAddress: undefined
    })
    tab.select(DefaultTab)
  }, [brandId])

  return (
    <PageContent title={<CheckIPTrans />}>
      <Tabs>
        <TabList {...tab}>
          <SamePlayerIpAddressTab {...tab} />
          <PlayerIPAddressByUsernameTab {...tab} />
          <PlayerByIpAddressTab {...tab} />
        </TabList>
        <SamePlayerIpAddressTabPanel
          table={table}
          brandId={brandId}
          onClickIpAddress={(ipAddress) => {
            setState({
              ipAddress,
              pageIndex: 0
            })
            activePlayerIPAddressByUsernameTab()
          }}
          {...tab}
        />
        <PlayerIPAddressByUsernameTabPanel
          table={table}
          brandId={brandId}
          onClickIpAddress={(ipAddress) => {
            setState({
              ipAddress,
              pageIndex: 0
            })
            activePlayerIPAddressByUsernameTab()
          }}
          {...tab}
        />
        <PlayerByIpAddressTabPanel table={table} brandId={brandId} {...tab} />
      </Tabs>
    </PageContent>
  )
}
